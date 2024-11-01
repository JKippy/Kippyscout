import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Ensure the correct CSS file is imported

const Header = () => {

  return (
    <header className="header">
      <nav className="nav-menu">
        <Link to="/">Home</Link>
        <Link to="/scouting">Scouting</Link>
        <Link to="/matches">Matches</Link>
        <Link to="/dashboard">Drive Team Dashboard</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
};

export default Header;
