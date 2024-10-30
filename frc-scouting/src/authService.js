// src/authService.js
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Sign up
const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in
const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out
const logOut = () => {
  return signOut(auth);
};

// Observer on Auth State Changes
const authObserver = (callback) => {
  onAuthStateChanged(auth, callback);
};

export { signUp, signIn, logOut, authObserver };

