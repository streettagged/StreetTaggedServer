const uuidv4 = require('uuid/v4');

const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;

const fs = require('fs');
const AWS = require('aws-sdk');
const mime = require('mime-types');

const DEFAULT_PAGE_NUMBER = 1;
const PAGINATION_PAGE_LIMIT = 5;

streamController.newUser = async (req, res) => {
  try {
    console.log(req)
    // Instantiate a feed object server side
user1 = client.feed('user', '1');
    // Create a new activity
activity = { actor: 1, verb: 'tweet', object: 1, foreign_id: 'tweet:1' };
user1.addActivity(activity);

    res.status(STATUS_OK);
    res.json({ items });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};


module.exports = streamController;
