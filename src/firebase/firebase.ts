// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC4T8crgdKUN4fQ7RvSzL7rO0LA4ighcek",
  authDomain: "onlinevotingsystem-55b00.firebaseapp.com",
  projectId: "onlinevotingsystem-55b00",
  storageBucket: "onlinevotingsystem-55b00.appspot.com",
  messagingSenderId: "528669109838",
  appId: "1:528669109838:web:49977c8ae72933af41dd1f",
  measurementId: "G-NL3XZC5YBB",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export auth and firestore db
export const auth = getAuth(app);
export const db = getFirestore(app);
