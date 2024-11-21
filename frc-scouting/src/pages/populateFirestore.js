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
  const [teamStats, setTeamStats] = useState({}); // To store the average stats per team

  // Fetch match schedule from the API
  const fetchSchedule = async (eventCode) => {
    setLoading(true);
    setError(null);
    console.log("Event Code:", eventCode);
    
    const response = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://cors-anywhere.herokuapp.com/https://frc-api.firstinspires.org/v3.0/2024/schedule/${eventCode}?tournamentLevel=Qualification`,
      headers: { 
        'Authorization': `Basic ${process.env.REACT_APP_FRC_API_AUTH_STRING}`, 
        'If-Modified-Since': ''
      }
    };

    try {
      const result = await axios(response);
      // Save the response to localStorage with a timestamp
      const dataToStore = {
        timestamp: Date.now(),
        matches: result.data.Schedule,
      };
      localStorage.setItem(`schedule_${eventCode}`, JSON.stringify(dataToStore));

      setMatches(result.data.Schedule); // Store the matches in the state
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setError("Error fetching match schedule");
      setLoading(false);
    }
  };

  // Check if the data is in localStorage
  const getScheduleFromLocalStorage = (eventCode) => {
    const storedData = localStorage.getItem(`schedule_${eventCode}`);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const timeDifference = Date.now() - parsedData.timestamp;
      
      // If the data is older than 1 hour (3600000 ms), re-fetch it
      if (timeDifference < 3600000) {
        return parsedData.matches;
      }
    }
    return null;
  };

  // Function to calculate average statistics for each team
  const fetchAverageStats = async (eventCode) => {
    try {
      const statsRef = collection(db, eventCode); // Get the collection for the specific event code
      const statsSnapshot = await getDocs(statsRef);
      const teamStats = {};

      statsSnapshot.forEach((doc) => {
        const data = doc.data();
        const teamNumber = data.teamNumber;

        // If the team is not in the stats object, initialize it
        if (!teamStats[teamNumber]) {
          teamStats[teamNumber] = {
            autoHighGoal: 0,
            autoLowGoal: 0,
            teleHighGoals: 0,
            teleLowGoals: 0,
            matchesPlayed: 0,
          };
        }

        // Accumulate stats for each team
        teamStats[teamNumber].autoHighGoal += data.autoHighGoal || 0;
        teamStats[teamNumber].autoLowGoal += data.autoLowGoal || 0;
        teamStats[teamNumber].teleHighGoals += data.teleHighGoals || 0;
        teamStats[teamNumber].teleLowGoals += data.teleLowGoals || 0;
        teamStats[teamNumber].matchesPlayed += 1;
      });

      // Now calculate the averages
      Object.keys(teamStats).forEach((teamNumber) => {
        const stats = teamStats[teamNumber];
        stats.autoHighGoal /= stats.matchesPlayed;
        stats.autoLowGoal /= stats.matchesPlayed;
        stats.teleHighGoals /= stats.matchesPlayed;
        stats.teleLowGoals /= stats.matchesPlayed;
      });

      setTeamStats(teamStats); // Save the average stats in the state
    } catch (error) {
      console.error("Error fetching team statistics:", error);
      setError("Error fetching team statistics");
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
    const storedMatches = getScheduleFromLocalStorage(eventCode);
    
    if (storedMatches) {
      // If the data is available in localStorage and it's not too old, use it
      setMatches(storedMatches);
      setLoading(false);
    } else {
      fetchSchedule(eventCode); // Fetch fresh data if not available or outdated
    }

    // Fetch team statistics when the component mounts or eventCode changes
    fetchAverageStats(eventCode);
  }, [eventCode]); // Re-fetch when event code changes

  return (
    <div className="dashboard">
      <h2>Drive Team Dashboard</h2>

      {/* Event Code Input */}
      <div>
        <label htmlFor="eventCode">Enter Event Code:</label>
        <input
          id="eventCode"
          type="text"
          value={eventCode}
          onChange={handleEventCodeChange}
          placeholder="e.g., MILIV"
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
              <p>{selectedMatch.description}</p>
              <p><strong>Start Time:</strong> {new Date(selectedMatch.startTime).toLocaleString()}</p>

              <div>
                <h4>Red Alliance</h4>
                <ul>
                  {selectedMatch.teams
                    .filter((team) => team.station.startsWith('Red'))
                    .map((team) => (
                      <li key={team.teamNumber}>
                        {team.station} - {team.teamNumber}
                        {teamStats[team.teamNumber] && (
                          <div>
                            <p>Average Auto High Goals: {teamStats[team.teamNumber].autoHighGoal.toFixed(2)}</p>
                            <p>Average Auto Low Goals: {teamStats[team.teamNumber].autoLowGoal.toFixed(2)}</p>
                            <p>Average Tele High Goals: {teamStats[team.teamNumber].teleHighGoals.toFixed(2)}</p>
                            <p>Average Tele Low Goals: {teamStats[team.teamNumber].teleLowGoals.toFixed(2)}</p>
                          </div>
                        )}
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
                        {team.station} - {team.teamNumber}
                        {teamStats[team.teamNumber] && (
                          <div>
                            <p>Average Auto High Goals: {teamStats[team.teamNumber].autoHighGoal.toFixed(2)}</p>
                            <p>Average Auto Low Goals: {teamStats[team.teamNumber].autoLowGoal.toFixed(2)}</p>
                            <p>Average Tele High Goals: {teamStats[team.teamNumber].teleHighGoals.toFixed(2)}</p>
                            <p>Average Tele Low Goals: {teamStats[team.teamNumber].teleLowGoals.toFixed(2)}</p>
                          </div>
                        )}
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
