const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();

const {
  mainRoute,
  artRoute
} = require('./routes');

//app.options('*', cors());
app.use(bodyParser.json({ }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, x-amz-date, Content-Type, X-Amz-Security-Token');
    next();
});

mainRoute(app);

artRoute(app);

module.exports.handler = serverless(app);
