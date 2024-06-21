// Example express application adding the parse-server module to expose Parse
// compatible API routes.

import express from 'express';
import { ParseServer } from 'parse-server';
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
  databaseURI:
    process.env.MONGODB_URI ||
    `mongodb://${hostname}:27017,${hostname}:27018,${hostname}:27019/store?replicaSet=rs`,
  cloud: async () => {
    await import('./cloud/main.js');
  },
  appId: process.env.APP_ID || 'mobile',
  masterKey: process.env.MASTER_KEY || crypto.randomUUID().toString(),
  serverURL: process.env.SERVER_URL || `http://${currentIp}:${port}`,
  publicServerURL: process.env.PUBLIC_SERVER_URL || `http://${currentIp}:${port}`,
  allowClientClassCreation: false,
  allowExpiredAuthDataToken: false,
};

export const app = express();

// when using middleware `hostname` and `port` must be provided below
const nextApp = next({ dev, port });
const handle = nextApp.getRequestHandler();

// Serve the Parse API on the /parse URL prefix
const server = new ParseServer(config);
await Promise.all([server.start(), nextApp.prepare()]);
app.use('/parse', server.app);
app.all('*', (req, res) => handle(req, res, parse(req.url, true)));

export const httpServer = http.createServer(app);
httpServer.listen(port, function () {
  console.log('store running on port ' + port + '.');
});

export default httpServer;
