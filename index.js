const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const {
  mainRoute,
  artRoute,
  favoriteRoute,
  streamRoute
} = require('./routes');

const { mongoDB } = require('./database');
const { getStream } = require('./database');
const { auth } = require('./middleware');

const app = express();

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

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

favoriteRoute(app);

streamRoute(app);

module.exports.handler = serverless(app);
