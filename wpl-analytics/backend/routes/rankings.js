const express = require('express');
const Player = require('../models/Player');

const router = express.Router();

router.get('/batsmen/runs', async (req, res) => {
  try {
    const batsmen = await Player.find({ role: { $in: ['Batter', 'All-rounder'] } })
      .sort({ totalRuns: -1 })
      .limit(20);

    const rankings = batsmen.map((player, index) => ({
      rank: index + 1,
      name: player.name,
      team: player.team,
      runs: player.totalRuns,
      matches: player.matches,
      average: player.average,
    }));

    res.json(rankings);
  } catch (err) {
    console.error('Error fetching batsmen rankings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/batsmen/average', async (req, res) => {
  try {
    const batsmen = await Player.find({
      role: { $in: ['Batter', 'All-rounder'] },
      matches: { $gte: 5 },
    })
      .sort({ average: -1 })
      .limit(20);

    const rankings = batsmen.map((player, index) => ({
      rank: index + 1,
      name: player.name,
      team: player.team,
      average: player.average,
      matches: player.matches,
      runs: player.totalRuns,
    }));

    res.json(rankings);
  } catch (err) {
    console.error('Error fetching batsmen average rankings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/bowlers/wickets', async (req, res) => {
  try {
    const bowlers = await Player.find({ role: { $in: ['Bowler', 'All-rounder'] } })
      .sort({ wickets: -1 })
      .limit(20);

    const rankings = bowlers.map((player, index) => ({
      rank: index + 1,
      name: player.name,
      team: player.team,
      wickets: player.wickets,
      matches: player.matches,
      economy: player.economy || 'N/A',
    }));

    res.json(rankings);
  } catch (err) {
    console.error('Error fetching bowler rankings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/bowlers/economy', async (req, res) => {
  try {
    const bowlers = await Player.find({
      role: { $in: ['Bowler', 'All-rounder'] },
      matches: { $gte: 5 },
    })
      .sort({ economy: 1 })
      .limit(20);

    const rankings = bowlers.map((player, index) => ({
      rank: index + 1,
      name: player.name,
      team: player.team,
      economy: player.economy || 'N/A',
      wickets: player.wickets,
      matches: player.matches,
    }));

    res.json(rankings);
  } catch (err) {
    console.error('Error fetching economy rankings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/strikeRate', async (req, res) => {
  try {
    const players = await Player.find({
      strikeRate: { $gt: 0 },
      matches: { $gte: 5 },
    })
      .sort({ strikeRate: -1 })
      .limit(20);

    const rankings = players.map((player, index) => ({
      rank: index + 1,
      name: player.name,
      team: player.team,
      strikeRate: player.strikeRate,
      matches: player.matches,
      runs: player.totalRuns,
    }));

    res.json(rankings);
  } catch (err) {
    console.error('Error fetching strike rate rankings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/overall', async (req, res) => {
  try {
    const players = await Player.find().limit(50);

    const rankings = players
      .map((player) => {
        const runScore = Math.min((player.totalRuns / 500) * 30, 30);
        const avgScore = Math.min((player.average / 50) * 20, 20);
        const wicketScore = Math.min((player.wickets / 20) * 20, 20);
        const srScore = Math.min((player.strikeRate / 150) * 20, 20);
        const matchScore = Math.min((player.matches / 30) * 10, 10);

        const overallScore = Math.round(
          runScore + avgScore + wicketScore + srScore + matchScore
        );

        return {
          name: player.name,
          team: player.team,
          role: player.role,
          overallScore,
          runs: player.totalRuns,
          average: player.average,
          wickets: player.wickets,
          matches: player.matches,
        };
      })
      .sort((a, b) => b.overallScore - a.overallScore)
      .map((player, index) => ({
        rank: index + 1,
        ...player,
      }))
      .slice(0, 20);

    res.json(rankings);
  } catch (err) {
    console.error('Error fetching overall rankings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;