const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const cors = require('cors');

const app = express();

const {
  mainRoute,
  artRoute
} = require('./routes');

app.options('*', cors());
app.use(bodyParser.json({ strict: false }));

mainRoute(app);

artRoute(app);

module.exports.handler = serverless(app);
