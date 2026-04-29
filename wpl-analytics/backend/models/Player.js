const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  player_id: { type: String, unique: true, index: true },
  name: String,
  team: String,
  role: String,
  seasonal_stats: mongoose.Schema.Types.Mixed,
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', playerSchema);