// src/pages/Home.js
import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the FRC Scouting App</h1>
      <a href="/login">Login</a>
      <a href="/scouting">Start Scouting</a>
      <a href="/matches">View Matches</a>
    </div>
  );
};

export default Home;
