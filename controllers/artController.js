const uuidv4 = require('uuid/v4');
const stream = require('getstream');

const { ArtWork } = require('./../models');

const artController = {};

const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;

const fs = require('fs');
const AWS = require('aws-sdk');
const mime = require('mime-types');

const DEFAULT_PAGE_NUMBER = 1;
const PAGINATION_PAGE_LIMIT = 5;

const POST_ACTION = 'post';
const TAG_SLUG_NAME = 'tag';

const GET_STREAM_GLOBAL_FEED_NAME = 'global_user';

const streamClient = stream.connect(
  process.env.STREAM_KEY,
  process.env.STREAM_SECRET,
);

const getTagLinks = (text) => {
  let tags = [];
  var regexp = /#(\w+)/g;
  var match = regexp.exec(text);
  while (match != null){
    tags.push(TAG_SLUG_NAME + ':' + match[1]);
    match = regexp.exec(text)
  }
  return tags;
}

artController.searchItem = async (req, res) => {
  try {
    const {
      latitude = null,
      longitude = null,
      maxDistance = null,
      tags = [],
      pageNumber = DEFAULT_PAGE_NUMBER,
      pageLimit = PAGINATION_PAGE_LIMIT
    } = req.body;

    let items = [];
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

    let user = req.user;
    if (user) {
      const { sub, username } = user;

      if (tags.length > 0) {
        queries.push({
          '$match': {
            tags: { $in: tags }
          }
        });
      }

      queries.push({
        '$match': {
          isActive: true
        }
      });

      items = await ArtWork.aggregate([
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
        items,
        count: items.length,
        pageNumber,
        pageLimit: +pageLimit
      });
    } else {
      if (tags.length > 0) {
        queries.push({
          tags: { $in: tags }
        });
      }

      queries.push({
          isActive: true
      });

      items = await ArtWork.find({
        $and: queries
      }).sort({ createdAt: -1 }).skip(pageLimit * (pageNumber - 1)).limit(+pageLimit);
      res.status(STATUS_OK);
      res.json({
        items,
        count: items.length,
        pageNumber,
        pageLimit: +pageLimit
      });
    }
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.getItem = async (req, res) => {
  try {
    const items = await ArtWork.find({ }).sort({ _id: -1 });
    res.status(STATUS_OK);
    res.json({ items });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.getItemForReview = async (req, res) => {
  try {
    const item = await ArtWork.findOne({ isActive: false, isReviewing: false });
    if (item) {
      item.isReviewing = true;
      await item.save()
    }
    res.status(STATUS_OK);
    res.json({ item: item ? [item] : [] });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.detectModerationLabels = async (req, res) => {
  try {
    const {
      bucket,
      name
    } = req.body;

    params = {
      "Image": {
          "S3Object": {
              "Bucket": bucket,
              "Name": name
          }
      },
      MinConfidence: '75'
    }

  rekognition = new AWS.Rekognition()

  rekognition.detectModerationLabels(params, function(e, data) {
    if (e) {
      res.status(STATUS_BAD_REQUEST);
      res.json({ error: e });
    } else { // successful response
      res.status(STATUS_OK);
      data = data["ModerationLabels"];
      res.json({ data });
      }
  });

  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }

};

artController.detectTags = async (req, res) => {
  try {
    const {
      bucket,
      name
    } = req.body;

    params = {
      "Image": {
          "S3Object": {
              "Bucket": bucket,
              "Name": name
          }
      },
      MinConfidence: '75'
    }

  rekognition = new AWS.Rekognition()

  rekognition.detectLabels(params, function(e, data) {
    if (e) {
      res.status(STATUS_BAD_REQUEST);
      res.json({ error: e });
    } else { // successful response
      res.status(STATUS_OK);
      res.json({ data });
      }
  });

  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }

};


artController.getItemReviewUpdate = async (req, res) => {
  try {
    const { itemId, isValid } = req.body;
    if (isValid) {
      await ArtWork.updateOne({ artId: itemId }, { isActive: true });
    } else {
      await ArtWork.updateOne({ artId: itemId }, { isActive: false, isBlocked: true });
    }
    res.status(STATUS_OK);
    res.send();
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.getItemByID = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ArtWork.findOne({ artId: itemId });
    res.status(STATUS_OK);
    res.json({ item });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.postItem = async (req, res) => {
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

    const item = await ArtWork.create({
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

    let timeline = streamClient.feed('timeline', username);

    const gsresult = await timeline.addActivity({
      'actor': streamClient.user(username).ref(),
      'time': Date.now(),
      'verb': POST_ACTION,
      'object': {
        'text': about,
        'image': picture,
        'coordinates': [coordinates.longitude, coordinates.latitude],
      },
      'to': getTagLinks(about),
    });

    try {
      let global_user_timeline = streamClient.feed('timeline', GET_STREAM_GLOBAL_FEED_NAME);

      const gsresult = await global_user_timeline.addActivity({
        'actor': streamClient.user(username).ref(),
        'time': Date.now(),
        'verb': POST_ACTION,
        'object': {
          'text': about,
          'image': picture,
          'coordinates': [coordinates.longitude, coordinates.latitude],
        }
      });
    } catch (e) { }

    res.status(STATUS_OK);
    res.json({ item });
  } catch (e) {
    console.log(e);
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

artController.getModelData = async (req, res) => {
  try {
    const item = await ArtWork.find({ isActive: true }).select('tags picture');
    res.status(STATUS_OK);
    res.json({ item });
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

module.exports = artController;
