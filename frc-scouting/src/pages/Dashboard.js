import React, { useState, useEffect } from 'react';
import axios from 'axios'; // To make API requests
import { db } from '../firebase'; // Assuming you have Firebase initialized and exported as 'db'

const Dashboard = () => {
  const [eventCode, setEventCode] = useState('');
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redAlliance, setRedAlliance] = useState([]);
  const [blueAlliance, setBlueAlliance] = useState([]);
  const [teamAverages, setTeamAverages] = useState({}); // Store averages for each team
  
  // Fetch match schedule based on event code
  const fetchSchedule = async (eventCode) => {
    setLoading(true);
    setError('');
    
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
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

  // Fetch average goals for each team
  const fetchTeamAverages = async (eventCode) => {
    const teams = [];
    const averages = {};
    
    // Query Firestore for all teams for this event
    const snapshot = await db.collection(eventCode).get(); // Get all match documents for this event
    snapshot.forEach(doc => {
      const matchData = doc.data();
      const teamNumber = matchData.teamNumber;
      if (!teams.includes(teamNumber)) {
        teams.push(teamNumber);
      }

      if (!averages[teamNumber]) {
        averages[teamNumber] = {
          autoHighGoals: 0,
          autoLowGoals: 0,
          teleHighGoals: 0,
          teleLowGoals: 0,
          matchCount: 0
        };
      }

      // Add match data to the averages
      averages[teamNumber].autoHighGoals += matchData.autoHighGoals || 0;
      averages[teamNumber].autoLowGoals += matchData.autoLowGoals || 0;
      averages[teamNumber].teleHighGoals += matchData.teleHighGoals || 0;
      averages[teamNumber].teleLowGoals += matchData.teleLowGoals || 0;
      averages[teamNumber].matchCount += 1;
    });

    // Calculate averages
    Object.keys(averages).forEach(teamNumber => {
      const teamStats = averages[teamNumber];
      averages[teamNumber] = {
        autoHighGoals: (teamStats.autoHighGoals / teamStats.matchCount).toFixed(2),
        autoLowGoals: (teamStats.autoLowGoals / teamStats.matchCount).toFixed(2),
        teleHighGoals: (teamStats.teleHighGoals / teamStats.matchCount).toFixed(2),
        teleLowGoals: (teamStats.teleLowGoals / teamStats.matchCount).toFixed(2)
      };
    });

    setTeamAverages(averages); // Store averages in state
  };

  // Handle event code change
  const handleEventCodeChange = (e) => {
    setEventCode(e.target.value);
  };

  // Handle match selection
  const handleMatchSelect = (e) => {
    const selectedMatchNumber = e.target.value;
    setSelectedMatch(selectedMatchNumber);
    
    // Find the match by matchNumber
    const match = matches.find(m => m.matchNumber === parseInt(selectedMatchNumber));
    if (match) {
      // Split teams into red and blue alliances
      const redTeams = match.teams.filter(team => team.station.startsWith('Red'));
      const blueTeams = match.teams.filter(team => team.station.startsWith('Blue'));
      setRedAlliance(redTeams);
      setBlueAlliance(blueTeams);
    }
  };

  // Handle fetch when user presses the "Fetch Schedule" button
  const handleFetchClick = () => {
    if (eventCode) {
      fetchSchedule(eventCode);
      fetchTeamAverages(eventCode); // Fetch averages for the teams in the event
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
          
          {/* Display Red and Blue Alliances */}
          {selectedMatch && (
            <div>
              <h3>Red Alliance</h3>
              <ul>
                {redAlliance.map(team => (
                  <li key={team.teamNumber}>
                    Team {team.teamNumber} 
                    - Avg Auto High Goals: {teamAverages[team.teamNumber]?.autoHighGoals || 0}, 
                    Avg Auto Low Goals: {teamAverages[team.teamNumber]?.autoLowGoals || 0},
                    Avg Tele High Goals: {teamAverages[team.teamNumber]?.teleHighGoals || 0},
                    Avg Tele Low Goals: {teamAverages[team.teamNumber]?.teleLowGoals || 0}
                  </li>
                ))}
              </ul>

              <h3>Blue Alliance</h3>
              <ul>
                {blueAlliance.map(team => (
                  <li key={team.teamNumber}>
                    Team {team.teamNumber} 
                    - Avg Auto High Goals: {teamAverages[team.teamNumber]?.autoHighGoals || 0}, 
                    Avg Auto Low Goals: {teamAverages[team.teamNumber]?.autoLowGoals || 0},
                    Avg Tele High Goals: {teamAverages[team.teamNumber]?.teleHighGoals || 0},
                    Avg Tele Low Goals: {teamAverages[team.teamNumber]?.teleLowGoals || 0}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
