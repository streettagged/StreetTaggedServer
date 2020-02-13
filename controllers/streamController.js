const uuidv4 = require('uuid/v4');

const streamController = {};
const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;

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

module.exports = streamController;
