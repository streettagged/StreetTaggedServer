const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FavSchema = new Schema({
  id: String,
  artId: String,
  userId: String
},{ timestamps: true });

FavSchema.index({
  'createdAt': 1
});

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavSchema);

module.exports = {
  Favorite
};
