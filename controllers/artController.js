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
    const { sub, username } = req.user;

    let artWorks = [];
    let queries = [];

    if (latitude && longitude && maxDistance) {
      queries.push({
        '$geoNear': {
          includeLocs: 'location',
          distanceField: 'distance',
          near: {
            type: 'Point', coordinates: [longitude, latitude]
          },
          maxDistance: maxDistance,
          spherical: true
        }
      });
    }

    if (tags.length > 0) {
      queries.push({
        '$match': {
          tags: { $in: tags }
        }
      });
    }

    artWorks = await ArtWork.aggregate([
      ... queries,
      {
        '$lookup': {
           from: 'favorites',
           localField: 'artId',
           foreignField: 'artId',
           as: 'favorites'
        }
      }, {
        '$addFields': { favIds:
            {
              '$map':
                 {
                   input: "$favorites",
                   as: "fav",
                   in: '$$fav.userId'
                 }
            }
        }
      }, {
        '$addFields': {
          isFavorited: {
            "$in": [ sub, "$favIds" ]
          }
        }
      }, {
        '$project': {
          '_id': 0,
          '__v': 0,
          'favIds': 0,
          'favorites': 0
        }
      }
    ]);

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
    const { sub, username } = req.user;
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
      username,
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
