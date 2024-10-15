import React from 'react';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  console.log("isLoading:", isLoading); // Debug line
  console.log("isAuthenticated:", isAuthenticated); // Debug line

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to the FRC Scouting App</h1>
      {isAuthenticated ? (
        <>
          <p>You are logged in!</p>
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

export default Home;

