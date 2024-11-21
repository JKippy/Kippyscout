require('dotenv').config(); // This loads your .env file

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000; // You can change this to any available port

// Enable CORS for all requests (you can restrict it to your frontend domain later if needed)
app.use(cors());

// Route to handle schedule requests
app.get('/schedule/:eventCode', async (req, res) => {
  const eventCode = req.params.eventCode;

  try {
    // Make the API request to FRC API
    const response = await axios.get(`https://frc-api.firstinspires.org/v3.0/2024/schedule/${eventCode}?tournamentLevel=Qualification`, {
      headers: { 
        'Authorization': `Basic ${process.env.REACT_APP_FRC_API_AUTH_STRING}`,
      }
    });

    // Send the API data back to the frontend
    res.json(response.data);
  } catch (error) {
    // Handle errors and send error message to the frontend
    console.error("Error fetching schedule:", error);
    res.status(500).json({ message: 'Error fetching schedule', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
