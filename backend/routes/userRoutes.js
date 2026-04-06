const express = require('express');
const router = express.Router();
const User = require('../models/User');

const sanitizeUserPayload = (payload = {}) => {
  const { username, email, password } = payload;

  return {
    cleanUsername: typeof username === 'string' ? username.trim() : '',
    cleanEmail: typeof email === 'string' ? email.trim().toLowerCase() : '',
    cleanPassword: typeof password === 'string' ? password : '',
  };
};

const createUserByRole = async (req, res, role, label) => {
  try {
    const { cleanUsername, cleanEmail, cleanPassword } = sanitizeUserPayload(req.body);

    if (!cleanUsername || !cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }],
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    const user = new User({
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword,
      role,
    });

    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      message: `${label} account created successfully`,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all ranchers
router.get('/ranchers', async (req, res) => {
  try {
    const ranchers = await User.find({ role: 'rancher' }).select('-password').sort({ createdAt: -1 });
    res.json(ranchers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a rancher account
router.post('/ranchers', async (req, res) => {
  return createUserByRole(req, res, 'rancher', 'Rancher');
});

// Delete a rancher
router.delete('/ranchers/:id', async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ _id: req.params.id, role: 'rancher' });
    if (!result) return res.status(404).json({ message: 'Rancher not found' });
    res.json({ message: 'Rancher deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all shopkeepers
router.get('/shopkeepers', async (req, res) => {
  try {
    const shopkeepers = await User.find({ role: 'shopkeeper' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(shopkeepers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a shopkeeper account
router.post('/shopkeepers', async (req, res) => {
  return createUserByRole(req, res, 'shopkeeper', 'Shopkeeper');
});

// Delete a shopkeeper
router.delete('/shopkeepers/:id', async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ _id: req.params.id, role: 'shopkeeper' });
    if (!result) return res.status(404).json({ message: 'Shopkeeper not found' });
    res.json({ message: 'Shopkeeper deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
