const express = require('express');
const Player = require('../models/Player');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const teams = await Player.distinct('team');
    res.json(teams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:teamName', async (req, res) => {
  try {
    const { teamName } = req.params;
    const players = await Player.find({ team: teamName });

    if (players.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const totalRuns = players.reduce((sum, p) => sum + (p.totalRuns || 0), 0);
    const totalWickets = players.reduce((sum, p) => sum + (p.wickets || 0), 0);
    const avgRunsPerPlayer = Math.round(totalRuns / players.length);
    const avgWicketsPerPlayer = Math.round(totalWickets / players.length);

    const batsmen = players.filter(p => p.role === 'Batter' || p.role === 'All-rounder');
    const bowlers = players.filter(p => p.role === 'Bowler' || p.role === 'All-rounder');

    const teamStats = {
      teamName,
      totalPlayers: players.length,
      batsmen: batsmen.length,
      bowlers: bowlers.length,
      totalRuns,
      totalWickets,
      avgRunsPerPlayer,
      avgWicketsPerPlayer,
      topBatsman: batsmen.sort((a, b) => (b.totalRuns || 0) - (a.totalRuns || 0))[0],
      topBowler: bowlers.sort((a, b) => (b.wickets || 0) - (a.wickets || 0))[0],
      allPlayers: players,
    };

    res.json(teamStats);
  } catch (err) {
    console.error('Error fetching team details:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/compare/:team1/:team2', async (req, res) => {
  try {
    const { team1, team2 } = req.params;

    const team1Players = await Player.find({ team: team1 });
    const team2Players = await Player.find({ team: team2 });

    if (team1Players.length === 0 || team2Players.length === 0) {
      return res.status(404).json({ message: 'One or both teams not found' });
    }

    const calculateTeamStats = (players, teamName) => {
      const totalRuns = players.reduce((sum, p) => sum + (p.totalRuns || 0), 0);
      const totalWickets = players.reduce((sum, p) => sum + (p.wickets || 0), 0);
      const avgAverage = Math.round(
        players.reduce((sum, p) => sum + (p.average || 0), 0) / players.length
      );
      const avgStrikeRate = Math.round(
        players.reduce((sum, p) => sum + (p.strikeRate || 0), 0) / players.length
      );

      return {
        teamName,
        players: players.length,
        totalRuns,
        totalWickets,
        avgAverage,
        avgStrikeRate,
        topRunScorer: players.sort((a, b) => (b.totalRuns || 0) - (a.totalRuns || 0))[0],
        topWicketTaker: players.sort((a, b) => (b.wickets || 0) - (a.wickets || 0))[0],
      };
    };

    const comparison = {
      team1: calculateTeamStats(team1Players, team1),
      team2: calculateTeamStats(team2Players, team2),
    };

    res.json(comparison);
  } catch (err) {
    console.error('Error comparing teams:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/rankings/overall', async (req, res) => {
  try {
    const teams = await Player.distinct('team');

    const teamRankings = await Promise.all(
      teams.map(async (teamName) => {
        const players = await Player.find({ team: teamName });

        const totalRuns = players.reduce((sum, p) => sum + (p.totalRuns || 0), 0);
        const totalWickets = players.reduce((sum, p) => sum + (p.wickets || 0), 0);
        const avgAverage = Math.round(
          players.reduce((sum, p) => sum + (p.average || 0), 0) / players.length
        );

        const teamScore = Math.round(
          (totalRuns / 100 + totalWickets * 2 + avgAverage) / 3
        );

        return {
          teamName,
          players: players.length,
          totalRuns,
          totalWickets,
          teamScore,
        };
      })
    );

    const rankings = teamRankings
      .sort((a, b) => b.teamScore - a.teamScore)
      .map((team, index) => ({
        rank: index + 1,
        ...team,
      }));

    res.json(rankings);
  } catch (err) {
    console.error('Error fetching team rankings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;