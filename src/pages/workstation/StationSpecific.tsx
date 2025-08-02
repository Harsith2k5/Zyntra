import React from 'react';
import styles from './StationSpecific.module.css';
import {
  FaBatteryFull,
  FaTools,
  FaHeartbeat,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaClock,
  FaPlug,
  FaInfoCircle
} from 'react-icons/fa';

interface BatteryInfo {
  type: string;
  capacity: string;
  health: string;
  installedDate: string;
}

interface Hazard {
  type: string;
  severity: 'low' | 'medium' | 'high';
  detectedAt: string;
}

interface StationData {
  name: string;
  location: string;
  lastMaintenance: string;
  currentHealth: string;
  batteries: BatteryInfo[];
  hazards: Hazard[];
}

const StationSpecific: React.FC = () => {
  // Dummy station data
  const stationData: StationData = {
    name: "Zyntra Charging Hub - Race Course Rd",
    location: "Race Course Rd, Coimbatore, Tamil Nadu 641018",
    lastMaintenance: "2023-10-15",
    currentHealth: "Excellent",
    batteries: [
      {
        type: "Lithium-Ion (LiFePO4)",
        capacity: "100 kWh",
        health: "92%",
        installedDate: "2022-05-10"
      },
      {
        type: "Lithium-Ion (NMC)",
        capacity: "150 kWh",
        health: "87%",
        installedDate: "2021-11-22"
      }
    ],
    hazards: [
      {
        type: "Overheating detected",
        severity: "medium",
        detectedAt: "2023-11-05 14:30"
      },
      {
        type: "Voltage fluctuation",
        severity: "low",
        detectedAt: "2023-11-01 09:15"
      }
    ]
  };

  const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case 'excellent':
        return styles.healthExcellent;
      case 'good':
        return styles.healthGood;
      case 'fair':
        return styles.healthFair;
      case 'poor':
        return styles.healthPoor;
      default:
        return styles.healthExcellent;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return styles.severityHigh;
      case 'medium':
        return styles.severityMedium;
      case 'low':
        return styles.severityLow;
      default:
        return styles.severityLow;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>
        <FaPlug className={styles.icon} /> {stationData.name}
      </h1>
      
      <div className={styles.infoGrid}>
        {/* Location Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <FaMapMarkerAlt className={styles.icon} /> Location
          </h2>
          <p className={styles.cardText}>{stationData.location}</p>
          <div className={styles.mapPlaceholder}>
            {/* In a real app, you would embed a map here */}
            <FaMapMarkerAlt className={styles.mapIcon} />
            <p>Map View</p>
          </div>
        </div>

        {/* Health Card */}
        <div className={`${styles.card} ${getHealthColor(stationData.currentHealth)}`}>
          <h2 className={styles.cardTitle}>
            <FaHeartbeat className={styles.icon} /> Current Health
          </h2>
          <p className={styles.cardText}>{stationData.currentHealth}</p>
          <div className={styles.healthIndicator}>
            <div className={styles.healthBar}>
              <div 
                className={styles.healthBarFill}
                style={{ width: '92%' }} // This would be dynamic in a real app
              ></div>
            </div>
          </div>
          <p className={styles.subText}>Last system check: Today, 08:45 AM</p>
        </div>

        {/* Maintenance Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <FaTools className={styles.icon} /> Maintenance
          </h2>
          <p className={styles.cardText}>Last Maintenance</p>
          <p className={styles.maintenanceDate}>{stationData.lastMaintenance}</p>
          <p className={styles.subText}>Next scheduled: 2023-12-15</p>
          <button className={styles.actionButton}>
            Request Maintenance
          </button>
        </div>
      </div>

      {/* Batteries Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FaBatteryFull className={styles.icon} /> Battery Systems
        </h2>
        <div className={styles.batteriesGrid}>
          {stationData.batteries.map((battery, index) => (
            <div key={index} className={styles.batteryCard}>
              <h3 className={styles.batteryTitle}>Battery #{index + 1}</h3>
              <div className={styles.batteryInfo}>
                <div className={styles.batteryInfoItem}>
                  <span className={styles.infoLabel}>Type:</span>
                  <span>{battery.type}</span>
                </div>
                <div className={styles.batteryInfoItem}>
                  <span className={styles.infoLabel}>Capacity:</span>
                  <span>{battery.capacity}</span>
                </div>
                <div className={styles.batteryInfoItem}>
                  <span className={styles.infoLabel}>Health:</span>
                  <span className={styles.batteryHealth}>{battery.health}</span>
                </div>
                <div className={styles.batteryInfoItem}>
                  <span className={styles.infoLabel}>Installed:</span>
                  <span>{battery.installedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hazards Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FaExclamationTriangle className={styles.icon} /> Detected Hazards
        </h2>
        {stationData.hazards.length > 0 ? (
          <div className={styles.hazardsList}>
            {stationData.hazards.map((hazard, index) => (
              <div key={index} className={`${styles.hazardItem} ${getSeverityColor(hazard.severity)}`}>
                <div className={styles.hazardHeader}>
                  <span className={styles.hazardType}>{hazard.type}</span>
                  <span className={styles.hazardSeverity}>{hazard.severity}</span>
                </div>
                <div className={styles.hazardDetails}>
                  <FaClock className={styles.hazardIcon} />
                  <span>Detected: {hazard.detectedAt}</span>
                </div>
                <div className={styles.hazardActions}>
                  <button className={styles.hazardButton}>Acknowledge</button>
                  <button className={styles.hazardButton}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noHazards}>
            <FaInfoCircle className={styles.infoIcon} />
            <p>No hazards detected. All systems operational.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationSpecific;