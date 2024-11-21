const functions = require('firebase-functions');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Create an Express app
const app = express();

// Enable CORS for all requests (can restrict later if needed)
app.use(cors());

// Define API endpoint
app.get('/schedule/:eventCode', async (req, res) => {
  const eventCode = req.params.eventCode;

  try {
    // Access API key from Firebase environment config
    const apiKey = functions.config().frc.apikey;  // Using functions.config() for env variable

    // Make API request to FRC API
    const response = await axios.get(`https://frc-api.firstinspires.org/v3.0/2024/schedule/${eventCode}?tournamentLevel=Qualification`, {
      headers: { 
        'Authorization': `Basic ${apiKey}`,
      }
    });

    // Send the API data back to the frontend
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error("Error fetching schedule:", error);
    res.status(500).json({ message: 'Error fetching schedule', error: error.message });
  }
});

// Export Express app as Firebase function
exports.api = functions.https.onRequest(app);
