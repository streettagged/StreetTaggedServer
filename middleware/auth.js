const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const fetch = require('node-fetch');

const publicKeys = 'https://cognito-idp.' + process.env.REGION + '.amazonaws.com/' + process.env.USER_GROUP + '/.well-known/jwks.json';

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
};

module.exports = async (req, res, next) => {
    const token = req.query.token
               || req.body.token
               || req.headers.token;

    const jwk = await fetch(publicKeys).then(res => res.json());

    let promises = [];

    for (key of jwk['keys']) {
      promises.push(decodedFunction(key, token));
    }

    Promise.all(promises).then(function(values) {
      const result = values.filter(value => value);
      if (result.length > 0) {
        req.user = result[0];
      } else {
        req.user = null;
      }
      next();
    });
}
