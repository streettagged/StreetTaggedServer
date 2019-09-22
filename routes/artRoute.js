const { artController } = require('./../controllers');
const multer  = require('multer');

var upload = multer({ 
  limits: {
    fileSize: 4 * 1024 * 1024,
  }
});

module.exports = (app) => {
  app.get('/items', artController.getItem);

  app.get('/items/:itemId', artController.getItemByID);

  app.post('/items', artController.postItem);

  app.post('/items/search', artController.searchItem);

  app.post('/images', artController.uploadItem);

  app.get('/images/review', artController.getItemForReview);

  app.put('/images/review', artController.getItemReviewUpdate);

  app.get('/images/data', artController.getModelData);
};
