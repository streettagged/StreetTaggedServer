const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const {
  mainRoute,
  artRoute
} = require('./routes');

const { mongoDB } = require('./database');
const { auth } = require('./middleware');

const app = express();

app.use(bodyParser.json({ }));

connectToDatabase();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, x-amz-date, Content-Type, X-Amz-Security-Token');
    next();
});

app.use(auth);

mainRoute(app);

artRoute(app);

module.exports.handler = serverless(app);
