const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  scouterName: String,
  teamNumber: String,
  matchNumber: String,
  autoHighGoals: Number,
  autoLowGoals: Number,
  teleHighGoals: Number,
  teleLowGoals: Number,
  endgameStatus: String,
  notes: String,
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;

