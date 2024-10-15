import React from 'react';
import Header from '../components/Header'; // Ensure this is the correct import
import { useAuth0 } from '@auth0/auth0-react';
import '../App.css'; // Ensure the CSS is imported

const Home = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header /> {/* Use the Header component with sidebar */}
      <div className="main-content">
        <h2>Welcome to Kippyscout!</h2>
        {isAuthenticated ? (
          <p>You are logged in!</p>
        ) : (
          <p>Please log in to access the scouting features.</p>
        )}
      </div>
    </div>
  );
};

export default Home;

