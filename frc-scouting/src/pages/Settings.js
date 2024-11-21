import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../firebase'; // Import your Firebase configuration
import { auth } from '../firebase'; // Import your Firebase Auth configuration
import { onAuthStateChanged } from 'firebase/auth'; // Import Auth state changed method

const Settings = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for authentication status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // User is logged in
      } else {
        setIsLoggedIn(false); // User is logged out
      }
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="frozen-container">
        <div className="main-content">
          <h2>Access Denied</h2>
          <p>You need to be logged in to access this page. Please log in.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="main-content">
        <h2>Settings</h2>
        <p>Here you can adjust preferences.</p>
      </div>
    </div>
  );
};

export default Settings;
