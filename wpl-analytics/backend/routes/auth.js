const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/favorite-team', auth, async (req, res) => {
  try {
    const { team } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { favoriteTeam: team },
      { new: true }
    );
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/favorite-player/:playerId', auth, async (req, res) => {
  try {
    const { playerId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favoritePlayers: playerId } },
      { new: true }
    );
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/favorite-player/:playerId', auth, async (req, res) => {
  try {
    const { playerId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favoritePlayers: playerId } },
      { new: true }
    );
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;