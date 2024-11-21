import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';
import './Header.css';

const Header = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar toggle

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <div className="sidebar-container">
      {/* Button to open and close the sidebar */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? 'Close' : 'Open'} Menu
      </button>

      {/* Sidebar menu */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="nav-menu">
          <Link to="/" onClick={closeSidebar}>Home</Link>
          <Link to="/scouting" onClick={closeSidebar}>Scouting</Link>
          <Link to="/eventdata" onClick={closeSidebar}>Event Data</Link>
          <Link to="/teamdata" onClick={closeSidebar}>Team Data</Link>
          <Link to="/dashboard" onClick={closeSidebar}>Drive Team Dashboard</Link>
          <Link to="/about" onClick={closeSidebar}>About</Link>
          <Link to="/settings" onClick={closeSidebar}>Settings</Link>

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
      </div>

      {/* Optional: Clicking outside the sidebar to close it */}
      {isOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </div>
  );
};

export default Header;
