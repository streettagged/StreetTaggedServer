const uuid = require('uuid');

const { dynamoDB: { dynamoDB } } = require('./../database');

const artController = {};

const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;

artController.getArt = async (req, res) => {
  try {
    const params = {
      TableName: process.env.ART_TABLE
    };
    const results = await dynamoDB().scan(params).promise();
    if (results.Items) {
      const { Items, Count } = results;
      res.status(STATUS_OK);
      res.json({ count: Count, artWorks: Items});
    } else {
      res.status(STATUS_BAD_REQUEST);
      res.send();
    }
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.getArtByID = async (req, res) => {
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

artController.postArt = async (req, res) => {
  try {
    const {
      isActive, isFeatured, picture,
      name, artist, address, about,
      registered, coordinates, tags,
      category
    } = req.body;

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

    await dynamoDB().put(params).promise();

    res.status(STATUS_OK);
    res.json(params.Item);
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

module.exports = artController;
