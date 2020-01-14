var stream = require('getstream');
// Instantiate a new client (server side)
client = stream.connect(
  process.env.STREAM_KEY,
  process.env.STREAM_SECRET,
);

// Create a token for user with id "the-user-id"
const userToken = client.createUserToken('the-user-id');
console.log(userToken)
client = stream.connect('kgey4rnsbyzz', null, '67539');
console.log(client)

module.exports = client;