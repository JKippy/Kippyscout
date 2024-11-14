import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Your Firestore instance
import { collection, getDocs, query, where } from 'firebase/firestore'; // For querying Firestore
import axios from 'axios'; // To make API requests
import './Dashboard.css';

const Dashboard = () => {
  const [matches, setMatches] = useState([]); // Store the match data
  const [selectedMatch, setSelectedMatch] = useState(null); // Currently selected match
  const [loading, setLoading] = useState(true); // To handle loading state
  const [eventCode, setEventCode] = useState('MIMIL'); // Default event code
  const [error, setError] = useState(null); // To store any error message
  const [teamStats, setTeamStats] = useState({}); // To store calculated team stats

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

  // Handle match selection
  const handleMatchSelect = (matchNumber) => {
    const match = matches.find((match) => match.matchNumber === matchNumber);
    setSelectedMatch(match);
    fetchTeamStats(match); // Fetch team stats when match is selected
  };

  // Fetch data for a specific team from Firestore
  const fetchTeamStats = async (match) => {
    const teamsInMatch = [
      ...match.teams.filter((team) => team.station.startsWith('Red')).map((team) => team.teamNumber),
      ...match.teams.filter((team) => team.station.startsWith('Blue')).map((team) => team.teamNumber),
    ];

    const stats = {};
    for (let teamNumber of teamsInMatch) {
      const teamData = await fetchTeamData(teamNumber);
      console.log(`Fetched data for team ${teamNumber}:`, teamData); // Debugging line to check data
      if (teamData) {
        stats[teamNumber] = calculateAverages([teamData]); // Wrap data in an array since it's a single document
      }
    }

    setTeamStats(stats);
  };

  // Fetch data for a specific team from Firestore
  const fetchTeamData = async (teamNumber) => {
    const eventCollection = collection(db, eventCode); // Firestore collection for event
    const teamRef = query(eventCollection, where("teamNumber", "==", teamNumber));

    try {
      const teamSnapshot = await getDocs(teamRef);
      if (teamSnapshot.empty) {
        console.log(`No data found for team ${teamNumber}`);
        return null;
      }

      let teamData = null;
      teamSnapshot.forEach((doc) => {
        teamData = doc.data(); // Assuming each team has one document with their data
      });

      console.log(`Data for team ${teamNumber}:`, teamData); // Debugging line to check team data
      return teamData;
    } catch (error) {
      console.error(`Error fetching data for team ${teamNumber}:`, error);
      return null;
    }
  };

  // Calculate average statistics for a team
  const calculateAverages = (teamData) => {
    const totalStats = teamData.reduce(
      (totals, data) => {
        totals.autoHighGoal += data.autoHighGoals || 0; // Correct field names based on your Firestore data
        totals.autoLowGoal += data.autoLowGoals || 0; // Correct field names based on your Firestore data
        totals.teleHighGoal += data.teleHighGoals || 0; // Correct field names based on your Firestore data
        totals.teleLowGoal += data.teleLowGoals || 0; // Correct field names based on your Firestore data
        totals.count += 1;
        return totals;
      },
      { autoHighGoal: 0, autoLowGoal: 0, teleHighGoal: 0, teleLowGoal: 0, count: 0 }
    );

    // Prevent division by zero if there is no valid data
    const averages = {
      autoHighGoal: totalStats.count > 0 ? totalStats.autoHighGoal / totalStats.count : 0,
      autoLowGoal: totalStats.count > 0 ? totalStats.autoLowGoal / totalStats.count : 0,
      teleHighGoal: totalStats.count > 0 ? totalStats.teleHighGoal / totalStats.count : 0,
      teleLowGoal: totalStats.count > 0 ? totalStats.teleLowGoal / totalStats.count : 0,
    };

    console.log('Calculated averages:', averages); // Debugging line to check averages
    return averages;
  };

  // Calculate alliance averages for a given alliance (Red or Blue)
  const calculateAllianceAverages = (allianceTeams) => {
    const totalStats = allianceTeams.reduce(
      (totals, teamNumber) => {
        const teamData = teamStats[teamNumber];
        if (teamData) {
          totals.autoHighGoal += teamData.autoHighGoal || 0;
          totals.autoLowGoal += teamData.autoLowGoal || 0;
          totals.teleHighGoal += teamData.teleHighGoal || 0;
          totals.teleLowGoal += teamData.teleLowGoal || 0;
          totals.count += 1;
        }
        return totals;
      },
      { autoHighGoal: 0, autoLowGoal: 0, teleHighGoal: 0, teleLowGoal: 0, count: 0 }
    );

    // Calculate the averages
    return {
      autoHighGoal: totalStats.count > 0 ? parseFloat((totalStats.autoHighGoal / totalStats.count).toFixed(2)) : 0,
      autoLowGoal: totalStats.count > 0 ? parseFloat((totalStats.autoLowGoal / totalStats.count).toFixed(2)) : 0,
      teleHighGoal: totalStats.count > 0 ? parseFloat((totalStats.teleHighGoal / totalStats.count).toFixed(2)) : 0,
      teleLowGoal: totalStats.count > 0 ? parseFloat((totalStats.teleLowGoal / totalStats.count).toFixed(2)) : 0,
    };
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

              {/* Red Alliance */}
              <div>
                <h4>Red Alliance</h4>
                <div>
                  {/* Display average scores for the Red Alliance */}
                  <p>Avg Auto High: {calculateAllianceAverages(selectedMatch.teams.filter(team => team.station.startsWith('Red')).map(team => team.teamNumber)).autoHighGoal}</p>
                  <p>Avg Auto Low: {calculateAllianceAverages(selectedMatch.teams.filter(team => team.station.startsWith('Red')).map(team => team.teamNumber)).autoLowGoal}</p>
                  <p>Avg Tele High: {calculateAllianceAverages(selectedMatch.teams.filter(team => team.station.startsWith('Red')).map(team => team.teamNumber)).teleHighGoal}</p>
                  <p>Avg Tele Low: {calculateAllianceAverages(selectedMatch.teams.filter(team => team.station.startsWith('Red')).map(team => team.teamNumber)).teleLowGoal}</p>
                </div>
                <ul>
                  {selectedMatch.teams
                    .filter((team) => team.station.startsWith('Red'))
                    .map((team) => (
                      <li key={team.teamNumber}>
                        {team.station} - {team.teamNumber}
                        {teamStats[team.teamNumber] && (
                          <div>
                            <p>Avg Auto High: {teamStats[team.teamNumber].autoHighGoal}</p>
                            <p>Avg Auto Low: {teamStats[team.teamNumber].autoLowGoal}</p>
                            <p>Avg Tele High: {teamStats[team.teamNumber].teleHighGoal}</p>
                            <p>Avg Tele Low: {teamStats[team.teamNumber].teleLowGoal}</p>
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Blue Alliance */}
              <div>
                <h4>Blue Alliance</h4>
                <div>
                  {/* Display average scores for the Blue Alliance */}
                  <p>Avg Auto High: {calculateAllianceAverages(selectedMatch.teams.filter(team => team.station.startsWith('Blue')).map(team => team.teamNumber)).autoHighGoal}</p>
                  <p>Avg Auto Low: {calculateAllianceAverages(selectedMatch.teams.filter(team => team.station.startsWith('Blue')).map(team => team.teamNumber)).autoLowGoal}</p>
                  <p>Avg Tele High: {calculateAllianceAverages(selectedMatch.teams.filter(team => team.station.startsWith('Blue')).map(team => team.teamNumber)).teleHighGoal}</p>
                  <p>Avg Tele Low: {calculateAllianceAverages(selectedMatch.teams.filter(team => team.station.startsWith('Blue')).map(team => team.teamNumber)).teleLowGoal}</p>
                </div>
                <ul>
                  {selectedMatch.teams
                    .filter((team) => team.station.startsWith('Blue'))
                    .map((team) => (
                      <li key={team.teamNumber}>
                        {team.station} - {team.teamNumber}
                        {teamStats[team.teamNumber] && (
                          <div>
                            <p>Avg Auto High: {teamStats[team.teamNumber].autoHighGoal}</p>
                            <p>Avg Auto Low: {teamStats[team.teamNumber].autoLowGoal}</p>
                            <p>Avg Tele High: {teamStats[team.teamNumber].teleHighGoal}</p>
                            <p>Avg Tele Low: {teamStats[team.teamNumber].teleLowGoal}</p>
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
