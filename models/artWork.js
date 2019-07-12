const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const ArtSchema = new Schema({
  artId: String,
  isActive: Boolean,
  isFeatured: Boolean,
  picture: String,
  name: String,
  artist: String,
  address: String,
  about: String,
  tags: Array,
  location: {
    type: pointSchema,
    required: false
  },
  category: String
},{ timestamps: true });

ArtSchema.index({
  location: '2dsphere'
});

const ArtWork = mongoose.models.ArtWork || mongoose.model('ArtWork', ArtSchema);

module.exports = {
  ArtWork
};
