import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to Dashboard or another protected route
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header text-center">
          <img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg" alt="Logo" width="75" />
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-description">Please log in to your account.</p>
        </div>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSignIn} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">Log In</button>
        </form>

        <div className="login-footer">
          <button className="signup-button" onClick={goToSignUp}>Sign Up</button>
          <p className="footer-text">or <span className="link" onClick={() => {/* Implement Google login */}}>Log in with Google</span></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

