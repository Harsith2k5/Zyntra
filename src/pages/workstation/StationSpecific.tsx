import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
    Plug, MapPin, HeartPulse, Wrench, BatteryFull, AlertTriangle, Info, Clock,
    Loader
} from 'lucide-react';

// --- INTERFACES ---
interface BatteryInfo {
  type: string;
  capacity: string;
  health: number; // Changed to number for easier processing
  installedDate: string;
}

interface Hazard {
  type: string;
  severity: 'low' | 'medium' | 'high';
  detectedAt: string;
}

interface StationData {
  id: string;
  name: string;
  location: string;
  coords: { lat: number, lng: number };
  lastMaintenance: string;
  nextMaintenance: string;
  currentHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  healthPercent: number;
  batteries: BatteryInfo[];
  hazards: Hazard[];
}

const StationSpecific: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<string>("Fetching location...");
  
  const { stationId } = useParams<{ stationId: string }>(); // Get station ID from URL
  const navigate = useNavigate();
  
  // --- GOOGLE MAPS API KEY ---
  // IMPORTANT: Replace with your actual Google Maps API Key
  const Maps_API_KEY = "AIzaSyAR4pDTfDDN0kCVF5FuiP4m69bankC_vCE";

  // --- MOCK DATA FETCHING & LOCATION ---
  useEffect(() => {
    // 1. Fetch Geolocation and Reverse Geocode
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        if (Maps_API_KEY === "AIzaSyAR4pDTfDDN0kCVF5FuiP4m69bankC_vCE") {
            console.warn("Google Maps API Key is missing. Using coordinates as location.");
            setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } else {
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Maps_API_KEY}`);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    setCurrentLocation(data.results[0].formatted_address);
                } else {
                    setCurrentLocation("Address not found.");
                }
            } catch (error) {
                console.error("Error reverse geocoding:", error);
                setCurrentLocation("Could not fetch address.");
            }
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        setCurrentLocation("Location access denied.");
      });
    } else {
        setCurrentLocation("Geolocation not supported.");
    }
    
    // 2. Simulate fetching station-specific data from a database
    const fetchStationData = () => {
        // In a real app, you would fetch from Firestore using the `stationId`
        // For now, we use detailed mock data.
        const today = new Date("2025-08-05T04:20:31Z"); // Using current time for relevance
        const lastMaintDate = new Date(today);
        lastMaintDate.setDate(today.getDate() - 28);
        const nextMaintDate = new Date(today);
        nextMaintDate.setDate(today.getDate() + 62);

        const mockData: StationData = {
            id: stationId || "ZYN-CBE-01",
            name: "Zyntra Charging Hub",
            location: "Race Course Rd, Coimbatore, Tamil Nadu 641018",
            coords: { lat: 11.0029, lng: 76.9681 },
            lastMaintenance: lastMaintDate.toISOString().split('T')[0],
            nextMaintenance: nextMaintDate.toISOString().split('T')[0],
            currentHealth: "Excellent",
            healthPercent: 92,
            batteries: [
              { type: "LiFePO4", capacity: "100 kWh", health: 92, installedDate: "2024-05-10" },
              { type: "NMC", capacity: "150 kWh", health: 87, installedDate: "2023-11-22" }
            ],
            hazards: [
              { type: "High Internal Temperature", severity: "medium", detectedAt: new Date(today.getTime() - 3 * 60 * 60 * 1000).toLocaleString() },
              { type: "Minor Voltage Fluctuation", severity: "low", detectedAt: new Date(today.getTime() - 24 * 60 * 60 * 1000).toLocaleString() }
            ]
        };
        setStationData(mockData);
        setLoading(false);
    };
    
    fetchStationData();
  }, [stationId]);

  // --- HELPER FUNCTIONS FOR STYLING ---
  const getHealthStyling = (health: string) => {
    switch (health.toLowerCase()) {
      case 'excellent': return 'text-green-400 border-green-500/50 bg-green-500/10';
      case 'good': return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
      case 'fair': return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
      case 'poor': return 'text-red-400 border-red-500/50 bg-red-500/10';
      default: return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
    }
  };

  const getSeverityStyling = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return { border: 'border-red-500/50', bg: 'bg-red-500/10', text: 'text-red-400', icon: 'bg-red-500' };
      case 'medium': return { border: 'border-amber-500/50', bg: 'bg-amber-500/10', text: 'text-amber-400', icon: 'bg-amber-500' };
      case 'low': return { border: 'border-yellow-500/50', bg: 'bg-yellow-500/10', text: 'text-yellow-400', icon: 'bg-yellow-500' };
      default: return { border: 'border-gray-500/50', bg: 'bg-gray-500/10', text: 'text-gray-400', icon: 'bg-gray-500' };
    }
  };

  const handleAcknowledge = (hazardType: string) => {
    toast.success(`Acknowledged: ${hazardType}`);
  };

  const handleRequestMaintenance = () => {
    toast.loading('Submitting maintenance ticket...');
    setTimeout(() => {
        toast.dismiss();
        toast.success('Maintenance ticket submitted successfully!');
    }, 2000);
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-black text-green-400"><Loader className="animate-spin mr-3" />Loading Station Data...</div>;
  if (!stationData) return <div className="flex items-center justify-center h-screen bg-black text-red-500">Could not load data for this station.</div>;

  return (
    <div className="min-h-screen bg-black text-green-400 font-sans p-4 sm:p-6 lg:p-8">
      <Toaster position="top-center" toastOptions={{ style: { background: '#111827', color: '#4ade80', border: '1px solid #1f2937' } }} />
      
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-green-200 flex items-center">
                <Plug className="mr-3 text-green-400" />
                {stationData.name}
            </h1>
            <p className="text-green-600 ml-10">{stationData.id}</p>
        </div>
        <button onClick={() => navigate(-1)} className="mt-4 sm:mt-0 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-green-900 text-green-300 font-semibold rounded-lg transition">Back to Overview</button>
      </header>

      {/* --- TOP CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/50 border border-green-900/70 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-green-200 flex items-center mb-4"><MapPin className="mr-3 text-green-400"/>Location</h2>
            <p className="text-green-300 mb-4">{currentLocation}</p>
            
        </div>
        <div className={`bg-gray-900/50 rounded-2xl p-6 shadow-lg border ${getHealthStyling(stationData.currentHealth).split(' ')[1]}`}>
            <h2 className="text-xl font-bold text-green-200 flex items-center mb-4"><HeartPulse className="mr-3 text-green-400"/>System Health</h2>
            <p className={`text-3xl font-bold mb-4 ${getHealthStyling(stationData.currentHealth).split(' ')[0]}`}>{stationData.currentHealth}</p>
            <div className="w-full bg-gray-800 rounded-full h-4 mb-2 overflow-hidden"><div className={`h-4 rounded-full ${getHealthStyling(stationData.currentHealth).split(' ')[2].replace('bg-','bg-opacity-100 bg-')}`} style={{ width: `${stationData.healthPercent}%` }}></div></div>
            <p className="text-sm text-green-600 text-right">{stationData.healthPercent}% Operational Capacity</p>
        </div>
        <div className="bg-gray-900/50 border border-green-900/70 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-green-200 flex items-center mb-4"><Wrench className="mr-3 text-green-400"/>Maintenance</h2>
            <div className="space-y-3">
                <p>Last Service: <span className="font-semibold text-white">{stationData.lastMaintenance}</span></p>
                <p>Next Checkup: <span className="font-semibold text-white">{stationData.nextMaintenance}</span></p>
            </div>
            <button onClick={handleRequestMaintenance} className="mt-6 w-full py-3 px-4 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition">Request Maintenance</button>
        </div>
      </div>
      
      {/* --- BATTERIES SECTION --- */}
      <div className="bg-gray-900/50 border border-green-900/70 rounded-2xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold text-green-200 flex items-center mb-4"><BatteryFull className="mr-3 text-green-400"/>Battery Systems</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stationData.batteries.map((battery, index) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-green-900/50">
                    <h3 className="font-bold text-lg text-green-300 mb-3">Battery Unit #{index + 1}</h3>
                    <div className="space-y-2 text-sm">
                        <p className="flex justify-between">Type: <span className="font-medium text-white">{battery.type}</span></p>
                        <p className="flex justify-between">Capacity: <span className="font-medium text-white">{battery.capacity}</span></p>
                        <p className="flex justify-between">Health: <span className="font-medium text-white">{battery.health}%</span></p>
                        <p className="flex justify-between">Installed: <span className="font-medium text-white">{battery.installedDate}</span></p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- HAZARDS SECTION --- */}
      <div className="bg-gray-900/50 border border-green-900/70 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-green-200 flex items-center mb-4"><AlertTriangle className="mr-3 text-amber-400"/>Detected Hazards</h2>
        {stationData.hazards.length > 0 ? (
            <div className="space-y-4">
                {stationData.hazards.map((hazard, index) => {
                    const styles = getSeverityStyling(hazard.severity);
                    return (
                        <div key={index} className={`border ${styles.border} ${styles.bg} p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                            <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-4 flex-shrink-0 ${styles.icon}`}></div>
                                <div>
                                    <p className={`font-bold capitalize ${styles.text}`}>{hazard.type} ({hazard.severity})</p>
                                    <p className="text-xs text-green-600 flex items-center mt-1"><Clock size={12} className="mr-1.5"/>Detected: {hazard.detectedAt}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2 self-end sm:self-center">
                                <button onClick={() => handleAcknowledge(hazard.type)} className="text-xs font-semibold bg-gray-700/80 hover:bg-gray-700 text-green-300 px-3 py-1.5 rounded-md transition">Acknowledge</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="text-center py-8 text-green-600">
                <Info className="mx-auto h-8 w-8 mb-2" />
                <p>No hazards detected. All systems are operating normally.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default StationSpecific;