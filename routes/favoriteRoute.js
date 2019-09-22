const { favoriteController } = require('./../controllers');

module.exports = (app) => {
  app.post('/favorite', favoriteController.createFavorite);

  app.delete('/favorite', favoriteController.deleteFavorite);

  app.get('/favorite', favoriteController.getFavorite);
};
