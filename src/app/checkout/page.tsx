'use server';
import Checkout from '../components/Checkout';
import { redirect } from 'next/navigation';
import { auth } from '../../config/auth';

export default async function Page({ searchParams }) {
  const session = await auth();
  if (!session) return redirect('/login');
  const sessionToken = session.sessionToken;
  let { id } = searchParams;
  const { payment_intent } = searchParams;
  if (!id) {
    id = await Parse.Cloud.run('checkoutCart', {}, { sessionToken })
      .then(pics => pics._id)
      .catch(e => redirect(`/500?message=${e.message}`));
    return redirect(`/checkout?id=${id}`);
  }
  const transaction = await new Parse.Query('Transaction')
    .equalTo('objectId', id)
    .first({ sessionToken })
    .then(transaction => transaction.toJSON())
    .catch(e => redirect(`/error?message=${e.message}`));
  if (!transaction)
    return redirect(`/error?message=${encodeURIComponent('You have an empty cart.')}`);
  if (!payment_intent && transaction.status !== 'requires_payment_method')
    return redirect(
      `/checkout?${new URLSearchParams({
        id,
        payment_intent: id,
        client_secret: transaction.client_secret,
        redirect_status: transaction.status,
      }).toString()}`
    );
  return (
    <Checkout
      transaction={transaction}
      products={transaction.products}
      clientSecret={transaction.client_secret}
    />
  );
}
