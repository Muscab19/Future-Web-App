const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, adminMiddleware } = require('../middlewares/authMiddleware'); 
const router = express.Router();

// Register user
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.json({ msg: 'User already exists' , success:false});

    user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully', success:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login user
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ msg: 'Invalid credentials', success:false });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.json({ msg: 'Invalid credentials', success:false });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, name: user.name, isAdmin: user.isAdmin, success:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin dashboard route
router.get('/admin/dashboard', adminMiddleware, (req, res) => {
  res.json({ msg: 'Welcome to the admin dashboard!' });
});

module.exports = router;
