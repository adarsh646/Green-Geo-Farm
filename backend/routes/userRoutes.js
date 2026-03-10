const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all ranchers
router.get('/ranchers', async (req, res) => {
  try {
    const ranchers = await User.find({ role: 'rancher' }).select('-password');
    res.json(ranchers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a rancher
router.delete('/ranchers/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Rancher not found' });
    res.json({ message: 'Rancher deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
