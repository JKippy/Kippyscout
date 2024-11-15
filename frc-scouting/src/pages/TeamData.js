// TeamData.js
import React, { useState } from 'react';
import { db } from '../firebase'; // Your Firestore instance
import { collection, getDocs, query, where } from 'firebase/firestore'; // For querying Firestore

const TeamData = () => {
  const [eventCode, setEventCode] = useState(''); // Store the event code
  const [teams, setTeams] = useState([]); // Store the teams for the event
  const [selectedTeam, setSelectedTeam] = useState(null); // Store the selected team
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [error, setError] = useState(null); // Store error messages if any

  // Fetch teams from Firestore based on the event code
  const fetchTeams = async () => {
    if (!eventCode) {
      return;
    }

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
          teamList.push(teamData.teamNumber); // Assuming teamNumber exists in each document
        }
      });

      setTeams(teamList); // Set the teams to state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Error fetching data. Please try again.');
      setLoading(false);
    }
  };

  // Handle event code input change
  const handleEventCodeChange = (e) => {
    setEventCode(e.target.value);
  };

  // Handle team selection
  const handleTeamSelect = (e) => {
    setSelectedTeam(e.target.value);
  };

  return (
    <div>
      <h2>Team Data Dashboard</h2>
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

      {/* Show loading state */}
      {loading && <p>Loading teams...</p>}

      {/* Show error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Dropdown for team selection */}
      {teams.length > 0 && (
        <div>
          <label htmlFor="teamSelect">Select a Team:</label>
          <select id="teamSelect" onChange={handleTeamSelect} value={selectedTeam}>
            <option value="">-- Select a Team --</option>
            {teams.map((teamNumber) => (
              <option key={teamNumber} value={teamNumber}>
                Team {teamNumber}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Show team stats when a team is selected */}
      {selectedTeam && (
        <div>
          <h3>Selected Team: {selectedTeam}</h3>
          <p>Displaying match data for team {selectedTeam}...</p>
          {/* Add logic to display match data here */}
        </div>
      )}
    </div>
  );
};

export default TeamData;
