const { streamController } = require('./../controllers');

module.exports = (app) => {
  app.post('/stream/token', streamController.getToken);

  app.get('/stream/tags', streamController.getTags);
};
