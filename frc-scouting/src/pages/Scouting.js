import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0
import Header from '../components/Header';
import './Scouting.css';

const Scouting = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0(); // Destructure necessary functions
  const [matchData, setMatchData] = useState({
    scouterName: '',
    teamNumber: '',
    matchNumber: '',
    autoHighGoals: '',
    autoLowGoals: '',
    teleHighGoals: '',
    teleLowGoals: '',
    endgameStatus: '',
    notes: '',
  });

  // Check if the user is authenticated
  if (!isAuthenticated) {
    loginWithRedirect(); // Redirect to login if not authenticated
    return null; // Prevent rendering while redirecting
  }

  const handleChange = (e) => {
    setMatchData({ ...matchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Match data submitted:', matchData);
    
    try {
      const response = await fetch('http://localhost:5000/api/matchdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data saved successfully:', data);
      // Reset form or provide success message
      setMatchData({
        scouterName: '',
        teamNumber: '',
        matchNumber: '',
        autoHighGoals: '',
        autoLowGoals: '',
        teleHighGoals: '',
        teleLowGoals: '',
        endgameStatus: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error saving match data:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="main-content">
        <h2>Scouting Page</h2>
        <p>Here you can enter match scouting data.</p>
        <div className="scouting-container">
          <form onSubmit={handleSubmit} className="scouting-form">
            <div className="form-group">
              <label>Scouter Name:</label>
              <input
                type="text"
                name="scouterName"
                value={matchData.scouterName}
                onChange={handleChange}
                required
              />
            </div>
            {/* Other form fields here... */}
            <button type="submit" className="submit-button">Submit Match Data</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Scouting;

