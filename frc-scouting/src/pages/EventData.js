import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Your Firestore setup
import { collection, query, getDocs } from 'firebase/firestore';
import { useEventCode } from '../components/EventCodeContext'; // Import the context
import './EventData.css'; // Custom styles

const EventData = () => {
  const { eventCode, setEventCode } = useEventCode(); // Access the eventCode from context
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' }); // Sorting state
  const [colorCode, setColorCode] = useState(false); // State for color-coding checkbox

  // Fetch data based on eventCode
  const fetchEventData = async (eventCode) => {
    setLoading(true);
    setError(null);

    const eventCollection = collection(db, eventCode); // Get collection for specific event
    const q = query(eventCollection); // Query to fetch all match data for this event

    try {
      const querySnapshot = await getDocs(q);
      const teamDataMap = {};

      querySnapshot.forEach((doc) => {
        const teamData = doc.data();
        const { teamNumber } = teamData;

        if (!teamDataMap[teamNumber]) {
          // Initialize the team data with an empty object
          teamDataMap[teamNumber] = {
            teamNumber,
            autoHighGoals: 0,
            autoLowGoals: 0,
            teleHighGoals: 0,
            teleLowGoals: 0,
            matchCount: 0,
          };
        }

        // Aggregate the match data for this team
        teamDataMap[teamNumber].autoHighGoals += teamData.autoHighGoals || 0;
        teamDataMap[teamNumber].autoLowGoals += teamData.autoLowGoals || 0;
        teamDataMap[teamNumber].teleHighGoals += teamData.teleHighGoals || 0;
        teamDataMap[teamNumber].teleLowGoals += teamData.teleLowGoals || 0;
        teamDataMap[teamNumber].matchCount += 1;
      });

      // Convert the map to an array and calculate averages
      const teamsArray = Object.values(teamDataMap).map((team) => {
        return {
          ...team,
          autoHighGoals: (team.autoHighGoals / team.matchCount).toFixed(2),
          autoLowGoals: (team.autoLowGoals / team.matchCount).toFixed(2),
          teleHighGoals: (team.teleHighGoals / team.matchCount).toFixed(2),
          teleLowGoals: (team.teleLowGoals / team.matchCount).toFixed(2),
        };
      });

      setTeamsData(teamsArray); // Set teams data to state
      setLoading(false);
    } catch (error) {
      console.error("Error fetching event data: ", error);
      setError("Error fetching data. Please check the event code.");
      setLoading(false);
    }
  };

  // Handle input changes for event code
  const handleEventCodeChange = (e) => {
    setEventCode(e.target.value);
  };

  // Handle event code submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (eventCode.trim()) {
      fetchEventData(eventCode);
    }
  };

  // Function to sort data based on a column
  const handleSort = (key) => {
    const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const sortedData = [...teamsData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setTeamsData(sortedData);
    setSortConfig({ key, direction });
  };

  // Handle sorting when user clicks on a column header
  const getSortDirectionClass = (key) => {
    return sortConfig.key === key ? (sortConfig.direction === 'asc' ? 'asc' : 'desc') : '';
  };

  // Color code function
  const getColorStyle = (value, min, max) => {
    const percentage = (value - min) / (max - min);
    const r = Math.floor((1 - percentage) * 255); // Dark red for low values
    const g = Math.floor(percentage * 255); // Bright green for high values
    return {
      backgroundColor: `rgb(${r}, ${g}, 0)`, // RGB color scale from red to green
    };
  };

  // Function to get min and max for each column
  const getColumnMinMax = (column) => {
    const values = teamsData.map((team) => parseFloat(team[column]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { min, max }; // Return min and max values
  };

  return (
    <div className="event-data">
      <h2>Event Data Dashboard</h2>

      <form onSubmit={handleSubmit} className="event-form">
        <label htmlFor="eventCode">Enter Event Code:</label>
        <input
          id="eventCode"
          type="text"
          value={eventCode}
          onChange={handleEventCodeChange}
          placeholder="e.g., MILIV"
        />
        <button type="submit">Fetch Data</button>
      </form>

      <div className="color-code-checkbox">
        <input
          type="checkbox"
          id="colorCode"
          checked={colorCode}
          onChange={() => setColorCode(!colorCode)}
        />
        <label htmlFor="colorCode">Enable Color Coding</label>
      </div>

      {error && <p className="error-message">{error}</p>}
      
      {loading && <p>Loading data...</p>}

      {!loading && teamsData.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('teamNumber')} className={getSortDirectionClass('teamNumber')}>
                  Team Number
                </th>
                <th onClick={() => handleSort('autoHighGoals')} className={getSortDirectionClass('autoHighGoals')}>
                  Avg Auto High Goals
                </th>
                <th onClick={() => handleSort('autoLowGoals')} className={getSortDirectionClass('autoLowGoals')}>
                  Avg Auto Low Goals
                </th>
                <th onClick={() => handleSort('teleHighGoals')} className={getSortDirectionClass('teleHighGoals')}>
                  Avg Tele High Goals
                </th>
                <th onClick={() => handleSort('teleLowGoals')} className={getSortDirectionClass('teleLowGoals')}>
                  Avg Tele Low Goals
                </th>
              </tr>
            </thead>
            <tbody>
              {teamsData.map((team, index) => {
                const autoHighGoalsMinMax = getColumnMinMax('autoHighGoals');
                const autoLowGoalsMinMax = getColumnMinMax('autoLowGoals');
                const teleHighGoalsMinMax = getColumnMinMax('teleHighGoals');
                const teleLowGoalsMinMax = getColumnMinMax('teleLowGoals');

                return (
                  <tr key={index}>
                    <td>{team.teamNumber}</td>
                    <td
                      style={colorCode ? getColorStyle(team.autoHighGoals, autoHighGoalsMinMax.min, autoHighGoalsMinMax.max) : {}}
                    >
                      {team.autoHighGoals}
                    </td>
                    <td
                      style={colorCode ? getColorStyle(team.autoLowGoals, autoLowGoalsMinMax.min, autoLowGoalsMinMax.max) : {}}
                    >
                      {team.autoLowGoals}
                    </td>
                    <td
                      style={colorCode ? getColorStyle(team.teleHighGoals, teleHighGoalsMinMax.min, teleHighGoalsMinMax.max) : {}}
                    >
                      {team.teleHighGoals}
                    </td>
                    <td
                      style={colorCode ? getColorStyle(team.teleLowGoals, teleLowGoalsMinMax.min, teleLowGoalsMinMax.max) : {}}
                    >
                      {team.teleLowGoals}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventData;
