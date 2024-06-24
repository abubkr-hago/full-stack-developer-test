import { AppCache } from 'parse-server/lib/cache.js';
import { compare } from 'parse-server/lib/password.js';
import crypto from 'crypto';
import Stripe from 'stripe';
import { ClientSession, Collection } from 'mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET);

const app = AppCache.get(Parse.applicationId);
const adapter = app.databaseController.adapter;

Parse.Cloud.define('changePassword', async ({ user, params }) => {
  if (!user) throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Please Sign in first.');
  const { old_password, new_password } = params;
  if (!old_password)
    throw new Parse.Error(Parse.Error.OTHER_CAUSE, 'Missing old_password parameter.');
  if (!new_password)
    throw new Parse.Error(Parse.Error.OTHER_CAUSE, 'Missing new_password parameter.');
  const [dbUser] = await adapter.find('_User', { fields: {} }, { objectId: user.id }, { limit: 1 });
  if (!dbUser) throw new Parse.Error(Parse.Error.OTHER_CAUSE, 'Invalid user.');
  if (!(await compare(old_password, dbUser._hashed_password)))
    throw new Parse.Error(Parse.Error.OTHER_CAUSE, 'Invalid old password.');
  return user.save({ password: new_password }, { sessionToken: user.getSessionToken() });
});

// This must be in a mongodb session, to ensure data is ACID
Parse.Cloud.define('checkoutCart', async ({ user }) => {
  if (!user) throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Please Sign in first.');
  const transactionId = crypto.randomBytes(32 / 2).toString('hex');
  const session: ClientSession = await adapter.createTransactionalSession();
  return Promise.resolve()
    .then(async () => {
      const { modifiedCount } = await adapter.updateObjectsByQuery(
        'Cart',
        { fields: {} },
        { _p_user: `_User$${user.id}`, _p_transaction: { $exists: false } },
        { _p_transaction: `Transaction$${transactionId}` },
        session
      );
      if (!modifiedCount) {
        throw new Parse.Error(Parse.Error.OTHER_CAUSE, 'You have an empty cart.');
      }
      // adapter.aggregate doesn't support sessions, using adapter.database
      const cartCollection: Collection = adapter.database.collection('Cart'); // this is a mongodb collection
      const products = await cartCollection
        .aggregate(
          [
            { $match: { _p_transaction: `Transaction$${transactionId}` } },
            {
              $lookup: {
                from: 'Product',
                as: '_p_product',
                let: {
                  pointerId: {
                    $substr: [
                      `$_p_product`,
                      'Product$'.length,
                      { $strLenCP: { $ifNull: [`$_p_product`, ''] } },
                    ],
                  },
                },
                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$pointerId'] } } }],
              },
            },
            {
              $set: {
                product: {
                  $cond: [
                    { $gt: [{ $size: `$_p_product` }, 0] },
                    { $first: `$_p_product` },
                    '$$REMOVE',
                  ],
                },
                _p_product: '$$REMOVE',
              },
            },
          ],
          { session }
        )
        .toArray();
      const amount = Math.ceil(
        parseFloat(products.reduce((amount, doc) => amount + doc.product.price, 0))
      );
      if (!amount || isNaN(amount))
        throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Unknown error occurred.');
      if (amount < 2) throw new Parse.Error(Parse.Error.OTHER_CAUSE, 'Least amount is 2 AED.');
      const pics: any = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'AED',
      });
      pics.products = products; // a copy because products might get deleted, or the price changes
      pics.amount = amount;
      pics._created_at = new Date();
      pics._updated_at = pics._created_at;
      pics._id = transactionId;
      const transactionCollection: Collection = adapter.database.collection('Transaction');
      await transactionCollection.insertOne(pics, { session });
      await adapter.commitTransactionalSession(session);
      return pics;
    })
    .catch(async e => {
      if (!session.hasEnded) await adapter.abortTransactionalSession(session);
      throw e;
    });
});
