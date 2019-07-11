const { artController } = require('./../controllers');

module.exports = (app) => {
  app.get('/art', artController.getArt);

  app.get('/art/:artId', artController.getArtByID);

  app.post('/art', artController.postArt);
};
