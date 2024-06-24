// Example express application adding the parse-server module to expose Parse
// compatible API routes.

import express from 'express';
import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';
import crypto from 'crypto';

import ip from 'ip';
import dotenv from 'dotenv';

import next from 'next';

import http from 'http';
import os from 'os';
import { parse } from 'url';
import { AppCache } from 'parse-server/lib/cache.js';
import { Collection } from 'mongodb';
import Stripe from 'stripe';

const hostname = os.hostname();
const currentIp = ip.address();
const production = process.env.NODE_ENV === 'production';
const test = process.env.NODE_ENV === 'test';
const dev = !production && !test;
if (dev) dotenv.config({ path: './.env', debug: true });

const port = parseInt(process.env.PORT) || 3000;

const schema: any = {
  _id: 'Transaction',
  objectId: 'string',
  updatedAt: 'date',
  createdAt: 'date',
  _metadata: {
    indexes: {
      _id_: {
        _id: 1,
      },
    },
    fields_options: {
      id: {
        required: false,
      },
      products: {
        required: false,
      },
    },
  },
  amount_details: 'object',
  object: 'string',
  amount: 'number',
  amount_capturable: 'number',
  capture_method: 'string',
  confirmation_method: 'string',
  created: 'number',
  client_secret: 'string',
  amount_received: 'number',
  metadata: 'object',
  status: 'string',
  payment_method_options: 'object',
  payment_method_types: 'array',
  automatic_payment_methods: 'object',
  currency: 'string',
  livemode: 'boolean',
  id: 'string',
  products: 'array',
};

export const config = {
  appName: 'Store',
  databaseURI:
    process.env.MONGODB_URI ||
    `mongodb://${hostname}:27017,${hostname}:27018,${hostname}:27019/store?replicaSet=rs`,
  cloud: async () => {
    const app = AppCache.get(Parse.applicationId);
    const adapter = app.databaseController.adapter;
    await import('./cloud/main.js');
    const collection: Collection = await adapter.database.collection('_SCHEMA');
    await collection.findOneAndUpdate({ _id: 'Transaction' }, { $set: schema }, { upsert: true });
    await collection.findOneAndUpdate(
      { _id: 'Product' },
      {
        $set: { _id: 'Product' },
        objectId: 'string',
        updatedAt: 'date',
        createdAt: 'date',
        _metadata: {
          indexes: {
            _id_: {
              _id: 1,
            },
          },
        },
      },
      { upsert: true }
    );
    await collection.findOneAndUpdate(
      { _id: 'Cart' },
      {
        $set: { _id: 'Cart' },
        objectId: 'string',
        updatedAt: 'date',
        createdAt: 'date',
        _metadata: {
          indexes: {
            _id_: {
              _id: 1,
            },
          },
        },
      },
      { upsert: true }
    );
  },
  appId: process.env.APP_ID || 'mobile',
  masterKey: process.env.MASTER_KEY || crypto.randomUUID().toString(),
  serverURL: process.env.SERVER_URL || `http://localhost:${port}/parse`,
  publicServerURL: process.env.PUBLIC_SERVER_URL || `http://${currentIp}:${port}/parse`,
  allowClientClassCreation: false,
  allowExpiredAuthDataToken: false,
  masterKeyIps: ['0.0.0.0/0', '::/0'],
};

const users = !dev
  ? [
      {
        user: process.env.DASHBOARD_USERNAME,
        pass: process.env.DASHBOARD_PASSWORD,
        mfa: process.env.DASHBOARD_MFA,
      },
      {
        user: process.env.DASHBOARD_READ_ONLY_USERNAME,
        pass: process.env.DASHBOARD_READ_ONLY_PASSWORD,
        mfa: process.env.DASHBOARD_READ_ONLY_MFA,
        readOnly: true,
      },
    ]
  : undefined;

const dashboard = new ParseDashboard({
  apps: [
    {
      appName: config.appName,
      serverURL: config.serverURL,
      publicServerURL: config.publicServerURL,
      appId: config.appId,
      masterKey: config.masterKey,
      iconName: 'vercel.svg',
      supportedPushLocales: ['en', 'ar'],
      production,
    },
  ],
  users,
  iconsFolder: 'public',
  useEncryptedPasswords: true,
  allowInsecureHTTP: !production,
});

export const app = express();

if (production) app.set('trust proxy', true);

app.use(async function (req, res, next) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;

  const requestIsLocal =
    req.connection.remoteAddress === '127.0.0.1' ||
    req.connection.remoteAddress === '::ffff:127.0.0.1' ||
    req.connection.remoteAddress === '::1';

  if (req.secure || requestIsLocal) {
    return next();
  } else {
    // Only redirect GET methods
    if (req.method === 'GET' || req.method === 'HEAD') {
      return res.redirect(301, 'https://' + host + req.originalUrl);
    } else {
      return res.status(403).json({ error: 'Please use secure HTTPS when submitting data.' });
    }
  }
});

// when using middleware `hostname` and `port` must be provided below
const nextApp = next({ dev, port });
const handle = nextApp.getRequestHandler();

// Serve the Parse API on the /parse URL prefix
const server = new ParseServer(config);
await Promise.all([server.start(), nextApp.prepare()]);
app.use('/parse', server.app);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = new Stripe(process.env.STRIPE_SECRET);
app.use('/stripe-payment', express.raw({ type: 'application/json' }), async (req, res) => {
  await Promise.resolve()
    .then(async () => {
      const sig = req.headers['stripe-signature'];
      const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      const object: any = event?.data?.object;
      const transaction = await new Parse.Query('Transaction')
        .equalTo('id', object.id)
        .first({ useMasterKey: true });
      await transaction.save(object, { useMasterKey: true }); // this will update the transaction data
      res.status(200).json({ success: true });
    })
    .catch(e => {
      res.status(400).json({ code: e.code, message: e.message });
    });
});
app.use('/parse-dashboard', dashboard);
app.all('*', (req, res) => handle(req, res, parse(req.url, true)));

export const httpServer = http.createServer(app);
httpServer.listen(port, function () {
  console.log('store running on port ' + port + '.');
});

export default httpServer;
