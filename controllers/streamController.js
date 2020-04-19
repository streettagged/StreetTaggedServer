const uuidv4 = require('uuid/v4');
const stream = require('getstream');

const { ArtWork } = require('./../models');

const streamController = {};
const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;

const streamClient = stream.connect(
  process.env.STREAM_KEY,
  process.env.STREAM_SECRET,
);

const GET_STREAM_GLOBAL_FEED_NAME = 'global_user';

streamController.getToken = async (req, res) => {
  try {
    let userToken = '';
    if (req.body.userId) {
      userToken = streamClient.createUserSessionToken(req.body.userId);
    } else {
      userToken = streamClient.createUserSessionToken(GET_STREAM_GLOBAL_FEED_NAME);
    }
    res.status(STATUS_OK);
    res.json({ userToken, userId: req.body.userId, key: process.env.STREAM_KEY });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

streamController.getTags = async (req, res) => {
  try {
    const tags = await ArtWork.find({ isActive: true }).distinct('tags');
    res.status(STATUS_OK);
    res.json({ tags  });
  } catch (e) {
    console.log(e);
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

module.exports = streamController;
