const mainController = {};

const STATUS_OK = 200;

mainController.index = (req, res) => {
  res.status(STATUS_OK);
  res.send('Welcome to StreetTagged!');
};

mainController.ping = (req, res) => {
  res.status(STATUS_OK);
  res.json({ user: req.user });
};



module.exports = mainController;
