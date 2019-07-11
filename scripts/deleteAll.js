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
