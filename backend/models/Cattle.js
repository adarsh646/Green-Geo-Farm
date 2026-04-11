const mongoose = require('mongoose');

const cattleSchema = new mongoose.Schema({
  tagNumber: { type: String, required: true, unique: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  healthStatus: { type: String, default: 'Healthy' },
  weight: { type: Number },
  imageUrl: { type: String },
  model3dUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Cattle', cattleSchema);
