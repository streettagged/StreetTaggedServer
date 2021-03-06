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
  userId: String,
  username: String,
  isActive: Boolean,
  isFeatured: Boolean,
  picture: String,
  name: String,
  artist: String,
  address: String,
  about: String,
  tags: {
    type: [String],
    index: true
  },
  location: {
    type: pointSchema,
    required: false
  },
  category: String,
  isReviewing: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
},{ timestamps: true });

ArtSchema.index({
  location: '2dsphere'
});

ArtSchema.index({
  'tags': 1
});

ArtSchema.index({
  'isActive': 1
});

ArtSchema.index({
  'createdAt': 1
});

const ArtWork = mongoose.models.ArtWork || mongoose.model('ArtWork', ArtSchema);

module.exports = {
  ArtWork
};
