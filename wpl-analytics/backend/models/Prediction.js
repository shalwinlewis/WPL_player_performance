const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    playerName: String,
    nextMatchScore: {
      type: Number,
      default: 0,
    },
    confidence: {
      type: Number,
      default: 0,
    },
    form: {
      type: String,
      default: 'average',
    },
    formScore: {
      type: Number,
      default: 50,
    },
    winProbability: {
      type: Number,
      default: 50,
    },
    averageScore: Number,
    strikeRate: Number,
    consistency: {
      type: Number,
      default: 50,
    },
    trend: {
      type: String,
      default: 'stable',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prediction', PredictionSchema);