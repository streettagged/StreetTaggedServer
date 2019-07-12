const uuidv4 = require('uuid/v4');

const { ArtWork } = require('./../models');

const artController = {};

const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;

artController.searchArt = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance } = req.body;
    const artWorks = await ArtWork.find({
      location: {
          $near: { $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
                },
                $maxDistance: maxDistance
          }
      }
    });
    console.log(artWorks);
    res.status(STATUS_OK);
    res.json({ artWorks });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.getArt = async (req, res) => {
  try {
    const artWorks = await ArtWork.find({ });
    res.status(STATUS_OK);
    res.json({ artWorks });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.getArtByID = async (req, res) => {
  try {
    const { artId } = req.params;
    const artWork = await ArtWork.findOne({ artId });
    res.status(STATUS_OK);
    res.json({ artWork });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.postArt = async (req, res) => {
  try {
    const {
      isActive,
      isFeatured,
      picture,
      name,
      artist,
      address,
      about,
      coordinates,
      tags,
      category
    } = req.body;

    const art = await ArtWork.create({
      artId: uuidv4(),
      isActive,
      isFeatured,
      picture,
      name,
      artist,
      address,
      about,
      tags,
      category,
      location: {
        type: 'Point',
        coordinates: [coordinates.longitude, coordinates.latitude]
      },
    });
    res.status(STATUS_OK);
    res.json({ art });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

module.exports = artController;
