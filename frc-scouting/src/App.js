import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Scouting from './pages/Scouting';
import { SidebarProvider } from './SidebarContext';
import { authObserver, logOut } from "./authService";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Header from "./components/Header";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = authObserver((currentUser) => {
      setUser(currentUser);
    });

    // Only call unsubscribe if it's a function
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  return (
    <SidebarProvider>
      <Router>
        <Header />
        <div>
          <h1>FRC Event Data</h1>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Unrestricted access to Dashboard and Scouting */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scouting" element={<Scouting />} />
            {/* Conditional route to redirect based on user state */}
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp />} />
          </Routes>
        </div>
      </Router>
    </SidebarProvider>
  );
};

export default App;
