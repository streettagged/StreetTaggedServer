const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = connectToDatabase = () => {
  if (mongoose.connection.readyState) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  return mongoose.connect(process.env.MONGO_DB).then(db => {
      global.isConnected = db.connections[0].readyState;
  });
};
