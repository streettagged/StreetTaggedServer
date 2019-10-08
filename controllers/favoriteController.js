const uuidv4 = require('uuid/v4');

const { Favorite, ArtWork } = require('./../models');

const favoriteController = {};

const STATUS_OK = 200;
const STATUS_OK_CREATED = 201;
const STATUS_BAD_REQUEST = 400;
const DEFAULT_PAGE_NUMBER = 1;
const PAGINATION_PAGE_LIMIT = 10;

favoriteController.createFavorite = async (req, res) => {
  try {
    const { sub, username } = req.user;
    const { itemId } = req.body;

    const favId = uuidv4();

    await Favorite.create({
      id: favId,
      userId: sub,
      artId: itemId,
    });

    res.status(STATUS_OK_CREATED);
    res.send();
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

favoriteController.deleteFavorite = async (req, res) => {
  try {
    const { sub, username } = req.user;
    const { itemId } = req.body;

    const favObj = await Favorite.findOne({ userId: sub, artId: itemId });

    if (favObj) {
      await favObj.remove();
    }

    res.status(STATUS_OK);
    res.send();
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

favoriteController.getFavorite = async (req, res) => {
  try {
    const {
      pageNumber = DEFAULT_PAGE_NUMBER,
      pageLimit = PAGINATION_PAGE_LIMIT
    } = req.query;
    const { sub } = req.user;

    const favObjects = await Favorite.find({
      userId: sub
    }).skip(pageLimit * (pageNumber - 1)).limit(+pageLimit);

    if (favObjects) {
      const ids = favObjects.map(favObject => favObject.artId);
      const artWorks = await ArtWork.find({ artId: { $in: ids } })
      res.status(STATUS_BAD_REQUEST);
      res.json({ artWorks: artWorks });
    } else {
      res.status(STATUS_BAD_REQUEST);
      res.json({ error: e });
    }
  } catch (e) {
    console.log(e);
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

module.exports = favoriteController;
