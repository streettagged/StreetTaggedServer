var stream = require('getstream');
// Instantiate a new client (server side)
streamClient = stream.connect(
  process.env.STREAM_KEY,
  process.env.STREAM_SECRET
);


module.exports = streamClient;
