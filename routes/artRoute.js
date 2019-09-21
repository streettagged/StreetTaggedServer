const { artController } = require('./../controllers');
const multer  = require('multer');

var upload = multer({ 
  limits: {
    fileSize: 4 * 1024 * 1024,
  }
});

module.exports = (app) => {
  app.post('/image', artController.uploadArt);

  app.get('/art', artController.getArt);

  app.get('/art/:artId', artController.getArtByID);

  app.post('/art', artController.postArt);

  app.post('/search/art', artController.searchArt);

  app.get('/image/review', artController.getArtForReview);

  app.put('/image/review', artController.getArtReviewUpdate);
};
