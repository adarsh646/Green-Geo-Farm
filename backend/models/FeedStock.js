const mongoose = require('mongoose');

const FeedStockSchema = new mongoose.Schema({
  feedType: {
    type: String,
    required: true,
    unique: true
  },
  weight: {
    type: Number,
    default: 0
  },
  maxCapacity: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FeedStock', FeedStockSchema);
