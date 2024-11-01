import React, { useEffect, useState } from 'react';
import './Scouting.css'; // Keep your existing CSS

const Dashboard = () => {
  const [eventCode, setEventCode] = useState('');
  const [matchNumbers] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [robotsData] = useState([]);

  // Placeholder data for teams
  const placeholderRobotsData = [
    { teamNumber: '111', alliance: 'Red', autoGoals: 3, teleGoals: 5, notes: 'Strong performance' },
    { teamNumber: '222', alliance: 'Red', autoGoals: 2, teleGoals: 4, notes: 'Good defense' },
    { teamNumber: '333', alliance: 'Red', autoGoals: 1, teleGoals: 3, notes: 'Mechanical issues' },
    { teamNumber: '444', alliance: 'Blue', autoGoals: 4, teleGoals: 6, notes: 'Excellent strategy' },
    { teamNumber: '555', alliance: 'Blue', autoGoals: 3, teleGoals: 3, notes: 'Consistent performance' },
    { teamNumber: '666', alliance: 'Blue', autoGoals: 2, teleGoals: 5, notes: 'Strong alliance' },
  ];

  useEffect(() => {
    // Fetch match numbers and robots data as needed
  }, [eventCode, selectedMatch]);

  const handleEventCodeChange = (e) => {
    setEventCode(e.target.value);
    setSelectedMatch(null);
  };

  const handleMatchSelect = (e) => {
    setSelectedMatch(e.target.value);
  };

  // Separate robots data by alliance
  const redTeams = (selectedMatch ? robotsData : placeholderRobotsData).filter(robot => robot.alliance === 'Red');
  const blueTeams = (selectedMatch ? robotsData : placeholderRobotsData).filter(robot => robot.alliance === 'Blue');

  return (
    <div>
      <div className="main-content">
        <h2>Data Dashboard</h2>
        <div className="scouting-container">
          <div className="form-group">
            <label>Event Code:</label>
            <input
              type="text"
              value={eventCode}
              onChange={handleEventCodeChange}
              placeholder="Enter Event Code"
            />
          </div>
          <div className="form-group">
            <label>Completed Matches:</label>
            <select onChange={handleMatchSelect} disabled={!eventCode}>
              <option value="">Select a Match</option>
              {matchNumbers.map((match) => (
                <option key={match} value={match}>
                  Match {match}
                </option>
              ))}
            </select>
          </div>

          <h3>{selectedMatch ? `Match ${selectedMatch} Robot Analysis` : 'Placeholder Robot Analysis'}</h3>

          <div className="alliance-section">
            <div className="alliance-container red-alliance">
              <h4>Red Alliance</h4>
              <div className="robots-container">
                {redTeams.map((robot) => (
                  <div key={robot.teamNumber} className="robot-card">
                    <h5>{robot.teamNumber}</h5>
                    <p>Average Auto Goals: {robot.autoGoals}</p>
                    <p>Average Tele Goals: {robot.teleGoals}</p>
                    <p>Notes: {robot.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="alliance-container blue-alliance">
              <h4>Blue Alliance</h4>
              <div className="robots-container">
                {blueTeams.map((robot) => (
                  <div key={robot.teamNumber} className="robot-card">
                    <h5>{robot.teamNumber}</h5>
                    <p>Average Auto Goals: {robot.autoGoals}</p>
                    <p>Average Tele Goals: {robot.teleGoals}</p>
                    <p>Notes: {robot.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

