docClient.scan( {
    "TableName":"streetart-dev",
}, function(err, data) {
    if (err) {
        ppJson(err);
    } else {
        console.log(data.Count);
        for (item of data.Items) {
            const params = {
              "TableName": "streetart-dev",
              "Key": {
                "artId": item.artId,
              },
            }
            docClient.delete(params, function(err, data) { });
        }
    }
});

const {
  isActive, isFeatured, picture,
  name, artist, address, about,
  registered, coordinates, tags,
  category
} = req.body;

const params = {
  TableName: process.env.ART_TABLE,
  Item: {
    artId: uuid.v1(),
    isActive: isActive,
    isFeatured: isFeatured,
    picture: picture,
    name: name,
    artist: artist,
    address: address,
    about: about,
    registered: registered,
    coordinates: coordinates,
    tags,
    category
  },
};

await dynamoDB().put(params).promise();

res.status(STATUS_OK);
res.json(params.Item);
