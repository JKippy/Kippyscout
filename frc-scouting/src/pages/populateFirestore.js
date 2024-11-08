import React from 'react';
import { db } from '../firebase'; // Import the Firestore setup
import { addDoc, collection } from 'firebase/firestore';

const App = () => {
  // Generate some random scouting data
  const generateScoutingData = (teamNumber, matchNumber) => {
    return {
      scouterName: 'scout@scouter.com', // No Auth, so we'll just use a fixed name
      teamNumber: teamNumber,
      matchNumber: matchNumber,
      autoHighGoals: Math.floor(Math.random() * 10), // Random auto high goals
      autoLowGoals: Math.floor(Math.random() * 10),
      teleHighGoals: Math.floor(Math.random() * 30), // Random teleop high goals
      teleLowGoals: Math.floor(Math.random() * 30),
      endgameStatus: ['None', 'Succeeded', 'Failed'][Math.floor(Math.random() * 3)], // Random endgame status
      notes: `Scouted for match ${matchNumber} with team ${teamNumber}`,
    };
  };

const matchSchedule = [
  { matchNumber: 1, red1: 5090, red2: 7221, red3: 7692, blue1: 7553, blue2: 3604, blue3: 4854 },
  { matchNumber: 2, red1: 3414, red2: 2048, red3: 8623, blue1: 5066, blue2: 51, blue3: 8115 },
  { matchNumber: 3, red1: 6152, red2: 4737, red3: 9572, blue1: 6914, blue2: 548, blue3: 9226 },
  { matchNumber: 4, red1: 8427, red2: 5907, red3: 6861, blue1: 9148, blue2: 8179, blue3: 3641 },
  { matchNumber: 5, red1: 6057, red2: 240, red3: 7174, blue1: 66, blue2: 5144, blue3: 5053 },
  { matchNumber: 6, red1: 5197, red2: 1250, red3: 33, blue1: 5843, blue2: 8426, blue3: 3773 },
  { matchNumber: 7, red1: 7191, red2: 2832, red3: 2048, blue1: 8774, blue2: 280, blue3: 3604 },
  { matchNumber: 8, red1: 51, red2: 7553, red3: 6861, blue1: 9226, blue2: 5907, blue3: 7692 },
  { matchNumber: 9, red1: 3641, red2: 7174, red3: 6914, blue1: 9148, blue2: 3414, blue3: 4737 },
  { matchNumber: 10, red1: 5144, red2: 548, red3: 7221, blue1: 33, blue2: 8426, blue3: 8623 },
  { matchNumber: 11, red1: 8774, red2: 5197, red3: 240, blue1: 4854, blue2: 5090, blue3: 8179 },
  { matchNumber: 12, red1: 7191, red2: 3773, red3: 1250, blue1: 8115, blue2: 9572, blue3: 5053 },
  { matchNumber: 13, red1: 8427, red2: 5843, red3: 5066, blue1: 66, blue2: 6057, blue3: 6152 },
  { matchNumber: 14, red1: 2832, red2: 6861, red3: 8426, blue1: 280, blue2: 51, blue3: 7174 },
  { matchNumber: 15, red1: 5197, red2: 9226, red3: 9148, blue1: 2048, blue2: 7221, blue3: 3641 },
  { matchNumber: 16, red1: 8115, red2: 5090, red3: 3773, blue1: 548, blue2: 7553, blue3: 7191 },
  { matchNumber: 17, red1: 7692, red2: 8179, red3: 9572, blue1: 33, blue2: 8427, blue3: 66 },
  { matchNumber: 18, red1: 4737, red2: 2832, red3: 4854, blue1: 8774, blue2: 5144, blue3: 1250 },
  { matchNumber: 19, red1: 6152, red2: 6914, red3: 3604, blue1: 6057, blue2: 8623, blue3: 5907 },
  { matchNumber: 20, red1: 280, red2: 3414, red3: 5066, blue1: 5053, blue2: 240, blue3: 5843 },
  { matchNumber: 21, red1: 7221, red2: 8179, red3: 51, blue1: 7191, blue2: 8115, blue3: 9148 },
  { matchNumber: 22, red1: 33, red2: 7692, red3: 548, blue1: 7174, blue2: 1250, blue3: 4737 },
  { matchNumber: 23, red1: 3604, red2: 6057, red3: 8426, blue1: 6861, blue2: 3641, blue3: 5197 },
  { matchNumber: 24, red1: 3414, red2: 5144, red3: 6914, blue1: 280, blue2: 4854, blue3: 9226 },
  { matchNumber: 25, red1: 5053, red2: 3773, red3: 2832, blue1: 5843, blue2: 8623, blue3: 5090 },
  { matchNumber: 26, red1: 2048, red2: 66, red3: 8774, blue1: 7553, blue2: 6152, blue3: 5907 },
  { matchNumber: 27, red1: 3641, red2: 8427, red3: 240, blue1: 8426, blue2: 9572, blue3: 5066 },
  { matchNumber: 28, red1: 548, red2: 9148, red3: 280, blue1: 6914, blue2: 5197, blue3: 51 },
  { matchNumber: 29, red1: 5144, red2: 8115, red3: 5843, blue1: 6057, blue2: 7692, blue3: 6861 },
  { matchNumber: 30, red1: 5090, red2: 33, red3: 2048, blue1: 66, blue2: 8623, blue3: 7191 },
  { matchNumber: 31, red1: 1250, red2: 4854, red3: 5907, blue1: 2832, blue2: 5066, blue3: 8179 },
  { matchNumber: 32, red1: 9572, red2: 8774, red3: 7553, blue1: 7221, blue2: 6152, blue3: 3414 },
  { matchNumber: 33, red1: 3604, red2: 8427, red3: 7174, blue1: 240, blue2: 3773, blue3: 9226 },
  { matchNumber: 34, red1: 4737, red2: 66, red3: 3641, blue1: 5053, blue2: 7191, blue3: 51 },
  { matchNumber: 35, red1: 548, red2: 5843, red3: 8179, blue1: 5907, blue2: 2048, blue3: 5144 },
  { matchNumber: 36, red1: 8623, red2: 6861, red3: 1250, blue1: 7553, blue2: 5197, blue3: 280 },
  { matchNumber: 37, red1: 9226, red2: 7174, red3: 5066, blue1: 7692, blue2: 6914, blue3: 8774 },
  { matchNumber: 38, red1: 6152, red2: 8426, red3: 5090, blue1: 4737, blue2: 5053, blue3: 8427 },
  { matchNumber: 39, red1: 8115, red2: 6057, red3: 3414, blue1: 4854, blue2: 240, blue3: 33 },
  { matchNumber: 40, red1: 3604, red2: 3773, red3: 7221, blue1: 9148, blue2: 2832, blue3: 9572 },
  { matchNumber: 41, red1: 8623, red2: 7553, red3: 3641, blue1: 5843, blue2: 8774, blue3: 7191 },
  { matchNumber: 42, red1: 8179, red2: 5053, red3: 5907, blue1: 8426, blue2: 7692, blue3: 5197 },
  { matchNumber: 43, red1: 8427, red2: 280, red3: 6152, blue1: 7174, blue2: 8115, blue3: 4854 },
  { matchNumber: 44, red1: 6861, red2: 2048, red3: 9572, blue1: 240, blue2: 6914, blue3: 2832 },
  { matchNumber: 45, red1: 4737, red2: 5066, red3: 5090, blue1: 9148, blue2: 7221, blue3: 6057 },
  { matchNumber: 46, red1: 1250, red2: 3604, red3: 548, blue1: 9226, blue2: 3414, blue3: 66 },
  { matchNumber: 47, red1: 3773, red2: 33, red3: 7553, blue1: 5144, blue2: 51, blue3: 8427 },
  { matchNumber: 48, red1: 5197, red2: 5843, red3: 4854, blue1: 9572, blue2: 7191, blue3: 7174 },
  { matchNumber: 49, red1: 6861, red2: 9148, red3: 240, blue1: 7692, blue2: 4737, blue3: 8623 },
  { matchNumber: 50, red1: 2048, red2: 5053, red3: 9226, blue1: 8426, blue2: 1250, blue3: 7221 },
  { matchNumber: 51, red1: 5066, red2: 33, red3: 5144, blue1: 3604, blue2: 5090, blue3: 51 },
  { matchNumber: 52, red1: 6057, red2: 280, red3: 6914, blue1: 8774, blue2: 8179, blue3: 3773 },
  { matchNumber: 53, red1: 66, red2: 548, red3: 8115, blue1: 2832, blue2: 3641, blue3: 6152 },
  { matchNumber: 54, red1: 5907, red2: 9572, red3: 7221, blue1: 3414, blue2: 7174, blue3: 5843 },
  { matchNumber: 55, red1: 5197, red2: 4737, red3: 5144, blue1: 7553, blue2: 2048, blue3: 8427 },
  { matchNumber: 56, red1: 9226, red2: 7191, red3: 8179, blue1: 3773, blue2: 5066, blue3: 8623 },
  { matchNumber: 57, red1: 6914, red2: 66, red3: 8426, blue1: 8115, blue2: 3604, blue3: 33 },
  { matchNumber: 58, red1: 7692, red2: 51, red3: 3414, blue1: 5090, blue2: 2832, blue3: 6057 },
  { matchNumber: 59, red1: 1250, red2: 240, red3: 280, blue1: 5907, blue2: 3641, blue3: 548 },
  { matchNumber: 60, red1: 6152, red2: 5053, red3: 9148, blue1: 6861, blue2: 4854, blue3: 8774 },
  { matchNumber: 61, red1: 5843, red2: 9226, red3: 3604, blue1: 8179, blue2: 4737, blue3: 8115 },
  { matchNumber: 62, red1: 7174, red2: 5144, red3: 2832, blue1: 7191, blue2: 5066, blue3: 5197 },
  { matchNumber: 63, red1: 5907, red2: 5090, red3: 66, blue1: 9572, blue2: 3641, blue3: 280 },
  { matchNumber: 64, red1: 51, red2: 4854, red3: 6057, blue1: 240, blue2: 8426, blue3: 2048 },
  { matchNumber: 65, red1: 5053, red2: 7221, red3: 7553, blue1: 6914, blue2: 33, blue3: 6861 },
  { matchNumber: 66, red1: 8623, red2: 8774, red3: 9148, blue1: 548, blue2: 8427, blue3: 3414 },
  { matchNumber: 67, red1: 3641, red2: 1250, red3: 7692, blue1: 3773, blue2: 6152, blue3: 5144 },
  { matchNumber: 68, red1: 2048, red2: 5843, red3: 6057, blue1: 9572, blue2: 9226, blue3: 5090 },
  { matchNumber: 69, red1: 240, red2: 66, red3: 3604, blue1: 7221, blue2: 5197, blue3: 8115 },
  { matchNumber: 70, red1: 4854, red2: 6914, red3: 5053, blue1: 51, blue2: 8623, blue3: 548 },
  { matchNumber: 71, red1: 33, red2: 280, red3: 7191, blue1: 5066, blue2: 6152, blue3: 7692 },
  { matchNumber: 72, red1: 3414, red2: 5907, red3: 8774, blue1: 3773, blue2: 6861, blue3: 4737 },
  { matchNumber: 73, red1: 8426, red2: 9148, red3: 8427, blue1: 1250, blue2: 7553, blue3: 2832 },
  { matchNumber: 74, red1: 7174, red2: 548, red3: 5053, blue1: 8179, blue2: 3604, blue3: 2048 },
  { matchNumber: 75, red1: 8623, red2: 8115, red3: 6152, blue1: 5144, blue2: 9572, blue3: 240 },
  { matchNumber: 76, red1: 51, red2: 8774, red3: 4737, blue1: 280, blue2: 7692, blue3: 5843 },
  { matchNumber: 77, red1: 7221, red2: 7191, red3: 6914, blue1: 8427, blue2: 6057, blue3: 1250 },
  { matchNumber: 78, red1: 4854, red2: 9148, red3: 3773, blue1: 5066, blue2: 6861, blue3: 66 },
  { matchNumber: 79, red1: 8179, red2: 7174, red3: 5197, blue1: 5090, blue2: 3414, blue3: 7553 },
  { matchNumber: 80, red1: 3641, red2: 9226, red3: 8426, blue1: 2832, blue2: 5907, blue3: 33 }
];

/// Populate Firestore with match data
const populateFirestore = async () => {
  try {
    const eventCode = 'MILIV'; // Your event code

    // Loop through each match and teams
    for (const match of matchSchedule) {
      const teams = [...[match.red1, match.red2, match.red3], ...[match.blue1, match.blue2, match.blue3]];

      for (let teamNumber of teams) {
        const scoutingData = generateScoutingData(teamNumber, match.matchNumber);

        // Add the scouting data to Firestore
        await addDoc(collection(db, eventCode), scoutingData);

        console.log(`Scouting data added for team ${teamNumber} in match ${match.matchNumber}`);
      }
    }

    console.log('Firestore populated successfully!');
  } catch (error) {
    console.error('Error populating Firestore:', error);
  }
};

return (
  <div>
    <h1>Match Scouting</h1>
    <button onClick={populateFirestore}>Populate Firestore with Match Data</button>
  </div>
);
};

export default App;