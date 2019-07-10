// index.js

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const uuid = require('uuid')
const cors = require('cors')

const ART_TABLE = process.env.ART_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};
app.options('*', cors())
app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  res.send('Street Tagged!')
})

// Get Street Art endpoint
app.get('/art/:artId', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  const params = {
    TableName: ART_TABLE,
    Key: {
      artId: req.params.artId,
    },
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get art' });
    }
    if (result.Item) {
       res.json(result);
    } else {
      res.status(404).json({ error: "Art not found" });
    }
  });
})

// Create Art endpoint
app.post('/art', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  console.log(req.body)
  const { isActive, isFeatured, picture, name, artist, address, about, registered, coordinates, tags, category } = req.body;

  const params = {
    TableName: ART_TABLE,
    Item: {
      artId: uuid.v1(),
      isActive: isActive,
      isFeatured: isFeatured,
      picture: picture,
      name: name,
      artist: artist,
      address: address,
      about: about,
      registered: registered,
      coordinates: coordinates,
      tags,
      category
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create art' });
    }
    res.json(params.Item);
  });
})


module.exports.handler = serverless(app);