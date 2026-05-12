const express = require('express');
const auth = require('../middleware/auth');
const Player = require('../models/Player');
const User = require('../models/User');

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ADMIN STATS
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments();
    const totalUsers = await User.countDocuments();
    const batsmen = await Player.countDocuments({ role: 'Batter' });
    const bowlers = await Player.countDocuments({ role: 'Bowler' });
    const allrounders = await Player.countDocuments({ role: 'All-rounder' });

    const stats = {
      totalPlayers,
      totalUsers,
      batsmen,
      bowlers,
      allrounders,
      timestamp: new Date(),
    };

    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// IMPORT DATA FROM CSV
router.post('/import', auth, isAdmin, async (req, res) => {
  try {
    // This is a placeholder for file upload handling
    // In production, use multer middleware for file uploads
    
    const csvData = req.body.data; // CSV data as string or array
    if (!csvData) {
      return res.status(400).json({ message: 'No data provided' });
    }

    const stats = {
      created: 0,
      updated: 0,
      failed: 0,
    };

    // Parse CSV data (simplified example)
    const rows = Array.isArray(csvData) ? csvData : csvData.split('\n');
    
    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue;

      try {
        const [name, team, role, totalRuns, matches, average, strikeRate, wickets, economy] = 
          rows[i].split(',').map(v => v.trim());

        const existingPlayer = await Player.findOne({ name: name.trim() });

        if (existingPlayer) {
          // Update
          await Player.findByIdAndUpdate(existingPlayer._id, {
            team,
            role,
            totalRuns: parseFloat(totalRuns) || 0,
            matches: parseInt(matches) || 0,
            average: parseFloat(average) || 0,
            strikeRate: parseFloat(strikeRate) || 0,
            wickets: parseInt(wickets) || 0,
            economy: parseFloat(economy) || 0,
          });
          stats.updated++;
        } else {
          // Create
          await Player.create({
            name: name.trim(),
            team,
            role,
            totalRuns: parseFloat(totalRuns) || 0,
            matches: parseInt(matches) || 0,
            average: parseFloat(average) || 0,
            strikeRate: parseFloat(strikeRate) || 0,
            wickets: parseInt(wickets) || 0,
            economy: parseFloat(economy) || 0,
          });
          stats.created++;
        }
      } catch (rowErr) {
        console.error(`Error processing row ${i}:`, rowErr.message);
        stats.failed++;
      }
    }

    res.json({
      success: true,
      message: `Import completed: ${stats.created} created, ${stats.updated} updated, ${stats.failed} failed`,
      stats,
    });
  } catch (err) {
    console.error('Error importing data:', err);
    res.status(500).json({ message: 'Import failed', error: err.message });
  }
});

// GET ALL PLAYERS (Admin View)
router.get('/players', auth, isAdmin, async (req, res) => {
  try {
    const players = await Player.find()
      .sort({ name: 1 })
      .limit(100);

    res.json(players);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE PLAYER
router.put('/players/:id', auth, isAdmin, async (req, res) => {
  try {
    const { name, team, role, totalRuns, matches, average, strikeRate, wickets, economy } = req.body;

    const player = await Player.findByIdAndUpdate(
      req.params.id,
      {
        name,
        team,
        role,
        totalRuns,
        matches,
        average,
        strikeRate,
        wickets,
        economy,
      },
      { new: true }
    );

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json({ message: 'Player updated', player });
  } catch (err) {
    console.error('Error updating player:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE PLAYER
router.delete('/players/:id', auth, isAdmin, async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json({ message: 'Player deleted', player });
  } catch (err) {
    console.error('Error deleting player:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// VALIDATE PLAYER DATA
router.post('/validate', auth, isAdmin, async (req, res) => {
  try {
    const { players } = req.body;

    if (!Array.isArray(players)) {
      return res.status(400).json({ message: 'Players must be an array' });
    }

    const errors = [];
    const warnings = [];

    players.forEach((player, idx) => {
      // Validate required fields
      if (!player.name) errors.push(`Row ${idx + 1}: Missing name`);
      if (!player.team) errors.push(`Row ${idx + 1}: Missing team`);
      if (!player.role) errors.push(`Row ${idx + 1}: Missing role`);

      // Validate data types
      if (player.totalRuns && isNaN(player.totalRuns)) {
        errors.push(`Row ${idx + 1}: totalRuns must be a number`);
      }
      if (player.average && isNaN(player.average)) {
        errors.push(`Row ${idx + 1}: average must be a number`);
      }

      // Warnings for suspicious data
      if (player.strikeRate && player.strikeRate > 200) {
        warnings.push(`Row ${idx + 1}: Strike rate unusually high (${player.strikeRate})`);
      }
      if (player.average && player.average > 100) {
        warnings.push(`Row ${idx + 1}: Average unusually high (${player.average})`);
      }
    });

    res.json({
      valid: errors.length === 0,
      errors,
      warnings,
      totalRows: players.length,
    });
  } catch (err) {
    console.error('Error validating data:', err);
    res.status(500).json({ message: 'Validation failed' });
  }
});

// SYSTEM CHECK
router.get('/system-check', auth, isAdmin, async (req, res) => {
  try {
    const playerCount = await Player.countDocuments();
    const userCount = await User.countDocuments();
    const totalRuns = await Player.aggregate([
      { $group: { _id: null, total: { $sum: '$totalRuns' } } },
    ]);

    res.json({
      status: 'healthy',
      players: playerCount,
      users: userCount,
      totalRunsInSystem: totalRuns[0]?.total || 0,
      timestamp: new Date(),
      dbConnection: 'active',
    });
  } catch (err) {
    console.error('Error in system check:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// BACKUP DATA (Export to JSON)
router.get('/backup', auth, isAdmin, async (req, res) => {
  try {
    const players = await Player.find();
    const users = await User.find().select('-password');

    const backup = {
      timestamp: new Date(),
      players,
      users,
      version: '1.0',
    };

    res.json(backup);
  } catch (err) {
    console.error('Error creating backup:', err);
    res.status(500).json({ message: 'Backup failed' });
  }
});

module.exports = router;