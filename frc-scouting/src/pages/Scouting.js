import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';  // Firestore methods
import { auth, db } from '../firebase';  // Import Firebase authentication and Firestore instance
import { onAuthStateChanged } from 'firebase/auth';  // Firebase Auth state change method

const Scouting = () => {
  const [user, setUser] = useState(null);
  const [eventCode, setEventCode] = useState('');
  const [matchData, setMatchData] = useState({
    scouterName: '',
    teamNumber: '',
    matchNumber: '',
    autoHighGoals: 0,
    autoLowGoals: 0,
    teleHighGoals: 0,
    teleLowGoals: 0,
    endgameStatus: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();  // Unsubscribe when component unmounts
  }, []);

  if (!user) {
    return (
      <div>
        <h2>Please log in to submit scouting data.</h2>
      </div>
    );
  }

  // Form handling functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleIncrement = (field) => {
    setMatchData((prevData) => ({
      ...prevData,
      [field]: prevData[field] + 1,
    }));
  };

  const handleDecrement = (field) => {
    setMatchData((prevData) => ({
      ...prevData,
      [field]: prevData[field] > 0 ? prevData[field] - 1 : 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get reference to Firestore collection using eventCode
      const matchRef = collection(db, eventCode);  // Firestore collection reference

      // Add the new match data to Firestore
      await addDoc(matchRef, {
        ...matchData,
        scouterName: user.email,  // Use the authenticated user's email as scouter name
        timestamp: new Date(),    // Add a timestamp for when the data was submitted
      });

      alert('Data submitted successfully!');
      setIsSubmitting(false);
      setMatchData({
        scouterName: '',
        teamNumber: '',
        matchNumber: '',
        autoHighGoals: 0,
        autoLowGoals: 0,
        teleHighGoals: 0,
        teleLowGoals: 0,
        endgameStatus: '',
        notes: '',
      });
    } catch (error) {
      alert('Error submitting data: ' + error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="main-content">
        <h2>Scouting Page</h2>
        <p>Here you can enter match scouting data.</p>
        <div className="scouting-container">
          <form onSubmit={handleSubmit} className="scouting-form">
            {/* Event Code Input */}
            <div className="form-group">
              <label>Event Code:</label>
              <input
                type="text"
                name="eventCode"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value)} // Update eventCode state
                placeholder="Enter Event Code"
                required
              />
            </div>

            {/* Scouter Name (Email) */}
            <div className="form-group">
              <label>Scouter Name (Email):</label>
              <input
                type="text"
                name="scouterName"
                value={matchData.scouterName || user.email}  // Display user's email as scouter name
                onChange={handleChange}
                disabled  // Disable the scouter name input so the user can't edit it
                required
              />
            </div>

            {/* Team Number */}
            <div className="form-group">
              <label>Team Number:</label>
              <input
                type="number"
                name="teamNumber"
                value={matchData.teamNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Match Number */}
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

            {/* Auto High Goals */}
            <div className="form-group">
              <label>Auto High Goals:</label>
              <div className="input-with-buttons">
                <input
                  type="number"
                  name="autoHighGoals"
                  value={matchData.autoHighGoals}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDecrement('autoHighGoals')}
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => handleIncrement('autoHighGoals')}
                >
                  +
                </button>
              </div>
            </div>

            {/* Auto Low Goals */}
            <div className="form-group">
              <label>Auto Low Goals:</label>
              <div className="input-with-buttons">
                <input
                  type="number"
                  name="autoLowGoals"
                  value={matchData.autoLowGoals}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDecrement('autoLowGoals')}
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => handleIncrement('autoLowGoals')}
                >
                  +
                </button>
              </div>
            </div>

            {/* Tele High Goals */}
            <div className="form-group">
              <label>Tele High Goals:</label>
              <div className="input-with-buttons">
                <input
                  type="number"
                  name="teleHighGoals"
                  value={matchData.teleHighGoals}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDecrement('teleHighGoals')}
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => handleIncrement('teleHighGoals')}
                >
                  +
                </button>
              </div>
            </div>

            {/* Tele Low Goals */}
            <div className="form-group">
              <label>Tele Low Goals:</label>
              <div className="input-with-buttons">
                <input
                  type="number"
                  name="teleLowGoals"
                  value={matchData.teleLowGoals}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDecrement('teleLowGoals')}
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => handleIncrement('teleLowGoals')}
                >
                  +
                </button>
              </div>
            </div>

            {/* Endgame Status */}
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

            {/* Notes */}
            <div className="form-group">
              <label>Notes:</label>
              <textarea
                name="notes"
                value={matchData.notes}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Match Data'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Scouting;
