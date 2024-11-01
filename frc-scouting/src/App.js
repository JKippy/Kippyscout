import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Scouting from './pages/Scouting';
import About from './pages/About';
import Matches from './pages/About';
import { authObserver } from "./authService";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Header from "./components/Header";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = authObserver((currentUser) => {
      console.log('Current user:', currentUser); // Log current user for debugging
      setUser(currentUser);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return (
      <Router>
        <Header user={user} />
        <div>
          <h1>FRC Event Data</h1>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scouting" element={<Scouting />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;

