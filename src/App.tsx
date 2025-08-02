/* import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/ui/Header';
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/Login';
import RoleSelector from './pages/RoleSelector';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import TripPlanner from './pages/TripPlanner';
import SlotBooking from './pages/SlotBooking';
import AdminOverview from './pages/admin/AdminOverview';
import UsageTrends from './pages/admin/UsageTrends';
import Forecast from './pages/admin/Forecast';
import StationManagement from './pages/admin/StationManagement';
import AdminSettings from './pages/admin/AdminSettings';
import Wallet from './pages/Wallet';
import Rewards from './pages/Rewards';
import Support from './pages/Support';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Assistant from './pages/Assistant';
import Dummy from './pages/workstation/Dummy'; // Importing the Dummy component
import QrScannerComponent from './pages/workstation/QrScanner';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0B0B0B] text-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/role-select" element={<RoleSelector />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route 
            path="/dashboard" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Dashboard />
              </motion.div>
            } 
          />
          <Route 
            path="/discover" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Discover />
              </motion.div>
            } 
          />
          <Route 
            path="/planner" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <TripPlanner />
              </motion.div>
            } 
          />
          <Route 
            path="/booking/:stationId?" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <SlotBooking />
              </motion.div>
            } 
          />
          
          <Route 
            path="/admin/overview" 
            element={
              <AdminLayout>
                <AdminOverview />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/usage" 
            element={
              <AdminLayout>
                <UsageTrends />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/forecast" 
            element={
              <AdminLayout>
                <Forecast />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/stations" 
            element={
              <AdminLayout>
                <StationManagement />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            } 
          />
          
          <Route 
            path="/wallet" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Wallet />
              </motion.div>
            } 
          />
          <Route 
            path="/rewards" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Rewards />
              </motion.div>
            } 
          />
          <Route 
            path="/support" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Support />
              </motion.div>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Notifications />
              </motion.div>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Profile />
              </motion.div>
            } 
          />
          <Route 
            path="/workstation/dummy" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Dummy />
              </motion.div>
            } 
          />
          <Route 
            path="/workstation/QrScanner" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <QrScannerComponent />
              </motion.div>
            } 
          />
          <Route path="/analytics" element={<div className="pt-20 text-center text-white">Analytics Page - Coming Soon</div>} />
        </Routes>
        
        <Assistant />
      </div>
    </Router>
  );
}

export default App; */
/* import React, { useState, useCallback } from 'react'; // Import useState and useCallback
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/ui/Header';
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/Login';
import RoleSelector from './pages/RoleSelector';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import TripPlanner from './pages/TripPlanner';
import SlotBooking from './pages/SlotBooking';
import AdminOverview from './pages/admin/AdminOverview';
import UsageTrends from './pages/admin/UsageTrends';
import Forecast from './pages/admin/Forecast';
import StationManagement from './pages/admin/StationManagement';
import AdminSettings from './pages/admin/AdminSettings';
import Wallet from './pages/Wallet';
import Rewards from './pages/Rewards';
import Support from './pages/Support';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Assistant from './pages/Assistant';
import Dummy from './pages/workstation/Dummy'; // Importing the Dummy component
import QrScannerComponent from './pages/workstation/QrScanner'; // Correct import path
import UserSpecific from './pages/workstation/UserSpecific'; // Importing the UserSpecific component
function App() {
  // --- STATE AND HANDLERS FOR QR SCANNER ---
  // These need to live in App.tsx (or a parent of the Routes)
  // because the QrScannerComponent needs them as props.
  const [scannedQrData, setScannedQrData] = useState<string | null>(null);
  const [qrScanError, setQrScanError] = useState<string | null>(null);
   const userData = {
    userName: "Alice Smith",
    evName: "Nissan Leaf 2023",
    batteryRemaining: 78,
    greenCredits: 345,
  };
  const handleQrScanSuccess = useCallback((data: string) => {
    console.log('QR Code Scanned Successfully:', data);
    setScannedQrData(data);
    setQrScanError(null); // Clear any previous errors
    // TODO: Add your logic here after a successful scan.
    // This is where you'd typically send data to a server, update user state,
    // or navigate to a new page using `useNavigate()` (if imported from react-router-dom).
    // Example: navigate('/workstation/charge-start', { state: { qrCode: data } });
  }, []);

  const handleQrScanError = useCallback((error: string | Error) => {
    console.error('QR Scanner Component Error (scan):', error);
    setQrScanError(`Scanning error: ${error instanceof Error ? error.message : String(error)}`);
    // TODO: Display a user-friendly error message on the UI
  }, []);

  const handleCameraError = useCallback((error: unknown) => {
    console.error('QR Scanner Component Error (camera):', error);
    setQrScanError(`Camera access denied or error: ${error instanceof Error ? error.message : String(error)}. Please check permissions.`);
    // TODO: Prompt the user to enable camera permissions
  }, []);
  // --- END STATE AND HANDLERS ---


  return (
    <Router>
      <div className="min-h-screen bg-[#0B0B0B] text-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/role-select" element={<RoleSelector />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route 
            path="/dashboard" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Dashboard />
              </motion.div>
            } 
          />
          <Route 
            path="/discover" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Discover />
              </motion.div>
            } 
          />
          <Route 
            path="/planner" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <TripPlanner />
              </motion.div>
            } 
          />
          <Route 
            path="/booking/:stationId?" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <SlotBooking />
              </motion.div>
            } 
          />
          
          <Route 
            path="/admin/overview" 
            element={
              <AdminLayout>
                <AdminOverview />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/usage" 
            element={
              <AdminLayout>
                <UsageTrends />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/forecast" 
            element={
              <AdminLayout>
                <Forecast />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/stations" 
            element={
              <AdminLayout>
                <StationManagement />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            } 
          />
          
          <Route 
            path="/wallet" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Wallet />
              </motion.div>
            } 
          />
          <Route 
            path="/rewards" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Rewards />
              </motion.div>
            } 
          />
          <Route 
            path="/support" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Support />
              </motion.div>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Notifications />
              </motion.div>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Header />
                <Profile />
              </motion.div>
            } 
          />
          <Route 
            path="/workstation/dummy" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Dummy />
              </motion.div>
            } 
          />
<Route
        path="/workstation/userspecific"
        element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <UserSpecific
              userName={userData.userName}
              evName={userData.evName}
              batteryRemaining={userData.batteryRemaining}
              greenCredits={userData.greenCredits}
            />
          </motion.div>
        }
      />
          <Route
            path="/workstation/QrScanner"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                // Added inline styles for the page container to ensure scanner is visible
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '100vh', // Make sure it takes full viewport height
                  backgroundColor: '#0B0B0B', // Matching your app's background
                  padding: '20px',
                  boxSizing: 'border-box'
                }}
              >
                <QrScannerComponent
                  onScanSuccess={handleQrScanSuccess}
                  onScanError={handleQrScanError}
                  onCameraError={handleCameraError}
                  showScanner={true} // It should be active when this route is rendered
                />
                {scannedQrData && (
                  <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#00f0b0', color: '#1A1A2E', borderRadius: '8px', boxShadow: '0 0 15px rgba(0,240,176,0.5)', textAlign: 'center' }}>
                    Successfully Scanned: <strong>{scannedQrData}</strong>
                  </div>
                )}
                {qrScanError && (
                  <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ff4d4d', color: 'white', borderRadius: '8px', boxShadow: '0 0 15px rgba(255,77,77,0.5)', textAlign: 'center' }}>
                    Error: {qrScanError}
                  </div>
                )}
              </motion.div>
            }
          />
          <Route path="/analytics" element={<div className="pt-20 text-center text-white">Analytics Page - Coming Soon</div>} />
        </Routes>
        
        <Assistant />
      </div>
    </Router>
  );
}

export default App; */
/* import React, { useState, useCallback, useEffect } from 'react'; // Import useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Firebase Imports ---
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, usersCollectionRef } from './firebase'; // Corrected import path
import { onAuthStateChanged } from 'firebase/auth';
// --- UI Components ---
import Header from './components/ui/Header';
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/Login';
import RoleSelector from './pages/RoleSelector';
import Onboarding from './pages/Onboarding';
//import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import TripPlanner from './pages/TripPlanner';
import SlotBooking from './pages/SlotBooking';
import AdminOverview from './pages/admin/AdminOverview';
import UsageTrends from './pages/admin/UsageTrends';
import Forecast from './pages/admin/Forecast';
import StationManagement from './pages/admin/StationManagement';
import AdminSettings from './pages/admin/AdminSettings';
import Wallet from './pages/Wallet';
import Rewards from './pages/Rewards';
import Support from './pages/Support';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Assistant from './pages/Assistant';
import Dummy from './pages/workstation/Dummy';
import QrScannerComponent from './pages/workstation/QrScanner';
import UserSpecific from './pages/workstation/UserSpecific';
import RazorpayButton from './pages/Payment';
 */
// --- Define the shape of data expected from Firestore ---
/* interface UserProfileData {
  id?: string; // Firestore document ID, optional as it's often implicit
  name: string;
  evName: string;
  batteryRemaining: number;
  greenCredits: number;
  lastUpdated?: Date; // Firestore Timestamp will be converted to Date
}

function App() {
  // --- STATE AND HANDLERS FOR QR SCANNER ---
  const [scannedQrData, setScannedQrData] = useState<string | null>(null);
  const [qrScanError, setQrScanError] = useState<string | null>(null);

  const handleQrScanSuccess = useCallback((data: string) => {
    console.log('QR Code Scanned Successfully:', data);
    setScannedQrData(data);
    setQrScanError(null);
  }, []);

  const handleQrScanError = useCallback((error: string | Error) => {
    console.error('QR Scanner Component Error (scan):', error);
    setQrScanError(`Scanning error: ${error instanceof Error ? error.message : String(error)}`);
  }, []);

  const handleCameraError = useCallback((error: unknown) => {
    console.error('QR Scanner Component Error (camera):', error);
    setQrScanError(`Camera access denied or error: ${error instanceof Error ? error.message : String(error)}. Please check permissions.`);
  }, []);
  // --- END STATE AND HANDLERS FOR QR SCANNER ---


  // --- FIRESTORE USER DATA MANAGEMENT ---
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // IMPORTANT: This is a dummy user ID for demonstration.
  // In a real app, you would get this from Firebase Authentication (e.g., `auth().currentUser.uid`)
  const DUMMY_USER_ID = "arjun_kumar_demo_user_july2025"; // Use a consistent ID

  // Real-time listener for user data from Firestore
  useEffect(() => {
    if (!DUMMY_USER_ID) {
      setError("No user ID provided for fetching data.");
      setLoading(false);
      return;
    }

    const userDocRef = doc(usersCollectionRef, DUMMY_USER_ID);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          id: docSnap.id,
          name: data.name,
          evName: data.evName,
          batteryRemaining: data.batteryRemaining,
          greenCredits: data.greenCredits,
          lastUpdated: data.lastUpdated?.toDate(), // Convert Firestore Timestamp to Date
        });
        setLoading(false);
        setError(null); // Clear any previous errors
      } else {
        console.log("No such user document! Creating a new one for demo...");
        createNewUserForDemo(DUMMY_USER_ID);
      }
    }, (err) => {
      console.error("Error fetching user document:", err);
      setError(`Failed to load user data: ${err.message}`);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [DUMMY_USER_ID]);

  // Function to create a new user profile in Firestore (if it doesn't exist)
  const createNewUserForDemo = async (userId: string) => {
    try {
      const initialData: UserProfileData = {
        name: "Arjun Kumar", // Default name
        evName: "Tata Nexon EV Max", // Default EV
        batteryRemaining: 45,
        greenCredits: 875.5,
        lastUpdated: new Date()
      };
      await setDoc(doc(usersCollectionRef, userId), initialData);
      console.log("New user profile created in Firestore for ID:", userId);
      // setUserData will be updated by the onSnapshot listener after creation
    } catch (e: any) {
      console.error("Error creating new user profile:", e);
      setError("Failed to create initial user profile: " + e.message);
    }
  };

  // Function to update user data in Firestore, called from UserSpecific
  const updateUserProfileInFirestore = async (userId: string, updates: Partial<UserProfileData>) => {
    try {
      const userDocRef = doc(usersCollectionRef, userId);
      await updateDoc(userDocRef, {
        ...updates,
        lastUpdated: new Date(), // Update timestamp
      });
      // console.log(`User ${userId} updated in Firestore.`); // Optional log
    } catch (e: any) {
      console.error("Error updating user profile:", e);
      // Handle error in UI if needed
    }
  };
  // --- END FIRESTORE USER DATA MANAGEMENT ---


  // Static data for UserSpecific component (not from DB directly)
  const chargingRateKW = 30;
  const costPerKWh = 16.5; // Cost in INR
  const stationAmenities = ['WiFi', 'Coffee Shop', 'Restroom', 'Snack Vending', 'Lounge Area'];
  const nearestStationName = 'Zyntra Charging Hub - Race Course Rd, Coimbatore';


  // --- Render Loading/Error States for UserSpecific Route ---
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1A1A2E', color: '#E0E0E0' }}>
        Loading user data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1A1A2E', color: '#DC3545' }}>
        Error: {error}
      </div>
    );
  }

  // If userData is null after loading (e.g., creation failed, or no user ID),
  // you might want a different message or action, or redirect.
  if (!userData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1A1A2E', color: '#FFC107' }}>
        No user data available after loading. Please check Firebase setup or user ID.
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0B0B0B] text-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/role-select" element={<RoleSelector />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header /><Dashboard /></motion.div>} />
          <Route path="/discover" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header /><Discover /></motion.div>} />
          <Route path="/planner" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header /><TripPlanner /></motion.div>} />
          <Route path="/booking/:stationId?" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header /><SlotBooking /></motion.div>} />
          <Route path="/wallet" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header /><Wallet /></motion.div>} />
          <Route path="/rewards" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header /><Rewards /></motion.div>} />
          <Route path="/support" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header /><Support /></motion.div>} />
          <Route path="/notifications" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header /><Notifications /></motion.div>} />
          <Route path="/profile" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header /><Profile /></motion.div>} />

          <Route path="/admin/overview" element={<AdminLayout><AdminOverview /></AdminLayout>} />
          <Route path="/admin/usage" element={<AdminLayout><UsageTrends /></AdminLayout>} />
          <Route path="/admin/forecast" element={<AdminLayout><Forecast /></AdminLayout>} />
          <Route path="/admin/stations" element={<AdminLayout><StationManagement /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

          <Route path="/workstation/dummy" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Dummy /></motion.div>} />

          <Route
            path="/workstation/userspecific"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <UserSpecific
                  userName={userData.name}
                  evName={userData.evName}
                  batteryRemaining={userData.batteryRemaining}
                  greenCredits={userData.greenCredits}
                  chargingRateKW={chargingRateKW} // Pass static rates
                  costPerKWh={costPerKWh}       // Pass static cost
                  stationAmenities={stationAmenities} // Pass static amenities
                  nearestStationName={nearestStationName} // Pass static name
                  // This is the key prop to send updates back to App.tsx
                  onDataUpdate={(battery:any, credits:any) => {
                    updateUserProfileInFirestore(DUMMY_USER_ID, {
                      batteryRemaining: battery,
                      greenCredits: credits,
                    });
                  }}
                />
              </motion.div>
            }
          />

          <Route
            path="/workstation/QrScanner"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '100vh',
                  backgroundColor: '#0B0B0B',
                  padding: '20px',
                  boxSizing: 'border-box'
                }}
              >
                <QrScannerComponent
                  onScanSuccess={handleQrScanSuccess}
                  onScanError={handleQrScanError}
                  onCameraError={handleCameraError}
                  showScanner={true}
                />
                {scannedQrData && (
                  <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#00f0b0', color: '#1A1A2E', borderRadius: '8px', boxShadow: '0 0 15px rgba(0,240,176,0.5)', textAlign: 'center' }}>
                    Successfully Scanned: <strong>{scannedQrData}</strong>
                  </div>
                )}
                {qrScanError && (
                  <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ff4d4d', color: 'white', borderRadius: '8px', boxShadow: '0 0 15px rgba(255,77,77,0.5)', textAlign: 'center' }}>
                    Error: {qrScanError}
                  </div>
                )}
              </motion.div>
            }
          />
          <Route path="/analytics" element={<div className="pt-20 text-center text-white">Analytics Page - Coming Soon</div>} />
        </Routes>

        <Assistant />
      </div> 
    </Router>
  );
}

export default App; */

// src/App.tsx
// App.tsx
// App.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Ensure Outlet is imported here
import { motion } from 'framer-motion';

// --- Firebase Imports ---
import { doc, setDoc, updateDoc, onSnapshot, DocumentData } from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';

// --- UI Components (ensure these paths are correct in your project) ---
import Header from './components/ui/Header';
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/Login';
import RoleSelector from './pages/RoleSelector';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import TripPlanner from './pages/TripPlanner';
import SlotBooking from './pages/SlotBooking';
import AdminOverview from './pages/admin/AdminOverview';
import UsageTrends from './pages/admin/UsageTrends';
import Forecast from './pages/admin/Forecast';
import StationManagement from './pages/admin/StationManagement';
import AdminSettings from './pages/admin/AdminSettings';
import Wallet from './pages/Wallet';
import Rewards from './pages/Rewards';
import Support from './pages/Support';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Assistant from './pages/Assistant';
import Dummy from './pages/workstation/Dummy';
import QrScannerComponent from './pages/workstation/QrScanner';
import UserSpecific from './pages/workstation/UserSpecific';
import RazorpayButton from './pages/Payment';
import VirtualQueue from './pages/admin/VirtualQueue';
import ZyntraApp from './pages/admin/Verification';
import StationSpecific from './pages/workstation/StationSpecific';
// --- Define the shape of data expected for user profile (Shared Interface) ---
export interface UserProfileData {
  id?: string;
  name: string;
  evName: string;
  evModel: string;
  batteryRemaining: number;
  greenCredits: number;
  walletBalance: number;
  lastUpdated?: Date;
  profilePictureUrl?: string;
  emailVerified?: boolean;
}

function App() {
  const [scannedQrData, setScannedQrData] = useState<string | null>(null);
  const [qrScanError, setQrScanError] = useState<string | null>(null);

  const handleQrScanSuccess = useCallback((data: string) => {
    console.log('QR Code Scanned Successfully:', data);
    setScannedQrData(data);
    setQrScanError(null);
  }, []);

  const handleQrScanError = useCallback((error: string | Error) => {
    console.error('QR Scanner Component Error (scan):', error);
    setQrScanError(`Scanning error: ${error instanceof Error ? error.message : String(error)}`);
  }, []);

  const handleCameraError = useCallback((error: unknown) => {
    console.error('QR Scanner Component Error (camera):', error);
    setQrScanError(`Camera access denied or error: ${error instanceof Error ? error.message : String(error)}. Please check permissions.`);
  }, []);

  const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("App useEffect (Auth/Firestore) started.");
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      console.log("onAuthStateChanged fired. Auth User:", authUser ? authUser.uid : "null");
      setLoading(true); // Always start loading when auth state changes

      if (authUser) {
        try {
          // Attempt to reload to get the latest emailVerified status
          await authUser.reload();
          setCurrentUser(authUser); // Update with reloaded user
        } catch (reloadError) {
          console.error("Error reloading user:", reloadError);
          // If reload fails, proceed with existing authUser (might be stale)
          setCurrentUser(authUser);
        }

        if (authUser.emailVerified) {
          const userDocRef = doc(db, 'userProfiles', authUser.uid);
          console.log(`Listening for user profile document for UID: ${authUser.uid}`);

          const unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as DocumentData;
              setUserData({
                id: docSnap.id,
                name: data.name || 'User',
                evName: data.evName || 'N/A',
                evModel: data.evModel || 'N/A',
                batteryRemaining: data.batteryRemaining || 0,
                greenCredits: data.greenCredits || 0,
                walletBalance: data.walletBalance || 0,
lastUpdated: data.lastUpdated ? (data.lastUpdated.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)) : new Date(),
                profilePictureUrl: data.profilePictureUrl || undefined,
                emailVerified: true,
              } as UserProfileData);
              setError(null);
              console.log("User profile data loaded successfully:", docSnap.data());
            } else {
              console.warn(`User profile document does not exist for UID: ${authUser.uid}. User needs to complete onboarding/profile.`);
              setUserData(null);
            }
            setLoading(false); // Set loading false after Firestore data attempt
          }, (err) => {
            console.error("Error fetching user profile from Firestore:", err);
            setError(`Failed to load user data: ${err.message}`);
            setLoading(false);
            setUserData(null);
          });

          return () => {
            console.log("Cleaning up Firestore listener.");
            unsubscribeFirestore();
          };
        } else {
          console.log("User is authenticated but email not verified. Clearing user data.");
          setUserData(null);
          setLoading(false);
          setError(null);
        }
      } else {
        console.log("No user logged in, finished loading.");
        setCurrentUser(null);
        setUserData(null);
        setLoading(false);
        setError(null);
      }
    });

    return () => {
      console.log("Cleaning up Auth listener.");
      unsubscribeAuth();
    };
  }, []);

  const updateUserProfileInFirestore = async (userId: string | undefined, updates: Partial<UserProfileData>) => {
    if (!userId) {
      console.error("Cannot update profile: User ID is undefined.");
      return;
    }
    try {
      const userDocRef = doc(db, 'userProfiles', userId);
      await updateDoc(userDocRef, {
        ...updates,
        lastUpdated: new Date(),
      });
      console.log(`User ${userId} updated in Firestore.`);
    } catch (e: any) {
      console.error("Error updating user profile:", e);
    }
  };

  const chargingRateKW = 30;
  const costPerKWh = 16.5;
  const stationAmenities = ['WiFi', 'Coffee Shop', 'Restroom', 'Snack Vending', 'Lounge Area'];
  const nearestStationName = 'Zyntra Charging Hub - Race Course Rd, Coimbatore';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-semibold"
        >
          Loading application data...
        </motion.div>
      </div>
    );
  }

  const isAuthenticated = !!currentUser;
  const isEmailVerified = currentUser?.emailVerified || false;
  const hasProfileData = userData !== null;

  // This flag determines if the user is fully ready for the main app dashboard and protected routes
  const isUserFullyReady = isAuthenticated && isEmailVerified && hasProfileData;

  // Inline component for protected routes (similar to PrivateRoute concept, but directly in App.tsx)
  const ProtectedRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isUserFullyReady) {
      return <>{children}</>;
    } else if (isAuthenticated && isEmailVerified && !hasProfileData) {
      // User is logged in and verified, but profile data is missing (needs onboarding)
      return <Navigate to="/onboarding" replace />;
    } else if (isAuthenticated && !isEmailVerified) {
      // User is logged in but email is not verified
      // IMPORTANT: Login component should handle sending verification and signing out unverified users.
      // This redirect ensures they stay on login or are sent back there until verified.
      return <Navigate to="/login" replace />;
    } else {
      // Not authenticated at all
      return <Navigate to="/login" replace />;
    }
  };


  return (
    <Router>
      <div className="min-h-screen bg-[#0B0B0B] text-white">
        <Routes>
          {/* Public routes */}
          <Route path="/virtual-queue" element={<VirtualQueue />} />
          <Route
            path="/login"
            element={isUserFullyReady ? <Navigate to="/dashboard" replace /> : <Login />}
          />

          <Route
            path="/role-select"
            element={
              isAuthenticated && isEmailVerified 
                ? <RoleSelector />  // <-- Only allow if verified
                : <Navigate to="/login" replace />  // <-- Otherwise kick back to login
            }
          />

          <Route
            path="/onboarding"
            element={
              isAuthenticated && isEmailVerified && !hasProfileData
                ? <Onboarding />
                : isUserFullyReady
                  ? <Navigate to="/dashboard" replace />
                  : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/"
            element={
              isUserFullyReady
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/login" replace />
            }
          />

          <Route element={<ProtectedRouteGuard><Outlet /></ProtectedRouteGuard>}>
            {/* Main App Routes */}
            <Route path="/dashboard" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header currentUser={currentUser} userData={userData!} /><Dashboard userData={userData!} /></motion.div>} />
            <Route path="/discover" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header currentUser={currentUser} userData={userData!} /><Discover /></motion.div>} />
            <Route path="/planner" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header currentUser={currentUser} userData={userData!} /><TripPlanner /></motion.div>} />
            <Route path="/booking/:stationId?" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header currentUser={currentUser} userData={userData!} /><SlotBooking /></motion.div>} />
             <Route path="/book/:stationId" element={<SlotBooking />} />
             
            <Route 
              path="/wallet" 
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <Header currentUser={currentUser} userData={userData!} />
                  <Wallet userData={userData!} />
                </motion.div>
              } 
            />
            <Route path="/rewards" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header currentUser={currentUser} userData={userData!} /><Rewards /></motion.div>} />
            <Route path="/support" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header currentUser={currentUser} userData={userData!} /><Support /></motion.div>} />
            <Route path="/notifications" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header currentUser={currentUser} userData={userData!} /><Notifications /></motion.div>} />
            <Route path="/profile" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header currentUser={currentUser} userData={userData!} /><Profile /></motion.div>} />
            <Route path="/analytics" element={<div className="pt-20 text-center text-white">Analytics Page - Coming Soon</div>} />
            <Route path="/payment" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Header currentUser={currentUser} userData={userData!} /><RazorpayButton /></motion.div>} />

            <Route path="/admin/overview" element={<AdminLayout><AdminOverview /></AdminLayout>} />
            <Route path="/admin/usage" element={<AdminLayout><UsageTrends /></AdminLayout>} />
            <Route path="/admin/forecast" element={<AdminLayout><Forecast /></AdminLayout>} />
            <Route path="/admin/stations" element={<AdminLayout><StationManagement /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

            <Route path="/workstation/dummy" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Dummy /></motion.div>} />

<Route path="/workstation/userspecific/:uid" element={<UserSpecific />} />
<Route path="/workstation/stationspecific" element={<StationSpecific />} />

<Route path="/admin/verification" element={<AdminLayout><ZyntraApp /></AdminLayout>} />


            <Route
              path="/workstation/QrScanner"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#0B0B0B',
                    padding: '20px',
                    boxSizing: 'border-box'
                  }}
                >
                  <QrScannerComponent
                    onScanSuccess={handleQrScanSuccess}
                    onScanError={handleQrScanError}
                    onCameraError={handleCameraError}
                    showScanner={true}
                  />
                  {scannedQrData && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#00f0b0', color: '#1A1A2E', borderRadius: '8px', boxShadow: '0 0 15px rgba(0,240,176,0.5)', textAlign: 'center' }}>
                      Successfully Scanned: <strong>{scannedQrData}</strong>
                    </div>
                  )}
                  {qrScanError && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ff4d4d', color: 'white', borderRadius: '8px', boxShadow: '0 0 15px rgba(255,77,77,0.5)', textAlign: 'center' }}>
                      Error: {qrScanError}
                    </div>
                  )}
                </motion.div>
              }
            />
          </Route>

          <Route
            path="*"
            element={
              isUserFullyReady
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>

        <Assistant />
      </div> 
    </Router>
  );
}

export default App;