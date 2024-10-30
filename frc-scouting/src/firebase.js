// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage"; // Import Storage

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPCI9ALGWqWjlv7s28VtkP-RHx7qP-xA0",
  authDomain: "kippyscout.firebaseapp.com",
  projectId: "kippyscout",
  storageBucket: "kippyscout.appspot.com",
  messagingSenderId: "128392907167",
  appId: "1:128392907167:web:c98ed24b7d24ffaf45d5aa",
  measurementId: "G-BRV9PR959F"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Export authentication instance for use in other files
//export { auth };

