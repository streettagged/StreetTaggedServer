const uuidv4 = require('uuid/v4');

const { ArtWork } = require('./../models');

const artController = {};

const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;

artController.searchArt = async (req, res) => {
  try {
    const {
      latitude = null,
      longitude = null,
      maxDistance = null,
      tags = []
    } = req.body;

    let artWorks = [];
    let queries = [];

    if (latitude && longitude && maxDistance) {
      queries.push({
        location: {
          $near: { $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
                },
                $maxDistance: maxDistance
          }
        }
      })
    }

    if (tags.length > 0) {
      queries.push({
        tags: { $in: tags }
      });
    }

    if (queries.length > 0) {
      artWorks = await ArtWork.find({
        $and: queries
      });
    }

    res.status(STATUS_OK);
    res.json({ artWorks });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.getArt = async (req, res) => {
  try {
    const artWorks = await ArtWork.find({ }).sort({ _id: -1 });
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
    const { sub } = req.user;
    const {
      isActive = true,
      isFeatured = true,
      picture,
      name = '',
      artist = '',
      address = '',
      about = '',
      coordinates = {
        'latitude': 0,
	      'longitude': 0,
      },
      tags = [],
      category = ''
    } = req.body;

    const art = await ArtWork.create({
      artId: uuidv4(),
      userId: sub,
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
