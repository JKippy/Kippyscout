import React, { useState } from 'react';
import './Scouting.css'; // Import your CSS file

const Scouting = () => {
  const [matchData, setMatchData] = useState({
    teamNumber: '',
    matchNumber: '',
    notes: '',
  });

  const handleChange = (e) => {
    setMatchData({ ...matchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Match data submitted:', matchData);
    // Add code to save match data to Firestore
  };

  return (
    <div className="scouting-container">
      <h2>Scouting Form</h2>
      <form onSubmit={handleSubmit} className="scouting-form">
        <div className="form-group">
          <label>Team Number:</label>
          <input
            type="text"
            name="teamNumber"
            value={matchData.teamNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Match Number:</label>
          <input
            type="text"
            name="matchNumber"
            value={matchData.matchNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Notes:</label>
          <textarea
            name="notes"
            value={matchData.notes}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">Submit Match Data</button>
      </form>
    </div>
  );
};

export default Scouting;

