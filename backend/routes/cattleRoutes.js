const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Cattle = require('../models/Cattle');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all cattle
router.get('/', async (req, res) => {
  try {
    const cattle = await Cattle.find();
    res.json(cattle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one cattle
router.get('/:id', async (req, res) => {
  try {
    const cattle = await Cattle.findById(req.params.id);
    if (!cattle) return res.status(404).json({ message: 'Cattle not found' });
    res.json(cattle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create cattle with image upload
router.post('/', upload.single('image'), async (req, res) => {
  const cattle = new Cattle({
    tagNumber: req.body.tagNumber,
    breed: req.body.breed,
    age: req.body.age,
    gender: req.body.gender,
    healthStatus: req.body.healthStatus,
    weight: req.body.weight,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
  });

  try {
    const newCattle = await cattle.save();
    res.status(201).json(newCattle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update cattle
router.patch('/:id', upload.single('image'), async (req, res) => {
  try {
    const cattle = await Cattle.findById(req.params.id);
    if (!cattle) return res.status(404).json({ message: 'Cattle not found' });

    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    Object.assign(cattle, updateData);
    const updatedCattle = await cattle.save();
    res.json(updatedCattle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete cattle
router.delete('/:id', async (req, res) => {
  try {
    const result = await Cattle.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Cattle not found' });
    res.json({ message: 'Cattle deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
