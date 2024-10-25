// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
