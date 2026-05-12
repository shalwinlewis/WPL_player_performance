const express = require('express');
const router = express.Router();

// Minimal admin routes - just placeholders for now
router.get('/stats', (req, res) => {
  res.json({ message: 'Admin stats - add auth later' });
});

router.get('/system-check', (req, res) => {
  res.json({ status: 'healthy' });
});

router.get('/players', (req, res) => {
  res.json([]);
});

router.post('/import', (req, res) => {
  res.json({ success: true });
});

router.get('/backup', (req, res) => {
  res.json({ backup: 'data' });
});

module.exports = router;