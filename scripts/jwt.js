var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');

const jwk = "";
const token = "";

const decodedFunction = (key, token) => {
  return new Promise(function(resolve, reject) {
    const pem = jwkToPem(key);
    jwt.verify(token, pem, function(err, decoded) {
      if (err) {
        resolve(null);
      }
      resolve(decoded);
    });
  });
}

const getJWT = () => {
  return new Promise(function(resolve, reject) {
    let promises = [];

    for (key of jwk['keys']) {
      promises.push(decodedFunction(key, token));
    }

    Promise.all(promises).then(function(values) {
      const result = values.filter(value => value);
      if (result.length > 0) {
        resolve(result[0]);
      } else {
        resolve(null);
      }
    });
  });
}

getJWT().then(function(user) {
  console.log(user);
});
