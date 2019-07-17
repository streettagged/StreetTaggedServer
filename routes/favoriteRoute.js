const { favoriteController } = require('./../controllers');

module.exports = (app) => {
  app.post('/favorite', favoriteController.createFavorite);
};
