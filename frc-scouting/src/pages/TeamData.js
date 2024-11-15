import React, { useState } from 'react';
import { db } from '../firebase'; // Your Firestore setup
import { collection, query, where, getDocs } from 'firebase/firestore';

const TeamData = () => {
  const [eventCode, setEventCode] = useState(''); // Store the event code
  const [teams, setTeams] = useState([]); // Store the teams for the event
  const [selectedTeam, setSelectedTeam] = useState(''); // Selected team
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state for error handling
  const [teamData, setTeamData] = useState([]); // Store the selected team's match data

  // Fetch teams from Firestore based on the event code
  const fetchTeams = async () => {
    if (!eventCode) return;

    setLoading(true);
    setError(null);
    setTeams([]);

    try {
      const eventCollectionRef = collection(db, eventCode); // Reference to the event code collection
      const snapshot = await getDocs(eventCollectionRef);

      if (snapshot.empty) {
        setError('No teams found for this event code.');
        setLoading(false);
        return;
      }

      const teamList = [];
      snapshot.forEach((doc) => {
        const teamData = doc.data();
        if (teamData.teamNumber) {
          // Add the teamNumber and documentId to the list
          teamList.push({ 
            teamNumber: teamData.teamNumber, 
            documentId: doc.id, 
            matchData: teamData 
          });
        }
      });

      // Remove duplicates based on teamNumber by creating a unique set
      const uniqueTeams = Array.from(
        new Map(teamList.map((item) => [item.teamNumber, item])).values()
      );

      // Sort the teams numerically
      uniqueTeams.sort((a, b) => a.teamNumber - b.teamNumber);

      setTeams(uniqueTeams); // Set the teams to state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Error fetching data. Please try again.');
      setLoading(false);
    }
  };

  // Fetch the match data for the selected team
  const fetchTeamMatchData = async (teamNumber) => {
    if (!teamNumber || !eventCode) return;

    setLoading(true);
    setError(null);
    setTeamData([]);

    try {
      const eventCollectionRef = collection(db, eventCode); // Reference to the event code collection
      const snapshot = await getDocs(eventCollectionRef);

      const teamMatches = [];

      snapshot.forEach((doc) => {
        const teamData = doc.data();
        if (teamData.teamNumber === teamNumber) {
          teamMatches.push({ ...teamData, matchNumber: teamData.matchNumber });
        }
      });

      if (teamMatches.length === 0) {
        setError('No match data found for the selected team.');
      }

      setTeamData(teamMatches); // Set the match data for the selected team
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team match data:', error);
      setError('Error fetching match data. Please try again.');
      setLoading(false);
    }
  };

  // Handle event code input change
  const handleEventCodeChange = (e) => {
    setEventCode(e.target.value);
  };

  // Handle team selection
  const handleTeamSelect = (e) => {
    const teamNumber = parseInt(e.target.value, 10);
    setSelectedTeam(teamNumber);
    fetchTeamMatchData(teamNumber); // Fetch data for the selected team
  };

  return (
    <div>
      <h2>Team Data Dashboard</h2>

      {/* Event Code Input */}
      <div>
        <label htmlFor="eventCode">Enter Event Code:</label>
        <input
          type="text"
          id="eventCode"
          value={eventCode}
          onChange={handleEventCodeChange}
          placeholder="Enter Event Code"
        />
        <button onClick={fetchTeams}>Submit</button>
      </div>

      {/* Loading state */}
      {loading && <p>Loading teams...</p>}

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Dropdown for team selection */}
      {teams.length > 0 && (
        <div>
          <label htmlFor="teamSelect">Select a Team:</label>
          <select id="teamSelect" onChange={handleTeamSelect} value={selectedTeam}>
            <option value="">-- Select a Team --</option>
            {teams.map(({ teamNumber }) => (
              <option key={teamNumber} value={teamNumber}>
                Team {teamNumber}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display match data for selected team */}
      {selectedTeam && (
        <div>
          <h3>Match Data for Team {selectedTeam}</h3>
          {teamData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Match Number</th>
                  <th>Auto High Goals</th>
                  <th>Auto Low Goals</th>
                  <th>Tele High Goals</th>
                  <th>Tele Low Goals</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {teamData.map((match, index) => (
                  <tr key={index}>
                    <td>{match.matchNumber}</td>
                    <td>{match.autoHighGoals}</td>
                    <td>{match.autoLowGoals}</td>
                    <td>{match.teleHighGoals}</td>
                    <td>{match.teleLowGoals}</td>
                    <td>{match.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No match data available for this team.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamData;
