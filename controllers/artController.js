const { dynamoDB: { dynamoDB } } = require('./../database');

const artController = {};

const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;

artController.getArt = async (req, res) => {
  try {
    const params = {
      TableName: process.env.ART_TABLE,
      Key: {
        artId: req.params.artId,
      },
    }
    const results = await dynamoDB().get(params).promise();
    if (results.Item) {
      const { Item } = results;
      res.header("Access-Control-Allow-Origin", "*");
      res.status(STATUS_OK);
      res.json(Item);
    } else {
      res.status(STATUS_BAD_REQUEST);
      res.json({ error: "Art not found" });
    }
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.postArt = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  const { isActive, isFeatured, picture, name, artist, address, about, registered, coordinates, tags, category } = req.body;
  if (typeof artId !== 'string') {
    res.status(400).json({ error: '"artId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: process.env.ART_TABLE,
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

  dynamoDB().put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create art' });
    }
    res.json(params.Item);
  });
};


module.exports = artController;
