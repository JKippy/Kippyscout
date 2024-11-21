import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Make sure to update this file as well

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [teamNumber, setTeamNumber] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save the FRC team number and other user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        teamNumber: teamNumber,
      });

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
        <div className="signup-header text-center">
          <img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg" alt="Logo" width="75" />
          <h2 className="signup-title">Create an Account</h2>
          <p className="signup-description">Fill in the details below to sign up.</p>
        </div>

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

        <div className="signup-footer">
          <button className="signin-button" onClick={goToSignIn}>Already have an account? Sign In</button>
          <p className="footer-text">or <span className="link" onClick={() => {/* Implement Google signup */}}>Sign up with Google</span></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

