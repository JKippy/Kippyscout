import React, { useState } from 'react';
import Header from '../components/Header'; // Import the Header component
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
    <div>
      <Header /> {/* Use the Header component */}
      <div className="main-content">
        <h2>Scouting Page</h2>
        <p>Here you can enter match scouting data.</p>
        {<div className="scouting-container">
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
    </div>}
      </div>
    </div>
  );
};

export default Scouting;

