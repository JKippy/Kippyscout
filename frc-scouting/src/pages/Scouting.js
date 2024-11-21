import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { collection, addDoc } from 'firebase/firestore';  // Firestore methods
import { auth, db } from '../firebase';  // Import Firebase authentication and Firestore instance
import { onAuthStateChanged } from 'firebase/auth';  // Firebase Auth state change method
import './Scouting.css'; // Ensure the CSS is imported
import { useEventCode } from '../components/EventCodeContext'; // Import the custom hook

const Scouting = () => {
  // Access eventCode and updateEventCode from the context
  const { eventCode, updateEventCode } = useEventCode(); // This will now work
  const [user, setUser] = useState(null);
  //const [eventCode, setEventCode] = useState('');
  const [matchData, setMatchData] = useState({
    scouterName: '',
    teamNumber: '',
    matchNumber: '',
    driverStation: '',
    autoHighGoals: 0,
    autoLowGoals: 0,
    teleHighGoals: 0,
    teleLowGoals: 0,
    endgameStatus: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);  // Store the schedule data fetched from the API

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();  // Unsubscribe when component unmounts
  }, []);

  // Fetch schedule data when eventCode or matchNumber changes
  useEffect(() => {
    if (eventCode && matchData.matchNumber) {
      const fetchSchedule = async () => {
        try {
          const apiKey = process.env.REACT_APP_API_KEY;
          const response = await axios.get(
            `https://cors-anywhere.herokuapp.com/https://frc-api.firstinspires.org/v3.0/2024/schedule/${eventCode}?tournamentLevel=Qualification`, {
              headers: {
                'Authorization': `Basic ${apiKey}`,
              }
            }
          );
          setScheduleData(response.data.Schedule);
        } catch (error) {
          console.error('Error fetching schedule:', error);
        }
      };

      fetchSchedule();
    }
  }, [eventCode, matchData.matchNumber]);

  // Automatically fill in team number based on driver station and match number
  useEffect(() => {
    if (scheduleData.length > 0 && matchData.matchNumber && matchData.driverStation) {
      const match = scheduleData.find(m => m.matchNumber === parseInt(matchData.matchNumber));
      if (match) {
        const team = match.teams.find(team => team.station === matchData.driverStation);
        if (team) {
          setMatchData(prevData => ({
            ...prevData,
            teamNumber: team.teamNumber
          }));
        }
      }
    }
  }, [scheduleData, matchData.matchNumber, matchData.driverStation]);

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
        matchNumber: '',
        driverStation: '',
        teamNumber: '',
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

  // Handle event code change
  const handleEventCodeChange = (e) => {
    const newEventCode = e.target.value;
    updateEventCode(newEventCode); // Now works, update eventCode in context
  };

  return (
    <div>
      <div className="scouting">
        <h2>Scouting Entry</h2>
        <div className="scouting-container">
          <form onSubmit={handleSubmit} className="scouting-form">
            {/* Event Code Input */}
            <div className="form-group">
              <label>Event Code:</label>
                <input
                id="eventCode"
                type="text"
                value={eventCode}
                onChange={handleEventCodeChange}
                placeholder="e.g., MIMIL"
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

            {/* Match Number */}
            <div className="form-group">
              <label>Match:</label>
              <div className="input-with-buttons">
                <input
                  type="number"
                  name="matchNumber"
                  value={matchData.matchNumber}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDecrement('matchNumber')}
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => handleIncrement('matchNumber')}
                >
                  +
                </button>
              </div>
            </div>

            {/* Driver Station */}
            <div className="form-group">
              <label>Driver Station:</label>
              <select
                name="driverStation"
                value={matchData.driverStation}
                onChange={handleChange}
                required
              >
                <option value="">Select Team</option>
                <option value="Red1">Red 1</option>
                <option value="Red2">Red 2</option>
                <option value="Red3">Red 3</option>
                <option value="Blue1">Blue 1</option>
                <option value="Blue2">Blue 2</option>
                <option value="Blue3">Blue 3</option>
              </select>
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
              <select
                name="endgameStatus"
                value={matchData.endgameStatus}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Success">Success</option>
                <option value="Fail">Fail</option>
                <option value="No Attempt">No Attempt</option>
              </select>
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
            <div className="form-group">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Scouting;
