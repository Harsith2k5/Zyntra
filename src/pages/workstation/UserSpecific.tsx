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
import React, { useState, useEffect, useRef } from 'react';
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

export default UserSpecific; 
/* import React, { useState, useEffect, useRef } from 'react';
import styles from './UserSpecific.module.css';
import {
  FaUserCircle,
  FaExclamationTriangle,
  FaLightbulb,
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
  FaPercentage,
  FaMoneyBillWave,
  FaTicketAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc, arrayUnion,writeBatch,increment } from "firebase/firestore";
import { db } from "../../firebase";
import axios from 'axios';

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
  // State management
  const [batteryRemaining, setBatteryRemaining] = useState(0);
  const [greenCredits, setGreenCredits] = useState(0);
  const [chargeAmountKWh, setChargeAmountKWh] = useState(0);
  const [targetPercentage, setTargetPercentage] = useState(0);
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
  const [aiAdvice, setAiAdvice] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [personalizedSuggestions, setPersonalizedSuggestions] = useState<string[]>([]);
  const [batteryStatus, setBatteryStatus] = useState('');
  const [hasActiveCoupons, setHasActiveCoupons] = useState(false);
  const [canRedeemCredits, setCanRedeemCredits] = useState(false);
  const chargeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Constants
  const EV_BATTERY_CAPACITY_KWH = 60;
  const chargingRateKW = 30;
  const costPerKWh = 16.5;
  const stationAmenities = ['WiFi', 'Coffee Shop', 'Restroom', 'Snack Vending', 'Lounge Area'];
  const nearestStationName = 'Zyntra Charging Hub - Race Course Rd, Coimbatore';

  // Hardcoded UID
  const uid = "qtgxKvayiNUiroFGySFfxbN5GMG2";

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfileRef = doc(db, "userProfiles", uid);
        const profileSnap = await getDoc(userProfileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          console.log("Fetched user data:", data);
          
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
            transactions: data.transactions,
            coupons: data.coupons || []
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
  }, []);

  // Get AI charging advice
  useEffect(() => {
  const fetchPersonalizedSuggestions = async () => {
    if (!userData) return;
    
    try {
      const response = await axios.post('http://localhost:5501/personalized_suggestions', {
        battery_percent: batteryRemaining,
        wallet_balance: userData.walletBalance || 0,
        coupons: userData.coupons || [],
        green_credits: greenCredits,
        ev_model: userData.evModel || ''
      });
      
      setPersonalizedSuggestions(response.data.suggestions);
      setBatteryStatus(response.data.battery_status);
      setHasActiveCoupons(response.data.has_active_coupons);
      setCanRedeemCredits(response.data.can_redeem_credits);
    } catch (error) {
      console.error("Error fetching personalized suggestions:", error);
    }
  };

  fetchPersonalizedSuggestions();
}, [userData, batteryRemaining, greenCredits]);
  useEffect(() => {
    const getChargingAdvice = async () => {
      if (!userData?.evName || !userData?.evModel || batteryRemaining === 0) return;
      
      setAiLoading(true);
      try {
        const response = await axios.post('http://localhost:5501/ai_recommendation', {
          user_lat: 11.0168,  // Sample Coimbatore coordinates
          user_lng: 76.9558,
          battery_percent: batteryRemaining,
          ev_name: userData.evName,
          ev_model: userData.evModel
        });
        setAiAdvice(response.data.recommendation);
      } catch (error) {
        console.error("Error getting AI advice:", error);
        setAiAdvice("Unable to load charging advice at this time. Try again later.");
      } finally {
        setAiLoading(false);
      }
    };

    getChargingAdvice();
  }, [batteryRemaining, userData?.evName, userData?.evModel]);

  // Charging simulation
  useEffect(() => {
    if (isCharging) {
      setChargingStatusMessage('Charging in progress...');
      chargeIntervalRef.current = setInterval(() => {
        setBatteryRemaining(prevBattery => {
          const kWhPerInterval = chargingRateKW / 3600;
          const percentagePerInterval = (kWhPerInterval / EV_BATTERY_CAPACITY_KWH) * 100;
          let newBattery = Math.min(prevBattery + percentagePerInterval, targetPercentage);

          if (newBattery >= targetPercentage) {
            newBattery = targetPercentage;
            setIsCharging(false);
            setChargingStatusMessage(`Charging complete! Reached ${targetPercentage}%`);
            if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
          }

          setGreenCredits(prev => prev + (percentagePerInterval / 100) * 0.05 * 100);
          return newBattery;
        });
      }, 1000);
    }

    return () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    };
  }, [isCharging, targetPercentage]);

  // Calculate estimated time and cost
  useEffect(() => {
    if (targetPercentage > batteryRemaining) {
      const percentageToCharge = targetPercentage - batteryRemaining;
      const kWhToCharge = (percentageToCharge / 100) * EV_BATTERY_CAPACITY_KWH;
      
      const timeInHours = kWhToCharge / chargingRateKW;
      setEstimatedTime(Math.round(timeInHours * 60));
      setEstimatedCost(parseFloat((kWhToCharge * costPerKWh).toFixed(2)));
      setFinalPrice(parseFloat((kWhToCharge * costPerKWh).toFixed(2)));
    } else {
      setEstimatedTime(0);
      setEstimatedCost(0);
      setFinalPrice(0);
    }
  }, [targetPercentage, batteryRemaining]);

  // Helper functions
  const getBatteryColor = (percentage: number) => {
    if (percentage > 70) return styles.batteryHigh;
    if (percentage > 30) return styles.batteryMedium;
    return styles.batteryLow;
  };

  const handleTargetPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTargetPercentage(isNaN(value) ? 0 : Math.min(Math.max(value, batteryRemaining), 100));
  };

  const handleChargeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setChargeAmountKWh(isNaN(value) ? 0 : value);
    // Auto-calculate target percentage based on kWh input
    const newPercentage = ((value + (batteryRemaining / 100 * EV_BATTERY_CAPACITY_KWH)) / EV_BATTERY_CAPACITY_KWH) * 100;
    setTargetPercentage(Math.min(newPercentage, 100));
  };

  const startPaymentProcess = () => {
    if (batteryRemaining >= 100) {
      setChargingStatusMessage('Battery is already full!');
      return;
    }
    if (targetPercentage <= batteryRemaining) {
      setChargingStatusMessage('Please set a valid target percentage.');
      return;
    }
    
    setPaymentModalOpen(true);
  };

  const confirmPayment = async () => {
    // In a real app, this would process payment
    // For now, we'll just simulate it
    setPaymentModalOpen(false);
    setIsCharging(true);
    setChargingStatusMessage(`Starting charge to ${targetPercentage}%...`);
    
    // Calculate the kWh charged
    const kWhCharged = ((targetPercentage - batteryRemaining) / 100 * EV_BATTERY_CAPACITY_KWH).toFixed(2);
    const transactionAmount = finalPrice;
    
    try {
      const userProfileRef = doc(db, "userProfiles", uid);
      const stationRef = doc(db, "stations", "zyntra_user_location");
      
      // Batch write to update both documents atomically
      const batch = writeBatch(db);
      
      // Add transaction to user profile
      batch.update(userProfileRef, {
        transactions: arrayUnion({
          date: new Date().toISOString(),
          amount: transactionAmount,
          kWh: kWhCharged,
          station: nearestStationName,
          couponUsed: couponCode || null,
          discountApplied: couponDiscount
        }),
        ...(couponCode && {
          coupons: userData?.coupons?.map(coupon => 
            coupon.code === couponCode ? {...coupon, used: true} : coupon
          )
        })
      });
      
      // Update station revenue
      batch.update(stationRef, {
        revenue: arrayUnion({
          amount: transactionAmount,
          date: new Date().toISOString(),
          userId: uid,
          kWh: kWhCharged
        }),
        totalRevenue: increment(transactionAmount) // This creates or increments the totalRevenue field
      });
      
      await batch.commit();
      
    } catch (error) {
      console.error("Error updating transaction and revenue:", error);
    }
    
    // Reset coupon
    setCouponCode('');
    setCouponDiscount(0);
};

  const generateCoupon = async () => {
    if (greenCredits < 100) {
      alert('You need at least 100 Green Credits to generate a coupon!');
      return;
    }
    
    // Generate a random coupon code
    const code = `ZYNTRA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const discount = Math.floor(Math.random() * 15) + 5; // 5-20% discount
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); // Valid for 30 days
    
    try {
      const userProfileRef = doc(db, "userProfiles", uid);
      await updateDoc(userProfileRef, {
        coupons: arrayUnion({
          code,
          discount,
          validUntil: validUntil.toISOString(),
          used: false
        }),
        greenCredits: greenCredits - 100 // Deduct credits
      });
      
      setUserData(prev => prev ? {
        ...prev,
        coupons: [...(prev.coupons || []), {
          code,
          discount,
          validUntil: validUntil.toISOString(),
          used: false
        }],
        greenCredits: greenCredits - 100
      } : null);
      
      setGreenCredits(prev => prev - 100);
      setCouponModalOpen(true);
    } catch (error) {
      console.error("Error generating coupon:", error);
    }
  };

  const applyCoupon = () => {
    if (!couponCode) return;
    
    const coupon = userData?.coupons?.find(c => 
      c.code === couponCode && !c.used && new Date(c.validUntil) > new Date()
    );
    
    if (coupon) {
      const discountAmount = (estimatedCost * coupon.discount) / 100;
      setFinalPrice(parseFloat((estimatedCost - discountAmount).toFixed(2)));
      setCouponDiscount(coupon.discount);
      alert(`Coupon applied! ${coupon.discount}% discount (₹${discountAmount.toFixed(2)})`);
    } else {
      alert('Invalid or expired coupon code');
    }
  };

  const stopCharging = () => {
    setIsCharging(false);
    if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    setChargingStatusMessage('Charging session manually stopped.');
  };

  const formatGreenCredits = (credits: number) => credits.toFixed(2);

  // Loading and error states
  if (loading) return <div className={styles.loading}>Loading user data...</div>;
  if (!userData) return <div className={styles.error}>No user data found for UID: {uid}</div>;

  return (
    <div className={styles.dashboardContainer}>
    
      {paymentModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Payment</h3>
            <div className={styles.paymentDetails}>
              <p>Charging to: {targetPercentage}%</p>
              <p>Estimated Cost: ₹{estimatedCost.toFixed(2)}</p>
              
              {userData.coupons?.some(c => !c.used) && (
                <div className={styles.couponSection}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={styles.couponInput}
                  />
                  <button 
                    onClick={applyCoupon}
                    className={styles.applyCouponButton}
                  >
                    Apply Coupon
                  </button>
                </div>
              )}
              
              <p className={styles.finalPrice}>
                Final Price: <span>₹{finalPrice.toFixed(2)}</span>
                {couponDiscount > 0 && (
                  <span className={styles.discountBadge}>{couponDiscount}% OFF</span>
                )}
              </p>
            </div>
            
            <div className={styles.modalButtons}>
              <button 
                onClick={() => setPaymentModalOpen(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                onClick={confirmPayment}
                className={styles.confirmButton}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
      
      {couponModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Coupon Generated!</h3>
            <div className={styles.couponDisplay}>
              <FaTicketAlt className={styles.couponIcon} />
              <p className={styles.couponCode}>
                {userData.coupons?.[userData.coupons.length - 1]?.code}
              </p>
              <p>
                {userData.coupons?.[userData.coupons.length - 1]?.discount}% discount
              </p>
              <p className={styles.validUntil}>
                Valid until: {new Date(userData.coupons?.[userData.coupons.length - 1]?.validUntil || '').toLocaleDateString()}
              </p>
            </div>
            <button 
              onClick={() => setCouponModalOpen(false)}
              className={styles.closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <h1 className={styles.dashboardTitle}>
        <FaUserCircle className={styles.icon} /> {userData.name || 'User'}'s Dashboard
      </h1>
      
      <div className={styles.aiAdviceCard}>
        <h3 className={styles.aiAdviceTitle}>
          <FaBolt className={styles.icon} /> Smart Charging Advice
        </h3>
        {aiLoading ? (
          <div className={styles.loadingAdvice}>
            <FaSpinner className={styles.spinner} /> Analyzing your charging needs...
          </div>
        ) : (
          <p className={styles.aiAdviceText}>{aiAdvice || "No advice available at this time."}</p>
        )}
      </div>
      <div className={styles.suggestionsCard}>
  <h3 className={styles.suggestionsTitle}>
    <FaLightbulb className={styles.icon} /> Smart Recommendations
  </h3>
  
  {batteryStatus === 'critical' && (
    <div className={styles.urgentAlert}>
      <FaExclamationTriangle /> Your battery is critically low! Charge immediately.
    </div>
  )}
  
  <ul className={styles.suggestionsList}>
    {personalizedSuggestions.map((suggestion, index) => (
      <li key={index} className={styles.suggestionItem}>
        {suggestion.includes("⚡") ? suggestion : `⚡ ${suggestion}`}
      </li>
    ))}
  </ul>
  
  <div className={styles.suggestionActions}>
    {hasActiveCoupons && (
      <button 
        className={styles.suggestionAction}
        onClick={() => setCouponModalOpen(true)}
      >
        <FaTicketAlt /> View Coupons
      </button>
    )}
    
    {canRedeemCredits && (
      <button 
        className={styles.suggestionAction}
        onClick={generateCoupon}
      >
        <FaLeaf /> Redeem Credits
      </button>
    )}
  </div>
</div>
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
            <FaBatteryFull className={styles.icon} /> Battery Status
          </h2>
          <p className={styles.cardText}>
            <span className={getBatteryColor(batteryRemaining)}>
              {batteryRemaining.toFixed(1)}%
            </span> Remaining
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
          <button 
            className={styles.actionButton} 
            onClick={generateCoupon}
disabled={greenCredits < 100}
>
<FaTrophy className={styles.buttonIcon} /> Redeem Rewards (100 Credits)
</button>
</div>
</div>
  <div className={styles.chargingControlSection}>
    <h2 className={styles.sectionTitle}>
      <FaBolt className={styles.icon} /> Charging Controls
    </h2>
    
    <div className={styles.chargeInputGroup}>
      <label htmlFor="targetPercentage" className={styles.inputLabel}>
        Target Battery Level (%):
      </label>
      <input
        type="range"
        id="targetPercentage"
        value={targetPercentage}
        onChange={handleTargetPercentageChange}
        min={batteryRemaining}
        max="100"
        step="1"
        className={styles.percentageSlider}
        disabled={isCharging || batteryRemaining >= 100}
      />
      <div className={styles.percentageValue}>
        <FaPercentage className={styles.percentageIcon} />
        <span>{targetPercentage}%</span>
      </div>
    </div>

    <div className={styles.chargeInputGroup}>
      <label htmlFor="chargeAmount" className={styles.inputLabel}>
        Or Enter kWh to Add:
      </label>
      <input
        type="number"
        id="chargeAmount"
        value={chargeAmountKWh}
        onChange={handleChargeAmountChange}
        min="0"
        max={parseFloat(((EV_BATTERY_CAPACITY_KWH * ((100 - batteryRemaining) / 100)).toFixed(1)))}

        step="0.5"
        className={styles.chargeInputField}
        disabled={isCharging || batteryRemaining >= 100}
      />
    </div>

    <p className={styles.estimationText}>
      Estimated Time: {estimatedTime} mins | Estimated Cost: ₹{estimatedCost.toFixed(2)}
    </p>

    <div className={styles.buttonGroup}>
      <button
        className={`${styles.controlButton} ${styles.startButton}`}
        onClick={startPaymentProcess}
        disabled={isCharging || targetPercentage <= batteryRemaining || batteryRemaining >= 100}
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

  {userData.coupons?.some(c => !c.used) && (
    <div className={styles.couponsSection}>
      <h2 className={styles.sectionTitle}>
        <FaTicketAlt className={styles.icon} /> Your Active Coupons
      </h2>
      <div className={styles.couponsGrid}>
        {userData.coupons
          .filter(coupon => !coupon.used && new Date(coupon.validUntil) > new Date())
          .map((coupon, index) => (
            <div key={index} className={styles.couponCard}>
              <div className={styles.couponHeader}>
                <FaTicketAlt className={styles.couponIcon} />
                <span className={styles.couponDiscount}>{coupon.discount}% OFF</span>
              </div>
              <div className={styles.couponBody}>
                <p className={styles.couponCode}>{coupon.code}</p>
                <p className={styles.couponValid}>
                  Valid until: {new Date(coupon.validUntil).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )}

  <button onClick={() => navigate(-1)} className={styles.backButton}>
    Back to Station View
  </button>
</div>
);
};

export default UserSpecific; */