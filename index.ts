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

const hostname = os.hostname();
const currentIp = ip.address();
const production = process.env.NODE_ENV === 'production';
const test = process.env.NODE_ENV === 'test';
const dev = !production && !test;
if (dev) dotenv.config({ path: './.env', debug: true });

const port = parseInt(process.env.PORT) || 3000;

export const config = {
  appName: 'Store',
  databaseURI:
    process.env.MONGODB_URI ||
    `mongodb://${hostname}:27017,${hostname}:27018,${hostname}:27019/store?replicaSet=rs`,
  cloud: async () => {
    await import('./cloud/main.js');
  },
  appId: process.env.APP_ID || 'mobile',
  masterKey: process.env.MASTER_KEY || crypto.randomUUID().toString(),
  serverURL: process.env.SERVER_URL || `http://localhost:${port}/parse`,
  publicServerURL: process.env.PUBLIC_SERVER_URL || `http://${currentIp}:${port}/parse`,
  allowClientClassCreation: false,
  allowExpiredAuthDataToken: false,
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

// when using middleware `hostname` and `port` must be provided below
const nextApp = next({ dev, port });
const handle = nextApp.getRequestHandler();

// Serve the Parse API on the /parse URL prefix
const server = new ParseServer(config);
await Promise.all([server.start(), nextApp.prepare()]);
app.use('/parse', server.app);
app.use('/parse-dashboard', dashboard);
app.all('*', (req, res) => handle(req, res, parse(req.url, true)));

export const httpServer = http.createServer(app);
httpServer.listen(port, function () {
  console.log('store running on port ' + port + '.');
});

export default httpServer;
