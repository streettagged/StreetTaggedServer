const { artController } = require('./../controllers');

module.exports = (app) => {
  app.get('/art/:artId', artController.getArt);

  app.post('/art', artController.postArt);
};
