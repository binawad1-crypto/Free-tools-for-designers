import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVH9XoAkufNlI8lFhMcZYs_RsoasKNqL8",
  authDomain: "zimam-97f73.firebaseapp.com",
  databaseURL: "https://zimam-97f73-default-rtdb.firebaseio.com",
  projectId: "zimam-97f73",
  storageBucket: "zimam-97f73.firebasestorage.app",
  messagingSenderId: "337216834884",
  appId: "1:337216834884:web:aa5f90e8dbcef686599b11",
  measurementId: "G-P78YMH6M6F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;