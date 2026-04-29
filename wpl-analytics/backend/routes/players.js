const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// GET all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().limit(100);
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single player
router.get('/:playerId', async (req, res) => {
  try {
    const player = await Player.findOne({ player_id: req.params.playerId });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET player history
router.get('/:playerId/history', async (req, res) => {
  try {
    const player = await Player.findOne({ player_id: req.params.playerId });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    
    const history = Object.entries(player.seasonal_stats || {}).map(([season, stats]) => ({
      season: parseInt(season),
      ...stats
    }));
    
    res.json({ player, history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;