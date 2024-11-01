import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [teamNumber, setTeamNumber] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to Dashboard or another protected route
    } catch (error) {
      setError('Failed to create an account. Please try again.');
    }
  };

  const goToSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Create an Account</h2>
        <p className="signup-description">Fill in the details below to sign up.</p>

        {error && <p className="signup-error">{error}</p>}

        <form onSubmit={handleSignUp} className="signup-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="signup-input"
            required
          />
          <input
            type="number"
            placeholder="FRC Team Number"
            value={teamNumber}
            onChange={(e) => setTeamNumber(e.target.value)}
            className="signup-input"
            required
          />
          <button type="submit" className="signup-button">Sign Up</button>
        </form>

        <button className="signin-button" onClick={goToSignIn}>Already have an account? Sign In</button>
      </div>
    </div>
  );
};

export default SignUp;
