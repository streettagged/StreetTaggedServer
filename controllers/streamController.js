const uuidv4 = require('uuid/v4');
const getStream = require('getstream')

const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;


const streamController = {};

streamController.newActivity = async (req, res) => {
  try {
    console.log("Calling New Activity endpoint")
    const {
      actor,
      tweet,
      verb
    } = req.body;

    params = {
      "actor": actor, 
       "tweet": tweet, 
      "verb": verb, 
        object: 1
    }
    console.log(params)
    console.log(streamClient)
    var userFeed = streamClient.feed('user', 'dave', 'KOfHck9zlrO37ggufXkQLb1QC2g');
  // Add the activity to the feed
    userFeed.addActivity({
    actor: 'Dave', 
    tweet: 'Hello world', 
    verb: 'tweet', 
    object: 1
    });
    res.status(STATUS_OK);
    res.json({ items });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

module.exports = streamController;
