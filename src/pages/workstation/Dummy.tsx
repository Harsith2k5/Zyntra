/* import React, { useState } from 'react'; // Import useState
import styles from './Dymmy.module.css'; // Import CSS module

const Dummy: React.FC = () => {
    // State for QR code modal visibility
    const [showQrCode, setShowQrCode] = useState(false);

    // Dummy Data
    const stationName = "Zyntra";
    const chargerStatus = { // Keeping this data for other potential uses, though not displayed directly
        available: 3,
        total: 4,
        occupied: 1,
    };
    const currentQueue = [
        { user: "User A", timeRemaining: "2 mins remaining" },
        { user: "User B", status: "next" },
        { user: "User C", status: "in queue" },
        { user: "User D", status: "in queue" },
        { user: "User E", status: "in queue" },
        { user: "User F", status: "in queue" },
        { user: "User G", status: "in queue" },
        { user: "User H", status: "in queue" },
        { user: "User I", status: "in queue" },
        { user: "User J", status: "in queue" },
        { user: "User K", status: "in queue" },
        { user: "User L", status: "in queue" },
        { user: "User M", status: "in queue" },
        { user: "User N", status: "in queue" },
    ];
    const upcomingBookings = [
        { time: "12:30 PM", status: "Reserved" },
        { time: "01:00 PM", status: "Available" },
        { time: "01:30 PM", status: "Available" },
        { time: "02:00 PM", status: "Reserved" },
        { time: "02:30 PM", status: "Available" },
        { time: "03:00 PM", status: "Available" },
        { time: "03:30 PM", status: "Reserved" },
        { time: "04:00 PM", status: "Available" },
        { time: "04:30 PM", status: "Available" },
    ];
    const powerStats = {
        currentLoad: "18.3kW",
        peakRate: "₹12/unit",
    };
    const nearbyStations = [
        { name: "EVPoint", distance: "1.5km", slotsFree: 2 },
        { name: "ChargeHub", distance: "3.2km", slotsFree: 5 },
        { name: "PowerUp", distance: "0.8km", slotsFree: 1 },
        { name: "EcoCharge", distance: "5.0km", slotsFree: 3 },
        { name: "GreenVolt", distance: "2.1km", slotsFree: 0 },
        { name: "ElectroCharge", distance: "4.5km", slotsFree: 4 },
        { name: "RapidCharge", distance: "1.0km", slotsFree: 2 },
    ];
    const tickerMessages = [
        "Tip: Charge during off-peak hours for better rates!",
        "Ad: Download our Zyntra app for seamless charging!",
        "Announcement: New fast chargers coming soon to Zyntra!",
        "Remember to unplug after charging!",
        "Zyntra - Powering your journey, sustainably.",
        "Follow us on social media for updates!",
        "Enjoy your sustainable journey with Zyntra!",
    ];

    // Placeholder QR Code URL (replace with actual QR code image)
    const qrCodeImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zyntra.com/walkin"; // Example: points to a walk-in URL

    return (
        <div className={styles.container}>
           
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>{stationName}</h1>
                <div className={styles.headerButtons}> 
                    <button className={styles.walkInButton} onClick={() => setShowQrCode(true)}>
                        Walk-in
                    </button>
                    <button className={styles.helpButton}>
                        Help / Support
                    </button>
                </div>
            </header>

            <main className={styles.mainContent}>

                <div className={styles.leftColumn}>

                    <div className={`${styles.card} ${styles.scrollableCardBox}`}>
                        <h2 className={styles.cardTitle}>Current Queue</h2>
                        {currentQueue.map((item, index) => (
                            <p key={index} className={styles.cardText}>
                                {item.user} - <span className={index === 0 ? styles.queueNext : styles.queueOther}>{item.timeRemaining || item.status}</span>
                            </p>
                        ))}
                    </div>

                    <div className={`${styles.card} ${styles.scrollableCardBox}`}>
                        <h2 className={styles.cardTitle}>Upcoming Bookings</h2>
                        {upcomingBookings.map((item, index) => (
                            <p key={index} className={styles.cardText}>
                                {item.time} - <span className={item.status === 'Reserved' ? styles.bookingReserved : styles.bookingAvailable}>{item.status}</span>
                            </p>
                        ))}
                    </div>
                </div>

                <div className={styles.rightColumn}>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Power Stats</h2>
                        <p className={styles.cardText}>
                            Current Load: <span className={styles.powerLoad}>{powerStats.currentLoad}</span>
                        </p>
                        <p className={styles.cardText}>
                            Peak Rate: <span className={styles.powerRate}>{powerStats.peakRate}</span>
                        </p>
                    </div>

                    <div className={`${styles.card} ${styles.scrollableCardBox}`}>
                        <h2 className={styles.cardTitle}>Nearby Stations</h2>
                        {nearbyStations.map((station, index) => (
                            <p key={index} className={styles.cardText}>
                                {station.name} - {station.distance} - <span className={styles.nearbySlots}>{station.slotsFree} Slots Free</span>
                            </p>
                        ))}
                    </div>
                </div>
            </main>

            <footer className={styles.tickerFooter}>
                <div className={styles.tickerContent}>
                    {tickerMessages.map((msg, index) => (
                        <span key={index} className={styles.tickerItem}>{msg}</span>
                    ))}
                </div>
            </footer>

            {showQrCode && (
                <div className={styles.qrCodeOverlay} onClick={() => setShowQrCode(false)}> 
                    <div className={styles.qrCodeModal} onClick={(e) => e.stopPropagation()}> 
                        <button className={styles.qrCodeCloseButton} onClick={() => setShowQrCode(false)}>X</button>
                        <h2 className={styles.qrCodeTitle}>Scan for Walk-in Charge</h2>
                        <img src={qrCodeImageUrl} alt="Walk-in QR Code" className={styles.qrCodeImage} />
                        <p className={styles.qrCodeText}>Scan this code to start your walk-in charging session.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dummy; */
// src/components/Dummy.tsx
/* import React, { useEffect, useState } from 'react';
import styles from './Dymmy.module.css';
import { db } from './firebaseConfig';
import { onValue, ref } from 'firebase/database';

const Dummy: React.FC = () => {
  const [showQrCode, setShowQrCode] = useState(false);
  const [currentQueue, setCurrentQueue] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);

  const stationName = "Zyntra";

  const powerStats = {
    currentLoad: "18.3kW",
    peakRate: "₹12/unit",
  };

  const nearbyStations = [
    { name: "EVPoint", distance: "1.5km", slotsFree: 2 },
    { name: "ChargeHub", distance: "3.2km", slotsFree: 5 },
    { name: "PowerUp", distance: "0.8km", slotsFree: 1 },
    { name: "EcoCharge", distance: "5.0km", slotsFree: 3 },
    { name: "GreenVolt", distance: "2.1km", slotsFree: 0 },
    { name: "ElectroCharge", distance: "4.5km", slotsFree: 4 },
    { name: "RapidCharge", distance: "1.0km", slotsFree: 2 },
  ];

  const tickerMessages = [
    "Tip: Charge during off-peak hours for better rates!",
    "Ad: Download our Zyntra app for seamless charging!",
    "Announcement: New fast chargers coming soon to Zyntra!",
    "Remember to unplug after charging!",
    "Zyntra - Powering your journey, sustainably.",
    "Follow us on social media for updates!",
    "Enjoy your sustainable journey with Zyntra!",
  ];

  const qrCodeImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zyntra.com/walkin";

  useEffect(() => {
    const queueRef = ref(db, 'currentQueue');
    const bookingRef = ref(db, 'upcomingBookings');

    onValue(queueRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.values(data);
        setCurrentQueue(parsed);
      } else {
        setCurrentQueue([]);
      }
    });

    onValue(bookingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.values(data);
        setUpcomingBookings(parsed);
      } else {
        setUpcomingBookings([]);
      }
    });
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>{stationName}</h1>
        <div className={styles.headerButtons}>
          <button className={styles.walkInButton} onClick={() => setShowQrCode(true)}>
            Walk-in
          </button>
          <button className={styles.helpButton}>Help / Support</button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <div className={`${styles.card} ${styles.scrollableCardBox}`}>
            <h2 className={styles.cardTitle}>Current Queue</h2>
            {currentQueue.map((item, index) => (
              <p key={index} className={styles.cardText}>
                {item.user} -{" "}
                <span className={index === 0 ? styles.queueNext : styles.queueOther}>
                  {item.timeRemaining || item.status}
                </span>
              </p>
            ))}
          </div>

          <div className={`${styles.card} ${styles.scrollableCardBox}`}>
            <h2 className={styles.cardTitle}>Upcoming Bookings</h2>
            {upcomingBookings.map((item, index) => (
              <p key={index} className={styles.cardText}>
                {item.time} -{" "}
                <span className={item.status === 'Reserved' ? styles.bookingReserved : styles.bookingAvailable}>
                  {item.status}
                </span>
              </p>
            ))}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Power Stats</h2>
            <p className={styles.cardText}>
              Current Load: <span className={styles.powerLoad}>{powerStats.currentLoad}</span>
            </p>
            <p className={styles.cardText}>
              Peak Rate: <span className={styles.powerRate}>{powerStats.peakRate}</span>
            </p>
          </div>

          <div className={`${styles.card} ${styles.scrollableCardBox}`}>
            <h2 className={styles.cardTitle}>Nearby Stations</h2>
            {nearbyStations.map((station, index) => (
              <p key={index} className={styles.cardText}>
                {station.name} - {station.distance} -{" "}
                <span className={styles.nearbySlots}>{station.slotsFree} Slots Free</span>
              </p>
            ))}
          </div>
        </div>
      </main>

      <footer className={styles.tickerFooter}>
        <div className={styles.tickerContent}>
          {tickerMessages.map((msg, index) => (
            <span key={index} className={styles.tickerItem}>{msg}</span>
          ))}
        </div>
      </footer>

      {showQrCode && (
        <div className={styles.qrCodeOverlay} onClick={() => setShowQrCode(false)}>
          <div className={styles.qrCodeModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.qrCodeCloseButton} onClick={() => setShowQrCode(false)}>X</button>
            <h2 className={styles.qrCodeTitle}>Scan for Walk-in Charge</h2>
            <img src={qrCodeImageUrl} alt="Walk-in QR Code" className={styles.qrCodeImage} />
            <p className={styles.qrCodeText}>Scan this code to start your walk-in charging session.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dummy;
 */
// pages/workstation/Dymmy.tsx
/* 
import React, { useEffect, useState, useRef } from 'react';
import styles from './Dymmy.module.css';
import { db } from '../.././firebase'; // This is now your Firestore instance
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'; // Firestore imports

declare global {
  interface Window {
    google: any; // For Google Maps/Places API
  }
}

const Dummy: React.FC = () => {
  const [showQrCode, setShowQrCode] = useState(false);
  const [currentQueue, setCurrentQueue] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [nearbyStations, setNearbyStations] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const stationName = "Zyntra";

  const powerStats = {
    currentLoad: "18.3kW",
    peakRate: "₹12/unit",
  };

  const tickerMessages = [
    "Tip: Charge during off-peak hours for better rates!",
    "Ad: Download our Zyntra app for seamless charging!",
    "Announcement: New fast chargers coming soon to Zyntra!",
    "Remember to unplug after charging!",
    "Zyntra - Powering your journey, sustainably.",
    "Follow us on social media for updates!",
    "Enjoy your sustainable journey with Zyntra!",
  ];

  const qrCodeImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zyntra.com/walkin";

  // Ref to hold the Google Map instance for PlacesService
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // --- Firestore Listeners ---
    // Listen for currentQueue changes
    const queueCollectionRef = collection(db, 'currentQueue');
    const unsubscribeQueue = onSnapshot(queueCollectionRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCurrentQueue(data);
    });

    // Listen for upcomingBookings changes
    const bookingsCollectionRef = collection(db, 'upcomingBookings');
    const unsubscribeBookings = onSnapshot(bookingsCollectionRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUpcomingBookings(data);
    });

    // --- Geolocation for Nearby Stations ---
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(loc);
          // Only load nearby stations if Google Maps API is ready
          if (window.google && window.google.maps && window.google.maps.places) {
            loadNearbyStations(loc);
          } else {
            // If API not ready yet, set up a listener or a timeout
            // For production, you'd typically load the Google Maps API script
            // dynamically or ensure it's loaded before this component
            console.warn("Google Maps API not fully loaded yet. Retrying in 1 second.");
            const retryLoad = setTimeout(() => {
              if (window.google && window.google.maps && window.google.maps.places) {
                loadNearbyStations(loc);
              } else {
                console.error("Google Maps API still not loaded after retry.");
              }
            }, 1000); // Retry after 1 second
            return () => clearTimeout(retryLoad);
          }
        },
        (err) => {
          console.error("Geolocation error:", err.message);
        }
      );
    }

    // Cleanup function for Firebase listeners
    return () => {
      unsubscribeQueue();
      unsubscribeBookings();
    };
  }, []); // Empty dependency array means this useEffect runs once on mount

  // Function to load nearby stations using Google Places API
  const loadNearbyStations = (location: { lat: number; lng: number }) => {
    // We need a dummy map instance to initialize PlacesService
    if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(document.createElement("div"));
    }
    
    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);

    service.nearbySearch(
      {
        location,
        radius: 5000, // 5 km radius
        keyword: "EV charging station",
      },
      (results: any[], status: string) => {
        if (status === "OK" && results) {
          const operationalStations = results
            .filter((s) => s.business_status === "OPERATIONAL")
            .slice(0, 3); // Get top 3 operational stations
          setNearbyStations(operationalStations);
        } else if (status === "ZERO_RESULTS") {
          setNearbyStations([]); // No results found
          console.log("No nearby EV charging stations found.");
        } else {
          console.warn("Nearby Search failed:", status);
        }
      }
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>{stationName}</h1>
        <div className={styles.headerButtons}>
          <button className={styles.walkInButton} onClick={() => setShowQrCode(true)}>
            Walk-in
          </button>
          <button className={styles.helpButton}>Help / Support</button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <div className={`${styles.card} ${styles.scrollableCardBox}`}>
            <h2 className={styles.cardTitle}>Current Queue</h2>
            {currentQueue.length > 0 ? (
              currentQueue.map((item, index) => (
                <p key={item.id || index} className={styles.cardText}>
                  {item.user} -{" "}
                  <span className={index === 0 ? styles.queueNext : styles.queueOther}>
                    {item.timeRemaining || item.status || "N/A"}
                  </span>
                </p>
              ))
            ) : (
              <p className={styles.cardText}>No vehicles in queue.</p>
            )}
          </div>

          <div className={`${styles.card} ${styles.scrollableCardBox}`}>
            <h2 className={styles.cardTitle}>Upcoming Bookings</h2>
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((item, index) => (
                <p key={item.id || index} className={styles.cardText}>
                  {item.time} -{" "}
                  <span className={item.status === 'Reserved' ? styles.bookingReserved : styles.bookingAvailable}>
                    {item.status || "N/A"}
                  </span>
                </p>
              ))
            ) : (
              <p className={styles.cardText}>No upcoming bookings.</p>
            )}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Power Stats</h2>
            <p className={styles.cardText}>
              Current Load: <span className={styles.powerLoad}>{powerStats.currentLoad}</span>
            </p>
            <p className={styles.cardText}>
              Peak Rate: <span className={styles.powerRate}>{powerStats.peakRate}</span>
            </p>
          </div>

          <div className={`${styles.card} ${styles.scrollableCardBox}`}>
            <h2 className={styles.cardTitle}>Nearby Stations (Live)</h2>
            {nearbyStations.length === 0 && <p className={styles.cardText}>Loading or none nearby...</p>}
            {nearbyStations.map((station, index) => (
              <p key={index} className={styles.cardText}>
                <strong>{station.name}</strong><br />
                {station.vicinity}<br />
                {station.opening_hours && station.opening_hours.open_now !== undefined && (
                  <span className={station.opening_hours.open_now ? styles.openNow : styles.closedNow}>
                    {station.opening_hours.open_now ? "Open Now" : "Closed"}
                  </span>
                )}
                {userLocation && station.geometry && station.geometry.location && (
                  <a
                    href={`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${station.geometry.location.lat()},${station.geometry.location.lng()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.nearbySlots}
                  >
                    Start Navigation →
                  </a>
                )}
              </p>
            ))}
          </div>
        </div>
      </main>

      <footer className={styles.tickerFooter}>
        <div className={styles.tickerContent}>
          {tickerMessages.map((msg, index) => (
            <span key={index} className={styles.tickerItem}>{msg}</span>
          ))}
        </div>
      </footer>

      {showQrCode && (
        <div className={styles.qrCodeOverlay} onClick={() => setShowQrCode(false)}>
          <div className={styles.qrCodeModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.qrCodeCloseButton} onClick={() => setShowQrCode(false)}>X</button>
            <h2 className={styles.qrCodeTitle}>Scan for Walk-in Charge</h2>
            <img src={qrCodeImageUrl} alt="Walk-in QR Code" className={styles.qrCodeImage} />
            <p className={styles.qrCodeText}>Scan this code to start your walk-in charging session.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dummy; */
import React, { useEffect, useState, useRef } from 'react';
import styles from './Dymmy.module.css';
import { db } from '../../firebase';
import { collection, onSnapshot, query, where, getDoc, DocumentData, getDocs } from 'firebase/firestore';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// --- INTERFACES --- (Interfaces remain the same)
interface Booking {
  id?: string;
  bookedAt: string;
  pin: number;
  slotTime: string;
  status: string;
  userId: string;
  userName: string;
  evName?: string;
  evModel?: string;
}

interface UserProfile {
  batteryRemaining: number;
  emailVerified: boolean;
  evModel: string;
  evName: string;
  greenCredits: number;
  lastUpdated: any;
  name: string;
  profilePictureUrl: string;
  walletBalance: number;
}

interface StationData {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  bookings: Booking[];
  phone: string;
  rating: number;
  user_ratings_total: number;
  isZyntra: boolean;
}

interface NearbyStation {
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  opening_hours?: {
    open_now: boolean;
  };
  rating?: number;
  user_ratings_total?: number;
}


const Dummy: React.FC = () => {
  // --- STATE VARIABLES ---
  const [isFullscreen, setIsFullscreen] = useState(false); // New state for fullscreen
  const containerRef = useRef<HTMLDivElement>(null); // New ref for the main container

  // (Existing state variables remain the same)
  const [showQrCode, setShowQrCode] = useState(false);
  const [currentQueue, setCurrentQueue] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [nearbyStations, setNearbyStations] = useState<NearbyStation[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<{
    success: boolean;
    userId?: string;
    message?: string;
  } | null>(null);
  const powerStats = {
    currentLoad: "18.3kW",
    peakRate: "₹12/unit",
  };
  const navigate = useNavigate();

  const tickerMessages = [
    "Tip: Charge during off-peak hours for better rates!",
    "Zyntra Pro Tip: Book in advance for guaranteed slots!",
    "New Feature: Track your charging session in real-time!",
    "Remember to unplug after charging!",
    "Zyntra - Powering your journey, sustainably.",
    "Download our app for exclusive benefits!",
  ];

  const qrCodeImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zyntra.com/walkin";


  // --- FULLSCREEN LOGIC ---
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // --- EXISTING FUNCTIONS AND EFFECTS ---
  // (All other functions and useEffect hooks remain unchanged)

  const authenticateUser = async (email: string, password: string): Promise<{uid: string, email: string | null}> => {
    // ... (function implementation is unchanged)
    const auth = getAuth(); try { const userCredential = await signInWithEmailAndPassword(auth, email, password); return { uid: userCredential.user.uid, email: userCredential.user.email, }; } catch (error: any) { let errorMessage = 'Login failed. Please try again.'; switch (error.code) { case 'auth/invalid-email': errorMessage = 'Invalid email address'; break; case 'auth/user-disabled': errorMessage = 'Account disabled'; break; case 'auth/user-not-found': errorMessage = 'No account found with this email'; break; case 'auth/wrong-password': errorMessage = 'Incorrect password'; break; default: console.error('Authentication error:', error); } throw new Error(errorMessage); }
  };
  
  const handleWalkInLogin = async () => {
    // ... (function implementation is unchanged)
    if (!email || !password) { setLoginError('Please enter both email and password'); return; } setIsLoggingIn(true); setLoginError(''); try { const user = await authenticateUser(email, password); const userProfileRef = doc(db, 'userProfiles', user.uid); const userProfileSnap = await getDoc(userProfileRef); if (!userProfileSnap.exists()) { throw new Error('User profile not found'); } const userData = userProfileSnap.data() as UserProfile; const zyntraLocationsRef = collection(db, 'zyntra_user_location'); const q = query(zyntraLocationsRef, where('isZyntra', '==', true)); const querySnapshot = await getDocs(q); if (querySnapshot.empty) { throw new Error('No available charging locations found'); } const locationDoc = querySnapshot.docs[0]; const locationData = locationDoc.data(); const bookings = locationData.bookings || []; const now = new Date(); let nextAvailableTime = ''; if (bookings.length === 0) { nextAvailableTime = 'Immediately'; } else { const lastBooking = bookings[bookings.length - 1]; const lastTime = new Date(lastBooking.bookedAt); lastTime.setMinutes(lastTime.getMinutes() + 30); nextAvailableTime = lastTime > now ? lastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Immediately'; } const booking: Booking = { userId: user.uid, userName: userData.name, bookedAt: new Date().toISOString(), slotTime: nextAvailableTime === 'Immediately' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : nextAvailableTime, status: 'reserved', pin: Math.floor(1000 + Math.random() * 9000), evName: userData.evName, evModel: userData.evModel }; await updateDoc(locationDoc.ref, { bookings: arrayUnion(booking) }); setSuccessMessage(`You've been added to the queue! Your PIN is ${booking.pin}. Next available slot: ${nextAvailableTime}`); setShowSuccess(true); setCurrentQueue(prev => [...prev, booking]); } catch (error: unknown) { console.error('Login error:', error); let errorMessage = 'Login failed. Please try again.'; if (error instanceof Error) { errorMessage = error.message; } setLoginError(errorMessage); } finally { setIsLoggingIn(false); }
  };
  
  useEffect(() => {
    // ... (useEffect for RFID is unchanged)
    const esp32IP = "http://192.168.133.97"; const checkRFID = async () => { try { const res = await fetch(`${esp32IP}/rfid-detected`); const json = await res.json(); if (json.status === "detected") { console.log("🚀 RFID scanned, navigating..."); navigate('/workstation/stationspecific'); } else { setTimeout(checkRFID, 1000); } } catch (error) { console.error("RFID check failed:", error); setTimeout(checkRFID, 2000); } }; checkRFID();
  }, [navigate]);

  useEffect(() => {
    // ... (useEffect for station data is unchanged)
    const zyntraStationRef = collection(db, 'stations'); const zyntraLocationsRef = collection(db, 'zyntra_user_location'); const q = query(zyntraStationRef, where('isZyntra', '==', true)); const unsubscribe = onSnapshot(q, async (snapshot) => { if (!snapshot.empty) { const stationDoc = snapshot.docs[0]; const data = stationDoc.data() as StationData; const locationsQuery = query(zyntraLocationsRef, where('isZyntra', '==', true)); const locationsSnapshot = await getDocs(locationsQuery); const mobileLocations = locationsSnapshot.docs.map(doc => doc.data()); const allBookings = [...data.bookings]; mobileLocations.forEach(loc => { if (loc.bookings) { allBookings.push(...loc.bookings); } }); const bookingsWithUserData = await Promise.all(allBookings.map(async (booking) => { try { const userProfileRef = doc(db, 'userProfiles', booking.userId); const userProfileSnap = await getDoc(userProfileRef); if (userProfileSnap.exists()) { const userData = userProfileSnap.data() as UserProfile; return { ...booking, id: booking.id || Math.random().toString(36).substring(7), evName: userData.evName, evModel: userData.evModel }; } return booking; } catch (error) { console.error("Error fetching user profile:", error); return booking; } })); const now = new Date(); const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const tomorrowStart = new Date(todayStart); tomorrowStart.setDate(todayStart.getDate() + 1); const dayAfterTomorrowStart = new Date(tomorrowStart); dayAfterTomorrowStart.setDate(tomorrowStart.getDate() + 1); setStationData({ ...data, bookings: bookingsWithUserData }); setCurrentQueue(bookingsWithUserData.filter(booking => { const bookingDate = new Date(booking.bookedAt); return (bookingDate >= todayStart && bookingDate < tomorrowStart) && (booking.status === 'reserved' || booking.status === 'active'); })); setUpcomingBookings(bookingsWithUserData.filter(booking => { const bookingDate = new Date(booking.bookedAt); return bookingDate >= tomorrowStart && bookingDate < dayAfterTomorrowStart; })); } setLoading(false); }, (error) => { console.error("Error fetching station data:", error); setLoading(false); }); const checkMapsLoaded = () => { if (window.google && window.google.maps && window.google.maps.places) { const map = new google.maps.Map(document.createElement('div')); placesServiceRef.current = new google.maps.places.PlacesService(map); setMapsLoaded(true); return true; } return false; }; if (!checkMapsLoaded()) { const timer = setInterval(() => { if (checkMapsLoaded()) { clearInterval(timer); } }, 100); return () => clearInterval(timer); }
  }, []);

  useEffect(() => {
    // ... (second useEffect for station data is unchanged)
    const zyntraStationRef = collection(db, 'stations'); const q = query(zyntraStationRef, where('isZyntra', '==', true)); const unsubscribe = onSnapshot(q, async (snapshot) => { if (!snapshot.empty) { const stationDoc = snapshot.docs[0]; const data = stationDoc.data() as StationData; const bookingsWithUserData = await Promise.all(data.bookings.map(async (booking) => { try { const userProfileRef = doc(db, 'userProfiles', booking.userId); const userProfileSnap = await getDoc(userProfileRef); if (userProfileSnap.exists()) { const userData = userProfileSnap.data() as UserProfile; return { ...booking, id: booking.id || Math.random().toString(36).substring(7), evName: userData.evName, evModel: userData.evModel }; } return booking; } catch (error) { console.error("Error fetching user profile:", error); return booking; } })); setStationData({ ...data, bookings: bookingsWithUserData }); const now = new Date(); const currentHours = now.getHours(); const currentMinutes = now.getMinutes(); setCurrentQueue(bookingsWithUserData.filter(booking => booking.status === 'reserved' || booking.status === 'active')); setUpcomingBookings(bookingsWithUserData.filter(booking => booking.status === 'reserved' && (parseInt(booking.slotTime.split(':')[0]) > currentHours || (parseInt(booking.slotTime.split(':')[0]) === currentHours && parseInt(booking.slotTime.split(':')[1].split(' ')[0]) > currentMinutes)))); } setLoading(false); }, (error) => { console.error("Error fetching station data:", error); setLoading(false); }); if (navigator.geolocation) { navigator.geolocation.getCurrentPosition((pos) => { const location = { lat: pos.coords.latitude, lng: pos.coords.longitude }; setUserLocation(location); if (mapsLoaded) { loadNearbyStations(location); } }, (err) => { console.error("Geolocation error:", err.message); }); } return () => unsubscribe();
  }, [mapsLoaded]);

  const loadNearbyStations = (location: { lat: number; lng: number }) => {
    // ... (function implementation is unchanged)
    if (!placesServiceRef.current) { console.error("PlacesService not initialized"); return; } const request = { location: new google.maps.LatLng(location.lat, location.lng), radius: 5000, type: 'electric_vehicle_charging_station', keyword: 'ev charging' }; placesServiceRef.current.nearbySearch(request, (results: google.maps.places.PlaceResult[] | null, status) => { if (status === google.maps.places.PlacesServiceStatus.OK && results) { const filteredStations: NearbyStation[] = results.filter((result): result is google.maps.places.PlaceResult & { name: string; vicinity: string; geometry: { location: google.maps.LatLng }; } => (!!result.name && !!result.vicinity && !!result.geometry?.location)).map(result => { const station: NearbyStation = { name: result.name, vicinity: result.vicinity, geometry: { location: { lat: () => result.geometry.location.lat(), lng: () => result.geometry.location.lng() } } }; if (result.opening_hours) { station.opening_hours = { open_now: Boolean(result.opening_hours.open_now) }; } if (result.rating !== undefined) { station.rating = result.rating; } if (result.user_ratings_total !== undefined) { station.user_ratings_total = result.user_ratings_total; } return station; }).slice(0, 3); setNearbyStations(filteredStations); } else { console.warn("Nearby stations search failed:", status); setNearbyStations([]); } });
  };

  const handleChargeClick = async (booking: Booking) => {
    // ... (function implementation is unchanged)
try { const currentTime = new Date(); const [time, period] = booking.slotTime.split(' '); let [hours, minutes] = time.split(':').map(Number); if (period === 'PM' && hours < 12) hours += 12; if (period === 'AM' && hours === 12) hours = 0; const slotTime = new Date(); slotTime.setHours(hours, minutes, 0, 0); if (currentTime <= slotTime) { const esp32IP = "http://192.168.133.97"; const unlockUrl = `${esp32IP}/unlock?pin=${booking.pin}&userId=${booking.userId}`; await fetch(unlockUrl); alert(`✅ PIN sent for ${booking.userName}. Waiting for verification...`); const checkSuccess = async () => { const res = await fetch(`${esp32IP}/verify-success`); const json = await res.json(); if (json.status === "success") { localStorage.setItem('uid', booking.userId); navigate(`/workstation/userspecific/${booking.userId}`); } else { setTimeout(checkSuccess, 1000); } }; checkSuccess(); } else { const timeDiff = Math.ceil((slotTime.getTime() - currentTime.getTime()) / 60000); alert(`⏳ Too early to start charging for ${booking.userName}. Please wait ${timeDiff} minute(s).`); } } catch (error) { console.error("ESP32 communication failed:", error); alert("🚫 Failed to communicate with the ESP32. Check your network or device."); }
  };
  
  const renderNearbyStations = () => {
    // ... (function implementation is unchanged)
    if (!mapsLoaded) { return <p className={styles.loadingText}>Loading map services...</p>; } if (nearbyStations.length === 0) { return <p className={styles.emptyMessage}>No charging stations found nearby</p>; } return (<div className={styles.stationsList}> {nearbyStations.map((station, index) => (<div key={index} className={styles.stationItem}> <h3>{station.name}</h3> <p>{station.vicinity}</p> {station.opening_hours && (<p className={station.opening_hours.open_now ? styles.open : styles.closed}> {station.opening_hours.open_now ? 'Open Now' : 'Closed'} </p>)} {station.rating && (<div className={styles.stationRating}> <span>Rating: {station.rating}</span> {station.user_ratings_total && (<span>({station.user_ratings_total} reviews)</span>)} </div>)} {userLocation && (<a href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${station.geometry.location.lat()},${station.geometry.location.lng()}&travelmode=driving`} target="_blank" rel="noopener noreferrer" className={styles.navigationButton}> <i className="fas fa-directions"></i> Get Directions </a>)} </div>))} </div>);
  };
  
  const handleScreenClick = () => {
    setShowDashboard(true);
  };

  if (!showDashboard) {
    // ... (splash screen JSX is unchanged)
    return (<div className={styles.splashScreen} onClick={handleScreenClick} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: '#ffffffff', color: 'white', cursor: 'pointer' }}> <h1 style={{ fontSize: '5rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(90deg, #00ffe5 0%, #00ffaa 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}> ZYNTRA </h1> <p style={{ fontSize: '1rem', opacity: 0.8, letterSpacing: '10px', color: '#3f3f3fff', }}> THE FUTURE OF EV </p> </div>);
  }

  // --- RENDER ---
  return (
    // Add the ref to the main container div
    <div className={styles.container} ref={containerRef}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>Zyntra Charging Station</h1>
          {stationData && (
            <div className={styles.stationRating}>
              <span className={styles.ratingStars}>★★★★★</span>
              <span>{stationData.rating} ({stationData.user_ratings_total})</span>
            </div>
          )}
        </div>
        <div className={styles.headerButtons}>
            {/* NEW: Fullscreen Button */}
            <button className={styles.helpButton} onClick={toggleFullscreen}>
                {isFullscreen ? (
                    <>
                        <i className="fas fa-compress-arrows-alt"></i> Collapse
                    </>
                ) : (
                    <>
                        <i className="fas fa-expand-arrows-alt"></i> Expand
                    </>
                )}
            </button>
            <button 
                className={styles.walkInButton} 
                onClick={() => setShowLoginModal(true)}
            >
                Walk-in
            </button>
            <button className={styles.helpButton}>
                <i className="fas fa-headset"></i> Support
            </button>
        </div>
      </header>

      {/* The rest of the JSX remains the same */}
      <main className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <div className={`${styles.card} ${styles.queueCard}`}>
            <h2 className={styles.cardTitle}>
              <i className="fas fa-list-ol"></i> Current Queue
              <span className={styles.queueCount}>{currentQueue.length}</span>
            </h2>
            {loading ? (
              <p className={styles.loadingText}>Loading queue...</p>
            ) : currentQueue.length > 0 ? (
              <div className={styles.queueList}>
                {currentQueue.map((item) => (
                  <div key={item.id} className={styles.queueItem}>
                    <div className={styles.queueItemContent}>
                      <div className={styles.userAvatar}>
                        {item.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.queueItemDetails}>
                        <h3>{item.userName}</h3>
                        <p>
                          <span className={styles.detailLabel}>Vehicle:</span> 
                          <span className={styles.detailValue}>
                            {item.evName || 'EV'} {item.evModel ? `(${item.evModel})` : ''}
                          </span>
                        </p>
                        <p>
                          <span className={styles.detailLabel}>Time:</span> 
                          <span className={styles.detailValue}>{item.slotTime}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      className={`${styles.chargeButton} ${item.status === 'active' ? styles.charging : ''}`}
                      onClick={() => handleChargeClick(item)}
                    >
                      {item.status === 'active' ? 'Charging...' : 'Verify'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>No active charging sessions</p>
            )}
          </div>

          <div className={`${styles.card} ${styles.bookingsCard}`}>
            <h2 className={styles.cardTitle}>
              <i className="fas fa-calendar-alt"></i> Upcoming Bookings
            </h2>
            {loading ? (
              <p className={styles.loadingText}>Loading bookings...</p>
            ) : upcomingBookings.length > 0 ? (
              <div className={styles.bookingsList}>
                {upcomingBookings.map((item) => (
                  <div key={item.id} className={styles.bookingItem}>
                    <div className={styles.bookingTime}>
                      <i className="fas fa-clock"></i> {item.slotTime}
                    </div>
                    <div className={styles.bookingUser}>
                      <i className="fas fa-user"></i> {item.userName}
                    </div>
                    <div className={styles.bookingPin}>
                      <i className="fas fa-car"></i> {item.evName || 'EV'} {item.evModel}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>No upcoming bookings</p>
            )}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={`${styles.card} ${styles.statsCard}`}>
            <h2 className={styles.cardTitle}>
              <i className="fas fa-bolt"></i> Power Stats
            </h2>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Current Load</div>
                <div className={styles.statValue}>{powerStats.currentLoad}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Peak Rate</div>
                <div className={styles.statValue}>{powerStats.peakRate}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Availability</div>
                <div className={styles.statValue}>
                  {currentQueue.length < 3 ? 'Good' : 'Limited'}
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Contact</div>
                <div className={styles.statValue}>
                  {stationData?.phone || '+91 1800 123 4567'}
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.stationsCard}`}>
            <h2 className={styles.cardTitle}>
              <i className="fas fa-map-marker-alt"></i> Nearby Stations
            </h2>
            {renderNearbyStations()}
          </div>
        </div>
      </main>

      <footer className={styles.tickerFooter}>
        <div className={styles.tickerContent}>
          {tickerMessages.map((msg, index) => (
            <span key={index} className={styles.tickerItem}>
              <i className="fas fa-info-circle"></i> {msg}
            </span>
          ))}
        </div>
      </footer>

      {showLoginModal && (
        <div className={styles.loginOverlay} onClick={() => { setShowLoginModal(false); setShowSuccess(false); }}>
          <div className={styles.loginModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseButton} onClick={() => { setShowLoginModal(false); setShowSuccess(false); }}>
              <i className="fas fa-times"></i>
            </button>
            
            {showSuccess ? (
              <div className={styles.successContainer}>
                <div className={styles.successIcon}>
                  <i className="fas fa-check-circle"></i>
                </div>
                <h2 className={styles.successTitle}>Success!</h2>
                <p className={styles.successMessage}>{successMessage}</p>
                <button className={styles.successButton} onClick={() => { setShowLoginModal(false); setShowSuccess(false); setEmail(''); setPassword(''); }}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className={styles.modalTitle}>Walk-in Charging</h2>
                <div className={styles.loginForm}>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                  </div>
                  
                  {loginError && <div className={styles.errorMessage}>{loginError}</div>}
                  
                  <button className={styles.loginButton} onClick={handleWalkInLogin} disabled={isLoggingIn}>
                    {isLoggingIn ? 'Processing...' : 'Start Charging'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dummy;