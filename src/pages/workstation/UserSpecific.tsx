/* import React, { useState, useEffect, useRef } from 'react';
import styles from './UserSpecific.module.css';
import {
  FaUserCircle,
  FaCar,
  FaBatteryFull,
  FaLeaf,
  FaBolt,
  FaCoffee,
  FaWifi,
  FaRestroom,
  FaTrophy,
  FaMapMarkerAlt, // For station location
  FaSpinner, // For charging animation
} from 'react-icons/fa';

interface UserDashboardProps {
  userName: string;
  evName: string;
  batteryRemaining: number; // Percentage
  greenCredits: number; // Number of credits
  chargingRateKW?: number; // Current charging rate of the car/charger (e.g., 50 for DCFC)
  costPerKWh?: number; // Cost per kWh (e.g., 15 for 15 INR/kWh)
  stationAmenities?: string[]; // List of amenities at the current station
  nearestStationName?: string; // Name of the nearest station
}

const UserSpecific: React.FC<UserDashboardProps> = ({
  userName,
  evName,
  batteryRemaining: initialBatteryRemaining,
  greenCredits: initialGreenCredits,
  chargingRateKW = 50, // Default to 50 kW for estimation if not provided
  costPerKWh = 15, // Default to 15 INR/kWh (Coimbatore context)
  stationAmenities = ['WiFi', 'Coffee Shop', 'Restroom'],
  nearestStationName = 'Zyntra Charging Hub - Phase 2', // Placeholder
}) => {
  const [batteryRemaining, setBatteryRemaining] = useState(initialBatteryRemaining);
  const [greenCredits, setGreenCredits] = useState(initialGreenCredits);
  const [chargeAmountKWh, setChargeAmountKWh] = useState(0); // kWh to charge
  const [isCharging, setIsCharging] = useState(false);
  const [chargingStatusMessage, setChargingStatusMessage] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(0); // in minutes
  const [estimatedCost, setEstimatedCost] = useState(0); // in INR

  const chargeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const EV_BATTERY_CAPACITY_KWH = 60; // Example: Assuming a 60 kWh battery capacity for calculations

  // --- Charging Simulation & UI Feedback ---
  useEffect(() => {
    if (isCharging) {
      setChargingStatusMessage('Charging in progress...');
      chargeIntervalRef.current = setInterval(() => {
        setBatteryRemaining(prev => {
          const kWhPerInterval = chargingRateKW / 3600; // kWh charged per second
          const percentagePerInterval = (kWhPerInterval / EV_BATTERY_CAPACITY_KWH) * 100;
          const newBattery = Math.min(prev + percentagePerInterval, 100);

          if (newBattery >= 100) {
            setIsCharging(false);
            setChargingStatusMessage('Charging complete! Battery Full.');
            if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
            return 100;
          }

          // Stop if desired charge amount is reached
          const currentKWh = (prev / 100) * EV_BATTERY_CAPACITY_KWH;
          if (currentKWh + kWhPerInterval >= (chargeAmountKWh + (batteryRemaining / 100) * EV_BATTERY_CAPACITY_KWH)) {
            setIsCharging(false);
            setChargingStatusMessage(`Target charge (${chargeAmountKWh} kWh) reached!`);
            if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
            return (currentKWh + kWhPerInterval) / EV_BATTERY_CAPACITY_KWH * 100; // Set to exact target
          }

          return newBattery;
        });
        setGreenCredits(prev => prev + 0.05); // Earn credits gradually (e.g., 0.05 credits per second)
      }, 1000); // Update every second
    } else {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    }

    return () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    };
  }, [isCharging, chargingRateKW, EV_BATTERY_CAPACITY_KWH, chargeAmountKWh, batteryRemaining]);

  // --- Calculation of Estimated Time and Cost ---
  useEffect(() => {
    if (chargeAmountKWh > 0 && chargingRateKW > 0) {
      const remainingCapacityToFull = EV_BATTERY_CAPACITY_KWH * ((100 - batteryRemaining) / 100);
      const actualChargeNeeded = Math.min(chargeAmountKWh, remainingCapacityToFull);

      const timeInHours = actualChargeNeeded / chargingRateKW;
      setEstimatedTime(Math.round(timeInHours * 60)); // Convert to minutes
      setEstimatedCost(Math.round(actualChargeNeeded * costPerKWh));
    } else {
      setEstimatedTime(0);
      setEstimatedCost(0);
    }
  }, [chargeAmountKWh, batteryRemaining, chargingRateKW, costPerKWh, EV_BATTERY_CAPACITY_KWH]);

  // --- Battery Color Logic ---
  const getBatteryColor = (percentage: number) => {
    if (percentage > 70) return styles.batteryHigh;
    if (percentage > 30) return styles.batteryMedium;
    return styles.batteryLow;
  };

  // --- Handlers ---
  const handleChargeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setChargeAmountKWh(isNaN(value) ? 0 : value);
  };

  const startCharging = () => {
    if (batteryRemaining >= 100) {
      setChargingStatusMessage('Battery is already full!');
      return;
    }
    if (chargeAmountKWh <= 0) {
      setChargingStatusMessage('Please enter a valid charge amount.');
      return;
    }
    const currentKWh = (batteryRemaining / 100) * EV_BATTERY_CAPACITY_KWH;
    if (currentKWh + chargeAmountKWh > EV_BATTERY_CAPACITY_KWH + 0.1) { // Add small buffer
        setChargingStatusMessage('Desired charge exceeds battery capacity. Please reduce.');
        return;
    }

    setIsCharging(true);
    setChargingStatusMessage(`Starting charge for ${chargeAmountKWh} kWh...`);
  };

  const stopCharging = () => {
    setIsCharging(false);
    setChargingStatusMessage('Charging session manually stopped.');
  };

  const formatGreenCredits = (credits: number) => credits.toFixed(2);

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>
        <FaUserCircle className={styles.icon} /> {userName}'s Dashboard
      </h1>

      <div className={styles.infoGrid}>
        
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <FaCar className={styles.icon} /> My EV
          </h2>
          <p className={styles.cardText}>{evName}</p>
        </div>

        <div className={`${styles.card} ${getBatteryColor(batteryRemaining)}`}>
          <h2 className={styles.cardTitle}>
            <FaBatteryFull className={styles.icon} /> Battery
          </h2>
          <p className={styles.cardText}>
            <span className={getBatteryColor(batteryRemaining)}>
              {batteryRemaining.toFixed(1)}%
            </span>{' '}
            Remaining
          </p>
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressBarFill} ${getBatteryColor(batteryRemaining)}Fill`}
              style={{ width: `${batteryRemaining}%` }}
            ></div>
          </div>
          <p className={styles.chargingStatus}>
            {isCharging ? (
              <>
                <FaSpinner className={styles.spinnerIcon} /> {chargingStatusMessage}
              </>
            ) : (
              chargingStatusMessage || 'Ready to charge.'
            )}
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <FaLeaf className={styles.icon} /> Green Credits
          </h2>
          <p className={styles.cardText}>
            <span className={styles.greenCreditsValue}>{formatGreenCredits(greenCredits)}</span> Credits
          </p>
          <p className={styles.subText}>Earn more by charging efficiently and using renewables!</p>
          <button className={styles.actionButton} onClick={() => alert('Redirect to Rewards Store!')}>
            <FaTrophy className={styles.buttonIcon} /> Redeem Rewards
          </button>
        </div>
      </div>

      <div className={styles.chargingControlSection}>
        <h2 className={styles.sectionTitle}>
          <FaBolt className={styles.icon} /> Charging Controls
        </h2>
        <div className={styles.chargeInputGroup}>
          <label htmlFor="chargeAmount" className={styles.inputLabel}>
            Desired Charge (kWh):
          </label>
          <input
            type="number"
            id="chargeAmount"
            value={chargeAmountKWh}
            onChange={handleChargeAmountChange}
            min="0"
max={parseFloat((EV_BATTERY_CAPACITY_KWH * ((100 - batteryRemaining) / 100)).toFixed(1))} // Max is remaining capacity
            step="0.5" // Allow smaller increments
            className={styles.chargeInputField}
            disabled={isCharging || batteryRemaining >= 100}
          />
        </div>
        <p className={styles.estimationText}>
          Estimated Time: {estimatedTime} mins | Estimated Cost: ₹{estimatedCost}
        </p>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.controlButton} ${styles.startButton}`}
            onClick={startCharging}
            disabled={isCharging || chargeAmountKWh <= 0 || batteryRemaining >= 100}
          >
            Start Charging
          </button>
          <button
            className={`${styles.controlButton} ${styles.stopButton}`}
            onClick={stopCharging}
            disabled={!isCharging}
          >
            Stop Charging
          </button>
        </div>
      </div>

      <div className={styles.amenitiesSection}>
        <h2 className={styles.sectionTitle}>
          <FaMapMarkerAlt className={styles.icon} /> At {nearestStationName}
        </h2>
        <h3 className={styles.subSectionTitle}>Available Amenities</h3>
        <div className={styles.amenitiesGrid}>
          {stationAmenities.map((amenity, index) => (
            <div key={index} className={styles.amenityItem}>
              {amenity === 'WiFi' && <FaWifi className={styles.amenityIcon} />}
              {amenity === 'Coffee Shop' && <FaCoffee className={styles.amenityIcon} />}
              {amenity === 'Restroom' && <FaRestroom className={styles.amenityIcon} />}
              
              <span className={styles.amenityText}>{amenity}</span>
            </div>
          ))}
          {stationAmenities.length === 0 && (
            <p className={styles.noAmenities}>No special amenities at this station.</p>
          )}
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h2 className={styles.sectionTitle}>Recent Activity & Analytics</h2>
        <ul className={styles.activityList}>
          <li>Charged 25 kWh at Zyntra Station A (2 hours ago) - Earned 3.5 Green Credits</li>
          <li>Earned 5 credits for efficient driving (yesterday)</li>
          <li>Next service due in 1500 km</li>
          <li>Utilized 80% renewable energy for last charge</li>
          <li>Subscription renewed successfully (July 20, 2025)</li>
        </ul>
      </div>
    </div>
  );
};

export default UserSpecific; */
// pages/workstation/UserSpecific.tsx
/* import React, { useState, useEffect, useRef } from 'react';
import styles from './UserSpecific.module.css';
import {
  FaUserCircle,
  FaCar,
  FaBatteryFull,
  FaLeaf,
  FaBolt,
  FaCoffee,
  FaWifi,
  FaRestroom,
  FaTrophy,
  FaMapMarkerAlt,
  FaSpinner,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

interface UserData {
  name?: string;  // Changed from userName to name
  evName?: string;
  evModel?: string;
  batteryRemaining?: number;
  greenCredits?: number;
  walletBalance?: number;
  profilePictureUrl?: string;
  emailVerified?: boolean;
  lastUpdated?: any;
  role?: string;
  transactions?: any[];
}

const UserSpecific: React.FC = () => {
  const [batteryRemaining, setBatteryRemaining] = useState(0);
  const [greenCredits, setGreenCredits] = useState(0);
  const [chargeAmountKWh, setChargeAmountKWh] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [chargingStatusMessage, setChargingStatusMessage] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const chargeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Constants
  const EV_BATTERY_CAPACITY_KWH = 60;
  const chargingRateKW = 30;
  const costPerKWh = 16.5;
  const stationAmenities = ['WiFi', 'Coffee Shop', 'Restroom', 'Snack Vending', 'Lounge Area'];
  const nearestStationName = 'Zyntra Charging Hub - Race Course Rd, Coimbatore';

  // Get UID from localStorage (as set in dummy.tsx)
  const uid = localStorage.getItem('uid');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) {
        console.error("No UID found");
        setLoading(false);
        return;
      }

      try {
        // Try userProfiles collection first (as seen in dummy.tsx)
        const userProfileRef = doc(db, "userProfiles", uid);
        const profileSnap = await getDoc(userProfileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          console.log("Fetched user data:", data); // Debug log
          
          setUserData({
            name: data.name,
            evName: data.evName,
            evModel: data.evModel,
            batteryRemaining: data.batteryRemaining,
            greenCredits: data.greenCredits,
            walletBalance: data.walletBalance,
            profilePictureUrl: data.profilePictureUrl,
            emailVerified: data.emailVerified,
            lastUpdated: data.lastUpdated,
            role: data.role,
            transactions: data.transactions
          });
          
          setBatteryRemaining(data.batteryRemaining || 0);
          setGreenCredits(data.greenCredits || 0);
        } else {
          console.warn("No user document found in userProfiles collection");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);
  // Charging simulation
  useEffect(() => {
    if (isCharging) {
      setChargingStatusMessage('Charging in progress...');
      chargeIntervalRef.current = setInterval(() => {
        setBatteryRemaining(prevBattery => {
          const kWhPerInterval = chargingRateKW / 3600; // kWh charged per second (approx)
          const percentagePerInterval = (kWhPerInterval / EV_BATTERY_CAPACITY_KWH) * 100;
          let newBattery = Math.min(prevBattery + percentagePerInterval, 100);

          const currentKWhInBattery = (prevBattery / 100) * EV_BATTERY_CAPACITY_KWH;
          const targetKWh = chargeAmountKWh + currentKWhInBattery;

          // Check if battery is full or target charge reached
          if (newBattery >= 100) {
            newBattery = 100;
            setIsCharging(false);
            setChargingStatusMessage('Charging complete! Battery Full.');
            if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
          } else if (currentKWhInBattery + kWhPerInterval >= targetKWh) {
            newBattery = (targetKWh / EV_BATTERY_CAPACITY_KWH) * 100;
            setIsCharging(false);
            setChargingStatusMessage(`Target charge (${chargeAmountKWh} kWh) reached!`);
            if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
          }

          // Update Green Credits
          setGreenCredits(prevGreenCredits => {
            const creditsEarnedThisInterval = (percentagePerInterval / 100) * 0.05 * 100;
            return prevGreenCredits + creditsEarnedThisInterval;
          });

          return newBattery;
        });
      }, 1000);
    } else {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    }

    return () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    };
  }, [isCharging, chargeAmountKWh]);

  // Calculate estimated time and cost
  useEffect(() => {
    if (chargeAmountKWh > 0 && chargingRateKW > 0) {
      const currentKWhInBattery = (batteryRemaining / 100) * EV_BATTERY_CAPACITY_KWH;
      const totalKWhRemaining = EV_BATTERY_CAPACITY_KWH - currentKWhInBattery;
      const actualChargeToApply = Math.min(chargeAmountKWh, totalKWhRemaining);

      const timeInHours = actualChargeToApply / chargingRateKW;
      setEstimatedTime(Math.round(timeInHours * 60));
      setEstimatedCost(Math.round(actualChargeToApply * costPerKWh));
    } else {
      setEstimatedTime(0);
      setEstimatedCost(0);
    }
  }, [chargeAmountKWh, batteryRemaining]);

  const getBatteryColor = (percentage: number) => {
    if (percentage > 70) return styles.batteryHigh;
    if (percentage > 30) return styles.batteryMedium;
    return styles.batteryLow;
  };

  const handleChargeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setChargeAmountKWh(isNaN(value) ? 0 : value);
  };

  const startCharging = () => {
    if (batteryRemaining >= 100) {
      setChargingStatusMessage('Battery is already full!');
      return;
    }
    if (chargeAmountKWh <= 0) {
      setChargingStatusMessage('Please enter a valid charge amount.');
      return;
    }
    const currentKWh = (batteryRemaining / 100) * EV_BATTERY_CAPACITY_KWH;
    if (currentKWh + chargeAmountKWh > EV_BATTERY_CAPACITY_KWH + 0.1) {
      setChargingStatusMessage('Desired charge exceeds battery capacity. Please reduce.');
      return;
    }

    setIsCharging(true);
    setChargingStatusMessage(`Starting charge for ${chargeAmountKWh} kWh...`);
  };

  const stopCharging = () => {
    setIsCharging(false);
    setChargingStatusMessage('Charging session manually stopped.');
  };

  const formatGreenCredits = (credits: number) => credits.toFixed(2);
if (loading) return <div className={styles.loading}>Loading user data...</div>;
  if (!userData) return <div className={styles.error}>No user data found for UID: {uid}</div>;

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>
        <FaUserCircle className={styles.icon} /> {userData.name || 'User'}'s Dashboard
      </h1>
      
      <div className={styles.infoGrid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <FaCar className={styles.icon} /> My EV
          </h2>
          <p className={styles.cardText}>{userData.evName || 'Not specified'}</p>
          {userData.evModel && <p className={styles.cardText}>Model: {userData.evModel}</p>}
        </div>

        <div className={`${styles.card} ${getBatteryColor(batteryRemaining)}`}>
          <h2 className={styles.cardTitle}>
            <FaBatteryFull className={styles.icon} /> Battery
          </h2>
          <p className={styles.cardText}>
            <span className={getBatteryColor(batteryRemaining)}>
              {batteryRemaining.toFixed(1)}%
            </span>{' '}
            Remaining
          </p>
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressBarFill} ${getBatteryColor(batteryRemaining)}Fill`}
              style={{ width: `${batteryRemaining}%` }}
            ></div>
          </div>
          <p className={styles.chargingStatus}>
            {isCharging ? (
              <>
                <FaSpinner className={styles.spinnerIcon} /> {chargingStatusMessage}
              </>
            ) : (
              chargingStatusMessage || 'Ready to charge.'
            )}
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <FaLeaf className={styles.icon} /> Green Credits
          </h2>
          <p className={styles.cardText}>
            <span className={styles.greenCreditsValue}>{formatGreenCredits(greenCredits)}</span> Credits
          </p>
          <p className={styles.subText}>Earn more by charging efficiently and using renewables!</p>
          <button className={styles.actionButton} onClick={() => alert('Redirect to Rewards Store!')}>
            <FaTrophy className={styles.buttonIcon} /> Redeem Rewards
          </button>
        </div>
      </div>

      <div className={styles.chargingControlSection}>
        <h2 className={styles.sectionTitle}>
          <FaBolt className={styles.icon} /> Charging Controls
        </h2>
        <div className={styles.chargeInputGroup}>
          <label htmlFor="chargeAmount" className={styles.inputLabel}>
            Desired Charge (kWh):
          </label>
          <input
            type="number"
            id="chargeAmount"
            value={chargeAmountKWh}
            onChange={handleChargeAmountChange}
            min="0"
            max={parseFloat((EV_BATTERY_CAPACITY_KWH * ((100 - batteryRemaining) / 100)).toFixed(1))}
            step="0.5"
            className={styles.chargeInputField}
            disabled={isCharging || batteryRemaining >= 100}
          />
        </div>
        <p className={styles.estimationText}>
          Estimated Time: {estimatedTime} mins | Estimated Cost: ₹{estimatedCost}
        </p>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.controlButton} ${styles.startButton}`}
            onClick={startCharging}
            disabled={isCharging || chargeAmountKWh <= 0 || batteryRemaining >= 100}
          >
            Start Charging
          </button>
          <button
            className={`${styles.controlButton} ${styles.stopButton}`}
            onClick={stopCharging}
            disabled={!isCharging}
          >
            Stop Charging
          </button>
        </div>
      </div>

      <div className={styles.amenitiesSection}>
        <h2 className={styles.sectionTitle}>
          <FaMapMarkerAlt className={styles.icon} /> At {nearestStationName}
        </h2>
        <h3 className={styles.subSectionTitle}>Available Amenities</h3>
        <div className={styles.amenitiesGrid}>
          {stationAmenities.map((amenity, index) => (
            <div key={index} className={styles.amenityItem}>
              {amenity === 'WiFi' && <FaWifi className={styles.amenityIcon} />}
              {amenity === 'Coffee Shop' && <FaCoffee className={styles.amenityIcon} />}
              {amenity === 'Restroom' && <FaRestroom className={styles.amenityIcon} />}
              <span className={styles.amenityText}>{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => navigate(-1)} className={styles.backButton}>
        Back to Station View
      </button>
    </div>
  );
};

export default UserSpecific;  */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { getDoc, doc, updateDoc, arrayUnion, writeBatch, increment } from "firebase/firestore";
import { db } from "../../firebase";
import toast, { Toaster } from 'react-hot-toast';
import {
    UserCircle, BatteryFull, Leaf, Bolt, Car, Trophy, MapPin, Wifi, Coffee, Wind,
    Loader, Ticket, Banknote, Power, PowerOff
} from 'lucide-react';

// --- INTERFACES ---
interface UserData {
  name?: string;
  evName?: string;
  evModel?: string;
  batteryRemaining?: number;
  greenCredits?: number;
  walletBalance?: number;
  profilePictureUrl?: string;
  emailVerified?: boolean;
  lastUpdated?: any;
  role?: string;
  transactions?: any[];
  coupons?: Coupon[];
}

interface Coupon {
  code: string;
  discount: number;
  validUntil: string;
  used: boolean;
}

const UserSpecific: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [batteryRemaining, setBatteryRemaining] = useState(0);
  const [greenCredits, setGreenCredits] = useState(0);
  const [targetPercentage, setTargetPercentage] = useState(80);
  const [isCharging, setIsCharging] = useState(false);
  const [chargingStatusMessage, setChargingStatusMessage] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const chargeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  
  // --- DYNAMIC UID FROM ROUTE ---
  const { uid } = useParams<{ uid: string }>(); // Get uid from URL, e.g., /user/:uid

  // --- CONSTANTS ---
  const EV_BATTERY_CAPACITY_KWH = 60;
  const chargingRateKW = 30;
  const costPerKWh = 16.5;
  const stationAmenities = ['WiFi', 'Coffee Shop', 'Restroom', 'Lounge Area'];
  const nearestStationName = 'Zyntra Hub'; // Made more generic

  // --- DATA FETCHING ---
  useEffect(() => {
    // If no UID is found in the URL, don't fetch data
    if (!uid) {
      console.error("No User ID provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true); // Reset loading state for new UID
      try {
        const userProfileRef = doc(db, "userProfiles", uid);
        const profileSnap = await getDoc(userProfileRef);
        if (profileSnap.exists()) {
          const data = profileSnap.data() as UserData;
          setUserData(data);
          setBatteryRemaining(data.batteryRemaining || 0);
          setGreenCredits(data.greenCredits || 0);
          setTargetPercentage(Math.max(data.batteryRemaining || 0, 80));
        } else {
          console.warn(`No user document found for UID: ${uid}`);
          setUserData(null); // Clear previous user's data
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [uid]); // Re-run this effect if the uid from the URL changes

  // --- CHARGING SIMULATION ---
  useEffect(() => {
    if (isCharging) {
      setChargingStatusMessage('Charging in progress...');
      chargeIntervalRef.current = setInterval(() => {
        setBatteryRemaining(prev => {
          const kWhPerInterval = chargingRateKW / 3600;
          const percentagePerInterval = (kWhPerInterval / EV_BATTERY_CAPACITY_KWH) * 100;
          const newBattery = Math.min(prev + percentagePerInterval, targetPercentage);
          if (newBattery >= targetPercentage) {
            setIsCharging(false);
            setChargingStatusMessage(`Charging complete!`);
            if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
            return targetPercentage;
          }
          setGreenCredits(prevCredits => prevCredits + percentagePerInterval * 0.5);
          return newBattery;
        });
      }, 1000);
    }
    return () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    };
  }, [isCharging, targetPercentage]);
  
  // --- ESTIMATION CALCULATION ---
  useEffect(() => {
    if (targetPercentage > batteryRemaining) {
      const percentageToCharge = targetPercentage - batteryRemaining;
      const kWhToCharge = (percentageToCharge / 100) * EV_BATTERY_CAPACITY_KWH;
      const timeInHours = kWhToCharge / chargingRateKW;
      const cost = kWhToCharge * costPerKWh;
      setEstimatedTime(Math.round(timeInHours * 60));
      setEstimatedCost(cost);
      setFinalPrice(cost);
      setCouponCode('');
      setCouponDiscount(0);
    } else {
      setEstimatedTime(0);
      setEstimatedCost(0);
      setFinalPrice(0);
    }
  }, [targetPercentage, batteryRemaining]);

  // --- HELPER FUNCTIONS ---
  const getBatteryStyling = (percentage: number) => {
    if (percentage > 70) return { text: 'text-green-400', bg: 'bg-green-500' };
    if (percentage > 30) return { text: 'text-amber-400', bg: 'bg-amber-500' };
    return { text: 'text-red-500', bg: 'bg-red-600' };
  };
  const handleTargetPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTargetPercentage(isNaN(value) ? 0 : value);
  };
  const startPaymentProcess = () => {
    if (targetPercentage <= batteryRemaining) {
      toast.error('Please set a higher target percentage.');
      return;
    }
    setPaymentModalOpen(true);
  };

  const confirmPayment = async () => {
    if (!uid) return; // Safety check
    setPaymentModalOpen(false);
    setIsCharging(true);
    setChargingStatusMessage(`Initializing charge...`);
    const kWhCharged = ((targetPercentage - batteryRemaining) / 100 * EV_BATTERY_CAPACITY_KWH);
    try {
      const userProfileRef = doc(db, "userProfiles", uid);
      const batch = writeBatch(db);
      batch.update(userProfileRef, {
        transactions: arrayUnion({
          date: new Date().toISOString(), amount: finalPrice, kWh: kWhCharged, station: nearestStationName,
          couponUsed: couponCode || null, discountApplied: couponDiscount
        }),
        ...(couponCode && {
          coupons: userData?.coupons?.map(c => c.code === couponCode ? {...c, used: true} : c)
        })
      });
      await batch.commit();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to save transaction.");
    }
  };

  const generateCoupon = async () => {
    if (!uid || !userData || greenCredits < 100) { toast.error('You need at least 100 Green Credits!'); return; }
    const code = `ZYNTRA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const discount = Math.floor(Math.random() * 10) + 5;
    const validUntil = new Date(); validUntil.setDate(validUntil.getDate() + 30);
    const newCoupon = { code, discount, validUntil: validUntil.toISOString(), used: false };
    try {
      const userProfileRef = doc(db, "userProfiles", uid);
      await updateDoc(userProfileRef, {
        coupons: arrayUnion(newCoupon),
        greenCredits: increment(-100)
      });
      setUserData(prev => prev ? { ...prev, coupons: [...(prev.coupons || []), newCoupon], greenCredits: (prev.greenCredits || 0) - 100 } : null);
      setGreenCredits(prev => prev - 100);
      setCouponModalOpen(true);
    } catch (error) {
      console.error("Error generating coupon:", error);
      toast.error("Could not generate coupon.");
    }
  };

  const applyCoupon = () => {
    if (!couponCode) return;
    const coupon = userData?.coupons?.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && !c.used && new Date(c.validUntil) > new Date());
    if (coupon) {
      const discountAmount = (estimatedCost * coupon.discount) / 100;
      setFinalPrice(estimatedCost - discountAmount);
      setCouponDiscount(coupon.discount);
      toast.success(`Coupon applied! ${coupon.discount}% discount.`);
    } else {
      toast.error('Invalid or expired coupon code.');
    }
  };

  const stopCharging = () => {
    setIsCharging(false);
    if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    setChargingStatusMessage('Charging manually stopped.');
  };
  
  // --- RENDER LOGIC ---
  if (loading) return <div className="flex items-center justify-center h-screen bg-black text-green-400"><Loader className="animate-spin mr-3" />Loading Dashboard...</div>;
  if (!uid || !userData) return <div className="flex items-center justify-center h-screen bg-black text-red-500">Could not load user data. Please check the user ID.</div>;

  const batteryStyle = getBatteryStyling(batteryRemaining);

  return (
    <div className="min-h-screen bg-black text-green-400 font-sans p-4 sm:p-6 lg:p-8">
      <Toaster 
        position="top-center"
        toastOptions={{
            style: {
                background: '#111827',
                color: '#4ade80',
                border: '1px solid #1f2937',
            },
        }}
      />
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-green-800/50">
            <h3 className="text-2xl font-bold text-green-200 mb-4">Confirm Your Session</h3>
            <div className="space-y-3 text-green-300">
              <p className="flex justify-between">Target: <span className="font-semibold text-white">{targetPercentage}%</span></p>
              <p className="flex justify-between">Est. Cost: <span className="font-semibold text-white">₹{estimatedCost.toFixed(2)}</span></p>
              <div className="flex space-x-2">
                <input type="text" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-grow bg-gray-800 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none text-green-300 placeholder-green-700"/>
                <button onClick={applyCoupon} className="px-4 py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-600 transition">Apply</button>
              </div>
              <hr className="border-gray-700 my-4" />
              <p className={`flex justify-between text-xl font-bold ${couponDiscount > 0 ? 'text-green-400' : 'text-white'}`}>
                Final Price: <span>₹{finalPrice.toFixed(2)}</span>
                {couponDiscount > 0 && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">{couponDiscount}% OFF</span>}
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setPaymentModalOpen(false)} className="px-5 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white font-semibold transition">Cancel</button>
              <button onClick={confirmPayment} className="px-5 py-2 rounded-md bg-green-500 hover:bg-green-400 text-black font-bold transition">Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}
      {couponModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-green-800/50 text-center">
            <h3 className="text-2xl font-bold text-green-200 mb-2">Coupon Generated!</h3>
            <p className="text-green-500 mb-4">You've redeemed 100 Green Credits.</p>
            <div className="bg-black border-2 border-dashed border-green-500 rounded-lg p-6">
              <Ticket className="mx-auto text-green-400 h-12 w-12" />
              <p className="text-3xl font-bold tracking-widest text-white my-2">{userData.coupons?.[userData.coupons.length - 1]?.code}</p>
              <p className="text-lg font-semibold text-green-400">{userData.coupons?.[userData.coupons.length - 1]?.discount}% discount</p>
              <p className="text-sm text-green-700 mt-2">Valid until: {new Date(userData.coupons?.[userData.coupons.length - 1]?.validUntil || '').toLocaleDateString()}</p>
            </div>
            <button onClick={() => setCouponModalOpen(false)} className="mt-6 w-full px-5 py-2 rounded-md bg-green-500 hover:bg-green-400 text-black font-bold transition">Close</button>
          </div>
        </div>
      )}

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-green-200 flex items-center mb-4 sm:mb-0">
          <UserCircle className="mr-3 text-green-400" />
          {userData.name}'s Dashboard
        </h1>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-green-900 text-green-300 font-semibold rounded-lg transition">Back to Station</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900/50 border border-green-900/70 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-green-200 flex items-center mb-4"><Bolt className="mr-3 text-green-400"/>Charging Controls</h2>
            <div className="space-y-4">
              <label htmlFor="targetPercentage" className="block text-sm font-medium text-green-500">Target Battery Level: <span className="font-bold text-white">{targetPercentage}%</span></label>
              <input type="range" id="targetPercentage" value={targetPercentage} onChange={handleTargetPercentageChange} min={Math.ceil(batteryRemaining)} max="100" step="1" className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500 disabled:opacity-50" disabled={isCharging}/>
            </div>
            <p className="text-sm text-center text-green-600 my-4">Est. Time: <span className="font-semibold text-white">{estimatedTime} mins</span> | Est. Cost: <span className="font-semibold text-white">₹{estimatedCost.toFixed(2)}</span></p>
            <div className="flex space-x-4">
              <button onClick={startPaymentProcess} disabled={isCharging || targetPercentage <= batteryRemaining} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"><Power size={20}/>Start Session</button>
              <button onClick={stopCharging} disabled={!isCharging} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-600/80 text-white font-bold rounded-lg hover:bg-red-600 transition disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"><PowerOff size={20}/>Stop Session</button>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-green-900/70 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-green-200 flex items-center mb-4"><MapPin className="mr-3 text-green-400"/>At {nearestStationName}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {stationAmenities.map(amenity => (
                <div key={amenity} className="bg-gray-800/50 p-3 rounded-lg flex flex-col items-center justify-center">
                  {amenity === 'WiFi' && <Wifi className="h-6 w-6 mb-2 text-green-400"/>}
                  {amenity === 'Coffee Shop' && <Coffee className="h-6 w-6 mb-2 text-green-400"/>}
                  {amenity === 'Restroom' && <Wind className="h-6 w-6 mb-2 text-green-400"/>}
                  {amenity === 'Lounge Area' && <Banknote className="h-6 w-6 mb-2 text-green-400"/>}
                  <span className="text-xs font-medium text-green-500">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`bg-gray-900/50 border border-green-900/70 rounded-2xl p-6 shadow-lg`}>
            <h2 className="text-xl font-bold text-green-200 flex items-center mb-2"><BatteryFull className="mr-3 text-green-400"/>Battery Status</h2>
            <div className="text-center my-4">
              <p className={`text-6xl font-bold ${batteryStyle.text}`}>{batteryRemaining.toFixed(1)}<span className="text-4xl">%</span></p>
              <p className="text-sm text-green-600">{chargingStatusMessage || 'Ready to Charge'}</p>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 mb-2 overflow-hidden"><div className={`h-4 rounded-full ${batteryStyle.bg} transition-all duration-500`} style={{ width: `${batteryRemaining}%` }}></div></div>
          </div>
          
          <div className="bg-gray-900/50 border border-green-900/70 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-green-200 flex items-center mb-4"><Car className="mr-3 text-green-400"/>My EV</h2>
            <p className="text-lg font-semibold text-green-300">{userData.evName || 'N/A'}</p>
            <p className="text-sm text-green-500">{userData.evModel || 'Model not specified'}</p>
          </div>
          <div className="bg-gray-900/50 border border-green-900/70 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-green-200 flex items-center mb-2"><Leaf className="mr-3 text-green-400"/>Green Credits</h2>
            <p className="text-3xl font-bold text-white">{greenCredits.toFixed(2)}</p>
            <p className="text-xs text-green-600 mb-4">Earned from eco-friendly charging.</p>
            <button onClick={generateCoupon} disabled={greenCredits < 100} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-900/50 text-green-300 font-bold rounded-lg hover:bg-green-800/80 hover:text-white transition disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed"><Trophy size={16}/>Redeem (100)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSpecific;