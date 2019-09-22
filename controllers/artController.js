const uuidv4 = require('uuid/v4');

const { ArtWork } = require('./../models');

const artController = {};

const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;

const fs = require('fs');
const AWS = require('aws-sdk');
const mime = require('mime-types');

const DEFAULT_PAGE_NUMBER = 1;
const PAGINATION_PAGE_LIMIT = 10;

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_AWS_ACCESS_KEY,
    secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY
});

artController.uploadArt = async (req, res) => {
  try {
    if (req.user) {
      const file = req.file;
      const { sub } = req.user;
      const fileName = sub + '-' + uuidv4() + '.' + mime.extension(req.body.mimetype);
      let buff = Buffer.from(req.body.data, 'base64');  

      const params = {
        Bucket: process.env.S3_BUCKET_PATH, 
        Key: fileName,
        Body: buff,
        ACL: 'public-read',
      };

      var s3 = new AWS.S3();
      s3.upload(params ,function (err, data) {
        if (err) throw err;
        res.status(STATUS_OK);
        res.json({ data });
      });
    } else {
      console.log(req);
      console.log(req.body);
      res.status(STATUS_OK);
      res.json({ });
    }
  } catch (error) {
    console.log(error);
    res.status(STATUS_BAD_REQUEST);
    res.json({ error });
  }
};

artController.searchArt = async (req, res) => {
  try {
    const {
      latitude = null,
      longitude = null,
      maxDistance = null,
      tags = [],
      pageNumber = DEFAULT_PAGE_NUMBER, 
      pageLimit = PAGINATION_PAGE_LIMIT
    } = req.body;
    const { sub, username } = req.user;

    let artWorks = [];
    let queries = [{
      '$match': {
        isActive: true
      }
    }];

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
      }, { 
        '$sort': { 
          'createdAt': -1 
        } 
      },{
        '$skip': pageLimit * (pageNumber - 1)
      },
      {
        '$limit': +pageLimit
      }
    ]);

    res.status(STATUS_OK);
    res.json({ 
      artWorks,
      count: artWorks.length,
      pageNumber,
      pageLimit: +pageLimit
    });
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

artController.getArtForReview = async (req, res) => {
  try {
    const artWork = await ArtWork.findOne({ isActive: false, isReviewing: false });
    if (artWork) {
      artWork.isReviewing = true;
      await artWork.save()
    }
    res.status(STATUS_OK);
    res.json({ artWork: artWork ? [artWork] : [] });
  } catch (e) {
    console.log(e);
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.getArtReviewUpdate = async (req, res) => {
  try {
    const { artId, isValid } = req.body;
    console.log(req.body);
    if (isValid) {
      await ArtWork.updateOne({ artId }, { isActive: true });
    } else {
      await ArtWork.updateOne({ artId }, { isActive: false, isBlocked: true });
    }
    res.status(STATUS_OK);
    res.send();
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
      isActive = false,
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
      isReviewing: false,
      isBlocked: false,
    });
    res.status(STATUS_OK);
    res.json({ art });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.getModelData = async (req, res) => {
  try {
    const artWork = await ArtWork.find({ isActive: true }).select('tags picture');
    res.status(STATUS_OK);
    res.json({ artWork });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

module.exports = artController;
