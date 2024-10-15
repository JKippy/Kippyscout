//+

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors'); // Import cors

// MongoDB connection URI
const uri = 'mongodb+srv://jasonkippy:scouting1@kippyscout.yvu1n.mongodb.net/?retryWrites=true&w=majority&appName=Kippyscout';

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a schema for scouting data
const matchDataSchema = new mongoose.Schema({
    scouterName: { type: String, required: true },
    teamNumber: { type: String, required: true },
    matchNumber: { type: String, required: true },
    autoHighGoals: { type: Number, required: true },
    autoLowGoals: { type: Number, required: true },
    teleHighGoals: { type: Number, required: true },
    teleLowGoals: { type: Number, required: true },
    endgameStatus: { type: String, required: true },
    notes: { type: String, required: false },
});

// Create a model for the match data
const MatchData = mongoose.model('MatchData', matchDataSchema);

// API endpoint to submit match data
app.post('/api/matchdata', async (req, res) => {
    try {
        const matchData = new MatchData(req.body);
        await matchData.save();
        res.status(201).json({ message: 'Match data saved successfully', data: matchData });
    } catch (error) {
        console.error('Error saving match data:', error);
        res.status(500).json({ message: 'Error saving match data', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


