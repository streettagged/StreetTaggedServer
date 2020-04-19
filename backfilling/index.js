require('dotenv').config();

const stream = require('getstream');

const { ArtWork } = require('./../models');
const { mongoDB } = require('./../database');

const GET_STREAM_GLOBAL_FEED_NAME = 'global_user';
const POST_ACTION = 'post';
const TAG_SLUG_NAME = 'tag';

const streamClient = stream.connect(
  process.env.STREAM_KEY,
  process.env.STREAM_SECRET,
);

const getTagLinks = (text) => {
  let tags = [];
  var regexp = /#(\w+)/g;
  var match = regexp.exec(text);
  while (match != null){
    tags.push(TAG_SLUG_NAME + ':' + match[1]);
    match = regexp.exec(text)
  }
  return tags;
}

const backfilling = async () => {
  const items = await ArtWork.find({ });

  const item = items[3];
  //for (item of items) {

    if (item.isActive) {
      try {
        let timeline = streamClient.feed('timeline', item.username);

        //streamClient.user(item.username).ref()
/*
{
  "created_at": item.createdAt,
  "updated_at": item.createdAt,
  "id": item.username,
  "data": {
    "name": item.username,
    "profileImage": null
  }
}
*/
        const payload = {
          'actor': streamClient.user(item.username).ref(),
          'time': item.createdAt,
          'verb': POST_ACTION,
          'object': {
            'text': item.about,
            'image': item.picture,
            'coordinates': item.location.coordinates,
          },
          'to': getTagLinks(item.about),
        }

        const gsresult = await timeline.addActivity(payload);
        console.log(gsresult);
      } catch (e) {
        console.log(e);
      }

      /*try {
        let global_user_timeline = streamClient.feed('timeline', GET_STREAM_GLOBAL_FEED_NAME);
        const gsresult = await global_user_timeline.addActivity(payload);
        console.log(gsresult);
      } catch (e) { }*/
    //}

  }

  console.log("Completed!");
}

connectToDatabase();

console.log("Starting...");
backfilling();
