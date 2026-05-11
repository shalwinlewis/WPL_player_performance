const express = require('express');
const Player = require('../models/Player');
const Prediction = require('../models/Prediction');
const { auth } = require('../middleware/auth');

const router = express.Router();

const calculatePrediction = (player) => {
  const average = player.average || 0;
  const strikeRate = player.strikeRate || 0;
  const matches = player.matches || 1;

  const avgScore = Math.min((average / 50) * 100, 100);
  const srScore = Math.min((strikeRate / 150) * 100, 100);
  const consistency = Math.min((matches / 20) * 100, 100);

  const confidence = Math.round((avgScore + srScore + consistency) / 3);

  let form = 'average';
  if (confidence > 75) form = 'excellent';
  else if (confidence > 60) form = 'good';
  else if (confidence < 40) form = 'poor';

  const nextMatchScore = Math.round(average * (1 + (strikeRate - 120) / 200));

  return {
    nextMatchScore: Math.max(0, nextMatchScore),
    confidence,
    form,
    formScore: confidence,
    averageScore: average,
    strikeRate,
    consistency: Math.round(consistency),
    winProbability: Math.round(confidence * 0.8),
    trend: 'stable',
  };
};

router.get('/', async (req, res) => {
  try {
    const predictions = await Prediction.find().populate('playerId');
    res.json(predictions);
  } catch (err) {
    console.error('Error fetching predictions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;

    let prediction = await Prediction.findOne({ playerId });

    if (!prediction) {
      const player = await Player.findById(playerId);
      if (!player) {
        return res.status(404).json({ message: 'Player not found' });
      }

      const predictionData = calculatePrediction(player);
      prediction = new Prediction({
        playerId: player._id,
        playerName: player.name,
        ...predictionData,
      });
      await prediction.save();
    }

    res.json(prediction);
  } catch (err) {
    console.error('Error fetching prediction:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/recalculate/all', async (req, res) => {
  try {
    const players = await Player.find();

    for (const player of players) {
      const predictionData = calculatePrediction(player);
      await Prediction.updateOne(
        { playerId: player._id },
        {
          playerId: player._id,
          playerName: player.name,
          ...predictionData,
        },
        { upsert: true }
      );
    }

    res.json({ message: 'All predictions recalculated' });
  } catch (err) {
    console.error('Error recalculating predictions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/top/performers', async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .sort({ formScore: -1 })
      .limit(10)
      .populate('playerId');

    res.json(predictions);
  } catch (err) {
    console.error('Error fetching top performers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;