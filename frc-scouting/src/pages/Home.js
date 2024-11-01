import React from 'react';
import Header from '../components/Header'; // Ensure this is the correct import
import '../App.css'; // Ensure the CSS is imported

const Home = () => {

  return (
    <div>
      <Header /> {/* Use the Header component with sidebar */}
      <div className="main-content">
        <h2>Welcome to Kippyscout!</h2>
      </div>
    </div>
  );
};

export default Home;

