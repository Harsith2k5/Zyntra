/* // src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCs9NcsPuMrYC8GG6_qOAHUzVEZQe3gXGs',
  authDomain: 'zyntra-dfb88.firebaseapp.com',
  projectId: 'zyntra-dfb88',
  storageBucket: 'zyntra-dfb88.appspot.com',
  messagingSenderId: '761863681183',
  appId: '1:761863681183:web:e371fb2906edc0a02f9eaa',
  measurementId: 'G-L1YJP72SDQ',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
 */
// src/firebase.ts (This is now your SINGLE, Canonical Firebase config file)

// Import Firebase App functions
import { initializeApp, getApps, getApp } from "firebase/app";

// Import Firestore functions
import { getFirestore, collection, doc } from "firebase/firestore"; // 'doc' is useful for type safety

// Import Realtime Database (if you need it - add this if you're using realtimedb elsewhere)
import { getDatabase } from "firebase/database";

// Import Auth functions
import { getAuth } from "firebase/auth";

// Optional: Import Analytics if you are using it
import { getAnalytics } from "firebase/analytics";


// Your Firebase config for the 'zyntra-dfb88' project
const firebaseConfig = {
  apiKey: 'AIzaSyCs9NcsPuMrYC8GG6_qOAHUzVEZQe3gXGs',
  authDomain: 'zyntra-dfb88.firebaseapp.com',
  projectId: 'zyntra-dfb88',
  storageBucket: 'zyntra-dfb88.appspot.com',
  messagingSenderId: '761863681183',
  appId: '1:761863681183:web:e371fb2906edc0a02f9eaa',
  measurementId: 'G-L1YJP72SDQ',
};

// Initialize Firebase app (only once)
// This guard is essential to prevent duplicate initialization errors
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize and export services for use throughout your app
export const auth = getAuth(app); // For Firebase Authentication
export const db = getFirestore(app); // For Firestore
export const usersCollectionRef = collection(db, "userProfiles"); // For Firestore user profiles collection

// Initialize and export Realtime Database if you use it (if not, you can remove these lines)
export const realtimedb = getDatabase(app);

// Optional: Analytics
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
// You might want to export analytics as well if you use it:
// export { analytics };