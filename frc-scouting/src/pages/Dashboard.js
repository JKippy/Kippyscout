import React, { useEffect, useState } from 'react';
import './Scouting.css'; // Keep your existing CSS
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const Dashboard = () => {
  const [matchNumbers, setMatchNumbers] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [robotsData, setRobotsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventCode, setEventCode] = useState(localStorage.getItem('eventCode') || ''); // Retrieve event code from localStorage

  const db = getFirestore(); // Initialize Firestore

  // Save eventCode to localStorage whenever it changes
  useEffect(() => {
    if (eventCode) {
      localStorage.setItem('eventCode', eventCode);
    }
  }, [eventCode]);

  // Fetch match numbers when the component mounts
  useEffect(() => {
    const fetchMatchNumbers = async () => {
      if (!eventCode) return; // Don't fetch data if there's no eventCode
      setLoading(true);

      // Dynamically reference the collection based on the event code
      const matchRef = collection(db, 'events', eventCode, 'matchData'); // Use eventCode for the collection name
      const matchSnapshot = await getDocs(matchRef);
      const matches = matchSnapshot.docs.map((doc) => doc.data().matchNumber);
      setMatchNumbers([...new Set(matches)]); // Get unique match numbers
      setLoading(false);
    };

    fetchMatchNumbers();
  }, [eventCode]);

  // Fetch robots data for the selected match
  useEffect(() => {
    const fetchMatchData = async () => {
      if (selectedMatch && eventCode) {
        setLoading(true);
        console.log('Fetching data for match:', selectedMatch); // Debugging line

        // Dynamically reference the collection based on the event code
        const matchRef = collection(db, 'events', eventCode, 'matchData'); // Use eventCode for the collection name
        const matchQuery = query(matchRef, where('matchNumber', '==', selectedMatch));
        const matchSnapshot = await getDocs(matchQuery);
        console.log('Match snapshot:', matchSnapshot.docs); // Debugging line

        const matchData = matchSnapshot.docs.map(doc => doc.data());
        console.log('Match data:', matchData); // Debugging line

        // Get the team numbers of the 6 robots in this match
        const teamNumbersInMatch = matchData.map(data => data.teamNumber);
        console.log('Teams in this match:', teamNumbersInMatch);

        // Fetch data for these teams from all matches
        const robotsData = [];
        for (let teamNumber of teamNumbersInMatch) {
          const teamQuery = query(matchRef, where('teamNumber', '==', teamNumber));
          const teamSnapshot = await getDocs(teamQuery);
          const teamData = teamSnapshot.docs.map(doc => doc.data());
          
          // Aggregate the data for this team
          const aggregatedData = teamData.reduce((acc, data) => {
            const autoHighGoal = parseInt(data.autoHighGoals, 10) || 0;
            const autoLowGoal = parseInt(data.autoLowGoals, 10) || 0;
            const teleHighGoal = parseInt(data.teleHighGoals, 10) || 0;
            const teleLowGoal = parseInt(data.teleLowGoals, 10) || 0;
            const endgameStatus = data.endgameStatus || 0;
        
            // Add data to aggregates
            acc.autoHighGoals.push(autoHighGoal);
            acc.autoLowGoals.push(autoLowGoal);
            acc.teleHighGoals.push(teleHighGoal);
            acc.teleLowGoals.push(teleLowGoal);
            acc.endgameStatus.push(endgameStatus);
        
            return acc;
          }, {
            teamNumber,
            autoHighGoals: [],
            autoLowGoals: [],
            teleHighGoals: [],
            teleLowGoals: [],
            endgameStatus: [],
          });

          // Calculate averages
          const avgAutoHighGoals = aggregatedData.autoHighGoals.reduce((sum, val) => sum + val, 0) / aggregatedData.autoHighGoals.length;
          const avgAutoLowGoals = aggregatedData.autoLowGoals.reduce((sum, val) => sum + val, 0) / aggregatedData.autoLowGoals.length;
          const avgTeleHighGoals = aggregatedData.teleHighGoals.reduce((sum, val) => sum + val, 0) / aggregatedData.teleHighGoals.length;
          const avgTeleLowGoals = aggregatedData.teleLowGoals.reduce((sum, val) => sum + val, 0) / aggregatedData.teleLowGoals.length;
          const avgEndgameStatus = aggregatedData.endgameStatus.reduce((sum, val) => sum + val, 0) / aggregatedData.endgameStatus.length;

          robotsData.push({
            teamNumber: aggregatedData.teamNumber,
            avgAutoHighGoals,
            avgAutoLowGoals,
            avgTeleHighGoals,
            avgTeleLowGoals,
            avgEndgameStatus
          });
        }
        
        setRobotsData(robotsData);
        setLoading(false);
      }
    };
  
    fetchMatchData();
  }, [selectedMatch, eventCode]);

  const handleMatchSelect = (e) => {
    setSelectedMatch(e.target.value);
  };

  const handleEventCodeChange = (e) => {
    setEventCode(e.target.value);
  };

  return (
    <div>
      <div className="main-content">
        {/* Event Code input field */}
        <div className="form-group">
          <label>Event Code:</label>
          <input
            type="text"
            value={eventCode}
            onChange={handleEventCodeChange}
            placeholder="Enter Event Code"
          />
        </div>

        <h2>Data Dashboard</h2>

        <div className="scouting-container">
          <div className="form-group">
            <label>Completed Matches:</label>
            <select onChange={handleMatchSelect} disabled={loading}>
              <option value="">Select a Match</option>
              {matchNumbers.map((match) => (
                <option key={match} value={match}>
                  Match {match}
                </option>
              ))}
            </select>
          </div>

          <h3>{selectedMatch ? `Match ${selectedMatch} Robot Analysis` : 'Select a Match'}</h3>

          {loading && <p>Loading data...</p>}

          <div className="robots-container">
            {robotsData.length > 0 ? (
              robotsData.map((robot) => (
                <div key={robot.teamNumber} className="robot-card">
                  <h5>{robot.teamNumber}</h5>
                  <p>Average Auto High Goals: {robot.avgAutoHighGoals.toFixed(2)}</p>
                  <p>Average Auto Low Goals: {robot.avgAutoLowGoals.toFixed(2)}</p>
                  <p>Average Tele High Goals: {robot.avgTeleHighGoals.toFixed(2)}</p>
                  <p>Average Tele Low Goals: {robot.avgTeleLowGoals.toFixed(2)}</p>
                  <p>Average Endgame Status: {robot.avgEndgameStatus.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p>No data for this match.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
