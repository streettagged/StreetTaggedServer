const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const urlConnection = 'mongodb+srv://streettagged:XrdG9JQShFmAy4rd@streettagged-z3s5t.mongodb.net/streettagged?retryWrites=true&w=majority';

module.exports = connectToDatabase = () => {
  if (mongoose.connection.readyState) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  return mongoose.connect(urlConnection).then(db => {
      global.isConnected = db.connections[0].readyState;
  });
};
