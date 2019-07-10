const AWS = require('aws-sdk');

const dynamo = {};

let dynamoObject;

if (process.env.IS_OFFLINE === 'true') {
  dynamoObject = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
} else {
  dynamoObject = new AWS.DynamoDB.DocumentClient();
};

dynamo.dynamoDB = () => {
  return dynamoObject;
};

module.exports = dynamo;
