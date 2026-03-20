const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cattle_management')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
const cattleRoutes = require('./routes/cattleRoutes');
const cattleRecordRoutes = require('./routes/cattleRecordRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const feedStockRoutes = require('./routes/feedStockRoutes');
const farmAssetRoutes = require('./routes/farmAssetRoutes');
app.use('/api/cattle', cattleRoutes);
app.use('/api/cattle-records', cattleRecordRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feed-stock', feedStockRoutes);
app.use('/api/farm-assets', farmAssetRoutes);

app.get('/', (req, res) => {
  res.send('Cattle Management API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
