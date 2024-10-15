import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Scouting from './pages/Scouting';
import { SidebarProvider } from './SidebarContext'; // Import the SidebarProvider

const App = () => {
  return (
  <SidebarProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/scouting" element={<Scouting />} />
      </Routes>
    </Router>
  </SidebarProvider>
  );
};

export default App;

