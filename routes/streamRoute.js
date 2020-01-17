const { streamController } = require('./../controllers');

module.exports = (app) => {

  app.post('/stream/activity/add', streamController.newActivity);


};
