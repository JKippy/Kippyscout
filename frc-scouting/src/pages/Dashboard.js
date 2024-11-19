import React, { useState, useEffect } from 'react';
import axios from 'axios'; // To make API requests

const Dashboard = () => {
  const [eventCode, setEventCode] = useState(''); // Store the event code
  const [matches, setMatches] = useState([]); // Store the match data
  const [selectedMatch, setSelectedMatch] = useState(''); // Store selected match
  const [loading, setLoading] = useState(false); // Loading state for API request
  const [error, setError] = useState(''); // Error state for handling API errors

  // Fetch match schedule based on event code
  const fetchSchedule = async (eventCode) => {
    setLoading(true);
    setError('');
    
    try {
      const apiKey = `${process.env.REACT_APP_API_KEY}` // Make sure the API key is set in Firebase config
      console.log('API Key:', apiKey);

      const response = await axios.get(`https://cors-anywhere.herokuapp.com/https://frc-api.firstinspires.org/v3.0/2024/schedule/${eventCode}?tournamentLevel=Qualification`, {
      headers: { 
        'Authorization': `Basic ${apiKey}`,
      }
      });

      if (response.data.Schedule) {
        setMatches(response.data.Schedule); // Store match data in state
      } else {
        setError('No schedule found for this event.');
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      console.error('Error details:', error.response || error);
      setError('Failed to fetch schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle event code change
  const handleEventCodeChange = (e) => {
    setEventCode(e.target.value);
  };

  // Handle match selection
  const handleMatchSelect = (e) => {
    setSelectedMatch(e.target.value);
  };

  // Handle fetch when user presses the "Fetch Schedule" button
  const handleFetchClick = () => {
    if (eventCode) {
      fetchSchedule(eventCode);
    } else {
      setError('Please enter a valid event code.');
    }
  };

  return (
    <div className="dashboard">
      <h2>FRC Match Dashboard</h2>
      
      {/* Event Code Input */}
      <div>
        <label htmlFor="eventCode">Enter Event Code:</label>
        <input
          id="eventCode"
          type="text"
          value={eventCode}
          onChange={handleEventCodeChange}
          placeholder="e.g., MIMIL"
        />
        <button onClick={handleFetchClick}>Fetch Schedule</button>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading match schedule...</p>
      ) : (
        <div>
          {/* Dropdown for Match Numbers */}
          {matches.length > 0 && (
            <div>
              <label htmlFor="matchNumber">Select Match:</label>
              <select 
                id="matchNumber" 
                value={selectedMatch} 
                onChange={handleMatchSelect}
              >
                <option value="">-- Select a Match --</option>
                {matches.map((match) => (
                  <option key={match.matchNumber} value={match.matchNumber}>
                    Match {match.matchNumber}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
