import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Your Firestore instance
import { collection, getDocs } from 'firebase/firestore';
import axios from 'axios'; // To make API requests
import './Dashboard.css';

const Dashboard = () => {
  const [matches, setMatches] = useState([]); // Store the match data
  const [selectedMatch, setSelectedMatch] = useState(null); // Currently selected match
  const [loading, setLoading] = useState(true); // To handle loading state
  const [eventCode, setEventCode] = useState('MIMIL'); // Default event code
  const [error, setError] = useState(null); // To store any error message

  // Fetch match schedule from the API
  const fetchSchedule = async (eventCode) => {
    setLoading(true);
    setError(null);
    console.log("Event Code:", eventCode);
    
    const response = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://frc-api.firstinspires.org/v3.0/2024/schedule/${eventCode}?tournamentLevel=Qualification`,
      headers: { 
        'Authorization': `Basic ${process.env.REACT_APP_FRC_API_AUTH_STRING}`, 
        'If-Modified-Since': ''
      }
    };

    try {
      const result = await axios(response);
      setMatches(result.data.Schedule); // Store the matches in the state
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setError("Error fetching match schedule");
      setLoading(false);
    }
  };

  // Handle match selection
  const handleMatchSelect = (matchNumber) => {
    const match = matches.find((match) => match.matchNumber === matchNumber);
    setSelectedMatch(match);
  };

  // Handle event code change
  const handleEventCodeChange = (e) => {
    setEventCode(e.target.value); // Update event code based on user input
  };

  // Effect hook to fetch schedule data when the component mounts or eventCode changes
  useEffect(() => {
    if (eventCode) {
      fetchSchedule(eventCode); // Pass eventCode explicitly
    }
  }, [eventCode]); // Re-fetch when event code changes

  return (
    <div className="dashboard">
      <h2>Competitive Robot Dashboard</h2>

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
        <button onClick={() => fetchSchedule(eventCode)}>Fetch Schedule</button>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading match schedule...</p>
      ) : (
        <>
          <div className="match-select">
            <label>Select Match:</label>
            <select onChange={(e) => handleMatchSelect(Number(e.target.value))}>
              <option value="">--Select a Match--</option>
              {matches.map((match) => (
                <option key={match.matchNumber} value={match.matchNumber}>
                  Match {match.matchNumber} - {match.description}
                </option>
              ))}
            </select>
          </div>

          {selectedMatch && (
            <div className="match-details">
              <h3>Match Details</h3>
              <p><strong>Description:</strong> {selectedMatch.description}</p>
              <p><strong>Start Time:</strong> {new Date(selectedMatch.startTime).toLocaleString()}</p>

              <div>
                <h4>Red Alliance</h4>
                <ul>
                  {selectedMatch.teams
                    .filter((team) => team.station.startsWith('Red'))
                    .map((team) => (
                      <li key={team.teamNumber}>
                        Team {team.teamNumber} - Station {team.station}
                      </li>
                    ))}
                </ul>
              </div>

              <div>
                <h4>Blue Alliance</h4>
                <ul>
                  {selectedMatch.teams
                    .filter((team) => team.station.startsWith('Blue'))
                    .map((team) => (
                      <li key={team.teamNumber}>
                        Team {team.teamNumber} - Station {team.station}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
