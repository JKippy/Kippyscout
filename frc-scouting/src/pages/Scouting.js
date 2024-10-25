import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook
import Header from '../components/Header'; // Import the Header component
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../firebase'; // Import your Firebase configuration
import './Scouting.css'; // Import your CSS file

const Scouting = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0(); // Destructure necessary methods
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

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    loginWithRedirect();
    return null; // Prevent rendering the page while redirecting
  }

  const handleChange = (e) => {
    setMatchData({ ...matchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Match data submitted:', matchData);
    
    try {
      // Reference to your Firestore collection
      const matchRef = collection(db, 'matchData');
      await addDoc(matchRef, matchData); // Use addDoc to add data

      console.log('Data saved successfully:', matchData);
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
      <Header /> {/* Use the Header component */}
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
              <label>Auto High Goals:</label>
              <input
                type="number"
                name="autoHighGoals"
                value={matchData.autoHighGoals}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Auto Low Goals:</label>
              <input
                type="number"
                name="autoLowGoals"
                value={matchData.autoLowGoals}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Tele High Goals:</label>
              <input
                type="number"
                name="teleHighGoals"
                value={matchData.teleHighGoals}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Tele Low Goals:</label>
              <input
                type="number"
                name="teleLowGoals"
                value={matchData.teleLowGoals}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Endgame Status:</label>
              <input
                type="text"
                name="endgameStatus"
                value={matchData.endgameStatus}
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
              />
            </div>
            <button type="submit" className="submit-button">Submit Match Data</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Scouting;

