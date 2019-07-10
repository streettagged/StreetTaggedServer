const { artController } = require('./../controllers');

module.exports = (app) => {
  app.get('/art/:artId', artController.getArt);

  app.get('/art', artController.postArt);
};
