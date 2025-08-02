/* // Import Firebase functions
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAapcp1C8mJlfiHwHcdK_ZhEaXViyfR-cg",
  authDomain: "zyntraoffl.firebaseapp.com",
  projectId: "zyntraoffl",
  storageBucket: "zyntraoffl.firebasestorage.app",
  messagingSenderId: "884488612515",
  appId: "1:884488612515:web:0389768ddc907036872d16",
  measurementId: "G-DPQ40M7J3K"
};

// Initialize Firebase app (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const db = getDatabase(app);
 */
// pages/workstation/firebaseConfig.ts
/* 
// Import Firebase App functions
import { initializeApp, getApps, getApp } from "firebase/app";

// Import Firestore functions
import { getFirestore, collection, doc } from "firebase/firestore"; // <-- IMPORTANT: Added getFirestore and collection, doc

// Import Realtime Database (if you still need it for other parts of your app)
import { getDatabase } from "firebase/database"; // Still included if you need Realtime DB elsewhere

// Optional: Import Analytics if you are using it
import { getAnalytics } from "firebase/analytics";


// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAapcp1C8mJlfiHwHcdK_ZhEaXViyfR-cg",
  authDomain: "zyntraoffl.firebaseapp.com",
  projectId: "zyntraoffl",
  storageBucket: "zyntraoffl.firebasestorage.app",
  messagingSenderId: "884488612515",
  appId: "1:884488612515:web:0389768ddc907036872d16",
  measurementId: "G-DPQ40M7J3K"
};

// Initialize Firebase app (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services

// Firestore Database Initialization (Primary for this solution)
export const db = getFirestore(app); // <-- IMPORTANT: Exporting Firestore instance

// Export Firestore collection reference for easier use with user profiles
export const usersCollectionRef = collection(db, "userProfiles"); // <-- IMPORTANT: Collection reference for user profiles

// Realtime Database Initialization (If you still need it)
export const realtimedb = getDatabase(app); // Renamed to avoid conflict with Firestore's 'db'

// Analytics Initialization (Optional)
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
// You might want to export analytics if you use it in other components:
// export { analytics }; */