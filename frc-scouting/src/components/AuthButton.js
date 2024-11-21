import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../authService'; // Ensure this imports your logOut function
import { getAuth } from 'firebase/auth';

const AuthButton = ({ user }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
    console.log('User log in');
  };

  const handleSignOut = async () => {
    const auth = getAuth(); // Get the Firebase auth instance
    await logOut(auth); // Pass the auth instance to your logOut function
    console.log('User signed out');
  };

  return (
    <div>
      {user ? (
        <button onClick={handleSignOut}>Log Out</button>
      ) : (
        <button onClick={handleSignIn}>Log In</button>
      )}
    </div>
  );
};

export default AuthButton;

