const mainController = {};

const STATUS_OK = 200;

mainController.index = (req, res) => {
  res.status(STATUS_OK);
  res.send('Welcome to StreetTagged!');
};

module.exports = mainController;
