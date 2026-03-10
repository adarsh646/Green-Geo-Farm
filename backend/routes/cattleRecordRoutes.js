const express = require('express');
const router = express.Router();
const CattleRecord = require('../models/CattleRecord');

// Get all cattle records
router.get('/', async (req, res) => {
  try {
    const records = await CattleRecord.find().populate('cattleId');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get records for a specific cow
router.get('/cattle/:cattleId', async (req, res) => {
  try {
    const records = await CattleRecord.find({ cattleId: req.params.cattleId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new cattle record
router.post('/', async (req, res) => {
  const record = new CattleRecord(req.body);
  try {
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a record
router.patch('/:id', async (req, res) => {
  try {
    const record = await CattleRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    Object.assign(record, req.body);
    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a record
router.delete('/:id', async (req, res) => {
  try {
    const result = await CattleRecord.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
