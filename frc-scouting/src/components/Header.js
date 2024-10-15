import React from 'react';
import { Link } from 'react-router-dom';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';
import { useSidebar } from '../SidebarContext'; // Import the useSidebar hook
import './Header.css'; // Ensure the correct CSS file is imported
import hamburgerIcon from '../assets/hamburger-icon.png'; // Update with your image path

const Header = () => {
  const { isAuthenticated } = useAuth0();
  const { isOpen, toggleSidebar } = useSidebar(); // Use context state

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        <img src={hamburgerIcon} alt="Menu" />
      </button>
      {isOpen && ( // Only render nav and auth buttons if sidebar is open
        <>
          <nav className="nav-menu">
            <Link to="/">Home</Link>
            <Link to="/scouting">Scouting</Link>
            <Link to="/matches">Matches</Link>
            <Link to="/about">About</Link>
          </nav>
          <div className="auth-buttons">
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </div>
        </>
      )}
    </div>
  );
};

export default Header;

