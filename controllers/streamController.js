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

streamController.getToken = async (req, res) => {
  try {
    const {
      userId,
    } = req.body;
    let userToken = streamClient.createUserSessionToken(userId);
    res.status(STATUS_OK);
    res.json({ userToken });
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
