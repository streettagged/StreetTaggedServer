const { favoriteController } = require('./../controllers');

module.exports = (app) => {
  app.post('/favorites', favoriteController.createFavorite);

  app.delete('/favorites', favoriteController.deleteFavorite);

  app.get('/favorites', favoriteController.getFavorite);
};
