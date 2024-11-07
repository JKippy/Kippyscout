import React, { useState, useEffect } from 'react';
import { db } from '../firebase';  // Firestore instance
import { collection, query, where, getDocs } from 'firebase/firestore';  // Firestore methods

const Dashboard = () => {
  const storedEventCode = localStorage.getItem('eventCode') || '';  // Fetch eventCode from localStorage
  const storedMatchNumber = Number(localStorage.getItem('matchNumber')) || 1;  // Fetch matchNumber from localStorage

  const [eventCode, setEventCode] = useState(storedEventCode);  // Set initial eventCode from localStorage
  const [matchNumber, setMatchNumber] = useState(storedMatchNumber);  // Set initial matchNumber
  const [matchTeams, setMatchTeams] = useState([]);
  const [teamAverages, setTeamAverages] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Cache for match data (to avoid fetching the same data again)
  const [matchDataCache, setMatchDataCache] = useState({});

  // Function to fetch match teams and their stats
  const fetchMatchTeams = async () => {
    if (!eventCode || !matchNumber) return;

    // Check if the data for this match is already cached
    const cacheKey = `${eventCode}_match_${matchNumber}`;
    if (matchDataCache[cacheKey]) {
      // If cached, use the data without making a new Firestore request
      const { teamsInMatch, teamStats } = matchDataCache[cacheKey];
      setMatchTeams(teamsInMatch);
      setTeamAverages(teamStats);
      return;
    }

    setLoading(true);

    try {
      const matchRef = collection(db, eventCode);
      const q = query(
        matchRef,
        where('matchNumber', '==', matchNumber)  // Filter data by match number
      );
      
      const querySnapshot = await getDocs(q);
      const teamsInMatch = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!teamsInMatch.includes(data.teamNumber)) {
          teamsInMatch.push(data.teamNumber);  // Add team number only once
        }
      });

      // Calculate averages for each team
      const teamStats = await calculateTeamAverages(teamsInMatch);

      // Cache the data in the state
      setMatchDataCache((prevCache) => ({
        ...prevCache,
        [cacheKey]: { teamsInMatch, teamStats }
      }));

      setMatchTeams(teamsInMatch);
      setTeamAverages(teamStats);

    } catch (error) {
      console.error('Error fetching match teams:', error);
    }

    setLoading(false);
  };

  // Function to calculate the average stats and matches played for each team
  const calculateTeamAverages = async (teamsInMatch) => {
    const teamStats = {};

    // Loop through each team to calculate their averages and matches played
    for (const teamNumber of teamsInMatch) {
      const teamRef = collection(db, eventCode);
      const q = query(
        teamRef,
        where('teamNumber', '==', teamNumber)  // Filter by team number
      );
      
      const querySnapshot = await getDocs(q);
      let totalAutoHighGoals = 0, totalAutoLowGoals = 0, totalTeleHighGoals = 0, totalTeleLowGoals = 0;
      let matchCount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalAutoHighGoals += data.autoHighGoals;
        totalAutoLowGoals += data.autoLowGoals;
        totalTeleHighGoals += data.teleHighGoals;
        totalTeleLowGoals += data.teleLowGoals;
        matchCount++;
      });

      // Calculate average for the team
      if (matchCount > 0) {
        teamStats[teamNumber] = {
          autoHighGoals: totalAutoHighGoals / matchCount,
          autoLowGoals: totalAutoLowGoals / matchCount,
          teleHighGoals: totalTeleHighGoals / matchCount,
          teleLowGoals: totalTeleLowGoals / matchCount,
          matchesPlayed: matchCount,  // Track the number of matches played
        };
      }
    }

    return teamStats;
  };

  // useEffect to fetch teams and their averages when eventCode or matchNumber changes
  useEffect(() => {
    fetchMatchTeams();
  }, [eventCode, matchNumber]);

  // Store eventCode and matchNumber in localStorage whenever they change
  useEffect(() => {
    if (eventCode) {
      localStorage.setItem('eventCode', eventCode);  // Save eventCode to localStorage
    }
    if (matchNumber) {
      localStorage.setItem('matchNumber', matchNumber);  // Save matchNumber to localStorage
    }
  }, [eventCode, matchNumber]);

  return (
    <div>
      <h2>Competition Dashboard</h2>
      <div className="dashboard-container">
        {/* Event Code Input */}
        <div className="form-group">
          <label>Event Code:</label>
          <input
            type="text"
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value)}  // Update eventCode state
            placeholder="Enter Event Code"
            required
          />
        </div>

        {/* Match Number Dropdown */}
        <div className="form-group">
          <label>Match Number:</label>
          <select
            value={matchNumber}
            onChange={(e) => setMatchNumber(Number(e.target.value))}  // Update matchNumber state
            required
          >
            {[...Array(80).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                Match {num + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Display Loading */}
        {loading && <p>Loading...</p>}

        {/* Display Stats for Each Team */}
        {!loading && matchTeams.length > 0 && (
          <div>
            <h3>Teams in Match {matchNumber}:</h3>
            <table>
              <thead>
                <tr>
                  <th>Team Number</th>
                  <th>Matches Played</th>
                  <th>Auto High Goals (Avg)</th>
                  <th>Auto Low Goals (Avg)</th>
                  <th>Tele High Goals (Avg)</th>
                  <th>Tele Low Goals (Avg)</th>
                </tr>
              </thead>
              <tbody>
                {matchTeams.map((teamNumber) => (
                  <tr key={teamNumber}>
                    <td>{teamNumber}</td>
                    <td>{teamAverages[teamNumber]?.matchesPlayed || 'N/A'}</td>
                    <td>{teamAverages[teamNumber]?.autoHighGoals.toFixed(2) || 'N/A'}</td>
                    <td>{teamAverages[teamNumber]?.autoLowGoals.toFixed(2) || 'N/A'}</td>
                    <td>{teamAverages[teamNumber]?.teleHighGoals.toFixed(2) || 'N/A'}</td>
                    <td>{teamAverages[teamNumber]?.teleLowGoals.toFixed(2) || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
