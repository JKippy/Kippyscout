import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Scouting from './pages/Scouting';
import About from './pages/About';
import EventData from './pages/EventData';
import TeamData from './pages/TeamData';
import { authObserver } from "./authService";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Header from "./components/Header";
import Settings from "./pages/Settings";
import PopulateFirestore from "./pages/populateFirestore"
import { EventCodeProvider } from './components/EventCodeContext'; // Import the EventCodeProvider

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
    <EventCodeProvider><Router>
    <Header user={user} />
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scouting" element={<Scouting />} />
        <Route path="/eventdata" element={<EventData />} />
        <Route path="/teamdata" element={<TeamData />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/populateFirestore" element={<PopulateFirestore />} />
      </Routes>
    </div>
  </Router>
  </EventCodeProvider>
  );
};

export default App;

