import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate for redirection
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Scouting from './pages/Scouting';
import { SidebarProvider } from './SidebarContext'; // Import the SidebarProvider
import { authObserver, logOut } from "./authService";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = authObserver((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  return (
    <SidebarProvider>
      <Router>
        <div>
          <h1>FRC Event Data</h1>
          {user ? (
            <div>
              <p>Welcome, {user.email}</p>
              <button onClick={handleLogout}>Log Out</button>
            </div>
          ) : (
            <div>
              <SignIn />
              <SignUp />
            </div>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Protected Routes */}
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/scouting" element={user ? <Scouting /> : <Navigate to="/login" />} />
            {/* Redirect to login if not authenticated */}
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <SignIn />} />
          </Routes>
        </div>
      </Router>
    </SidebarProvider>
  );
};

export default App;

