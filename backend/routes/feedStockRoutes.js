const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const FeedStock = require('../models/FeedStock');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'feed-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all feed stocks
router.get('/', async (req, res) => {
  try {
    const feedStocks = await FeedStock.find();
    res.json(feedStocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new feed type (Admin only)
router.post('/add', upload.single('image'), async (req, res) => {
  const { feedType, maxCapacity } = req.body;
  const feedStock = new FeedStock({ 
    feedType, 
    maxCapacity,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
  });

  try {
    const newFeedStock = await feedStock.save();
    res.status(201).json(newFeedStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update weight of a feed type (Rancher/Admin) - Replaces weight
router.put('/update-weight', async (req, res) => {
  const { feedType, weight } = req.body;

  try {
    const feedStock = await FeedStock.findOne({ feedType });
    if (!feedStock) {
      return res.status(404).json({ message: 'Feed type not found' });
    }

    if (parseFloat(weight) > feedStock.maxCapacity) {
      return res.status(400).json({ message: `Weight exceeds maximum storage capacity of ${feedStock.maxCapacity} kg` });
    }

    feedStock.weight = parseFloat(weight);
    feedStock.lastUpdated = Date.now();
    await feedStock.save();

    res.json(feedStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Re-fill stock (Adds to existing weight)
router.put('/refill', async (req, res) => {
  const { feedType, weight } = req.body;

  try {
    const feedStock = await FeedStock.findOne({ feedType });
    if (!feedStock) {
      return res.status(404).json({ message: 'Feed type not found' });
    }

    const newWeight = feedStock.weight + parseFloat(weight);
    if (newWeight > feedStock.maxCapacity) {
      return res.status(400).json({ message: `Refilling exceeds maximum storage capacity of ${feedStock.maxCapacity} kg. Current weight: ${feedStock.weight} kg.` });
    }

    feedStock.weight = newWeight;
    feedStock.lastUpdated = Date.now();
    await feedStock.save();

    res.json(feedStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Dispense feed (Subtracts from existing weight)
router.put('/dispense', async (req, res) => {
  const { feedType, weight } = req.body;

  try {
    const currentStock = await FeedStock.findOne({ feedType });
    if (!currentStock) {
      return res.status(404).json({ message: 'Feed type not found' });
    }
    if (currentStock.weight < parseFloat(weight)) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const updatedFeedStock = await FeedStock.findOneAndUpdate(
      { feedType },
      { $inc: { weight: -parseFloat(weight) }, lastUpdated: Date.now() },
      { new: true }
    );
    res.json(updatedFeedStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a feed type (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const deletedFeedStock = await FeedStock.findByIdAndDelete(req.params.id);
    if (!deletedFeedStock) {
      return res.status(404).json({ message: 'Feed type not found' });
    }
    res.json({ message: 'Feed type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
