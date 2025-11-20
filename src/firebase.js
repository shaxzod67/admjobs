// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA86F8pDrWyYXI5A4vBKwgCH3Sf4d19-Yo",
  authDomain: "admjobs-648d2.firebaseapp.com",
  projectId: "admjobs-648d2",
  storageBucket: "admjobs-648d2.firebasestorage.app",
  messagingSenderId: "910722523616",
  appId: "1:910722523616:web:5322d9db126c2e6b624b85",
  measurementId: "G-MFF7H2VBS3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);