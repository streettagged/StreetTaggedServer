const uuidv4 = require('uuid/v4');

const { Favorite } = require('./../models');

const favoriteController = {};

const STATUS_OK = 200;
const STATUS_OK_CREATED = 201;
const STATUS_BAD_REQUEST = 400;

favoriteController.createFavorite = async (req, res) => {
  try {
    const { sub, username } = req.user;
    const { artId } = req.body;

    const favId = uuidv4();

    await Favorite.create({
      id: favId,
      userId: sub,
      artId,
    });

    res.status(STATUS_OK_CREATED);
    res.send();
  } catch (e) {
    res.status(STATUS_BAD_REQUEST);
    res.json({ error: e });
  }
};

module.exports = favoriteController;
