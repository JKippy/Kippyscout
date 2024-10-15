import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Scouting from './pages/Scouting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scouting" element={<Scouting />} />
      </Routes>
    </Router>
  );
}

export default App;

