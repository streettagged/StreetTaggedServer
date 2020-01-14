const { streamController } = require('./../controllers');

module.exports = (app) => {

  app.post('/stream', streamController.newUser);


};
