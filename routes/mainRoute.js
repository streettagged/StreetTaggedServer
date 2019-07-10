const { mainController } = require('./../controllers');

module.exports = (app) => {
  app.get('/', mainController.index);
};
