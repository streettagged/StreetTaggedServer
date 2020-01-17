var stream = require('getstream');
// Instantiate a new client (server side)
client = stream.connect(
  process.env.STREAM_KEY,
  process.env.STREAM_SECRET,
);

var streamClient = stream.connect('kgey4rnsbyzz', null, '67539');
//console.log(streamClient)
module.exports = streamClient;
