import React from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';
import './Header.css';

const Header = ({ user }) => {
  return (
    <header className="header">
      <nav className="nav-menu">
        <Link to="/">Home</Link>
        <Link to="/scouting">Scouting</Link>
        <Link to="/eventdata">Event Data</Link>
        <Link to="/dashboard">Drive Team Dashboard</Link>
        <Link to="/about">About</Link>
        <Link to="/settings">Settings</Link>

        {/* Conditional Rendering based on user authentication */}
        {user ? (
          <div>
            <span>Welcome, {user.email}</span> {/* Display username or email */}
            <AuthButton user={user} />
          </div>
        ) : (
          <AuthButton user={user} />
        )}
      </nav>
    </header>
  );
};

export default Header;

