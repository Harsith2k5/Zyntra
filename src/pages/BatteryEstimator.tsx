/* import React, { useState, useEffect } from 'react';
import { Battery, MapPin, Clock, Car, Play, StopCircle, Zap, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

interface BatteryEstimate {
  estimated_battery: number;
  estimated_range: number;
  max_range: number;
  distance_covered?: number;
  battery_drain?: number;
  charging_suggestions?: string[];
}

interface BatteryEstimatorProps {
  userData: {
    evName: string;
    evModel: string;
    batteryRemaining: number;
  };
  onUpdate: (newBattery: number) => void;
}

const BatteryEstimator: React.FC<BatteryEstimatorProps> = ({ userData, onUpdate }) => {
  const [mode, setMode] = useState<'idle' | 'driving' | 'gps'>('idle');
  const [result, setResult] = useState<BatteryEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Mode-specific state
  const [drivingStyle, setDrivingStyle] = useState<'city' | 'highway' | 'mixed'>('mixed');
  const [duration, setDuration] = useState(60);
  const [isTracking, setIsTracking] = useState(false);
  const [startCoords, setStartCoords] = useState<string>('');
  const [endCoords, setEndCoords] = useState<string>('');
  const [hoursIdle, setHoursIdle] = useState(24);

  const calculateBattery = async () => {
    setLoading(true);
    try {
      const payload = {
        mode,
        ev_make: userData.evName,
        ev_model: userData.evModel,
        current_battery: userData.batteryRemaining,
        ...(mode === 'driving' && { 
          driving_style: drivingStyle,
          duration_min: duration 
        }),
        ...(mode === 'gps' && { 
          start_coords: startCoords,
          end_coords: endCoords 
        }),
        ...(mode === 'idle' && {
          hours_idle: hoursIdle
        })
      };

const response = await fetch('http://localhost:5501/api/estimate_battery', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

      const data = await response.json();
      if (data.status === 'success') {
        setResult(data.data);
        onUpdate(data.data.estimated_battery); // Update parent component
      }
    } catch (error) {
      console.error("Error estimating battery:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async (isStart: boolean) => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const coords = `${position.coords.latitude},${position.coords.longitude}`;
      isStart ? setStartCoords(coords) : setEndCoords(coords);
    } catch (error) {
      console.error("Location error:", error);
    }
  };

  const startTracking = async () => {
    await getLocation(true);
    setIsTracking(true);
  };

  const stopTracking = async () => {
    await getLocation(false);
    setIsTracking(false);
    calculateBattery();
  };

  // Auto-calculate when inputs change (with debounce)
  useEffect(() => {
    if (mode === 'idle') return;
    
    const timer = setTimeout(() => {
      calculateBattery();
    }, 500);

    return () => clearTimeout(timer);
  }, [mode, drivingStyle, duration, startCoords, endCoords, hoursIdle]);

  return (
    <GlassCard className="p-6 border border-white/10 shadow-lg shadow-black/30">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-xl flex items-center">
            <Battery className="mr-2" /> Battery Estimation
          </h2>
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setMode('idle')}
              className={`px-3 py-1 rounded-md text-sm ${mode === 'idle' ? 'bg-[#16FFBD]/20 text-white' : 'text-white/70'}`}
            >
              Idle
            </button>
            <button
              onClick={() => setMode('driving')}
              className={`px-3 py-1 rounded-md text-sm ${mode === 'driving' ? 'bg-[#16FFBD]/20 text-white' : 'text-white/70'}`}
            >
              Driving
            </button>
            <button
              onClick={() => setMode('gps')}
              className={`px-3 py-1 rounded-md text-sm ${mode === 'gps' ? 'bg-[#16FFBD]/20 text-white' : 'text-white/70'}`}
            >
              GPS
            </button>
          </div>
        </div>

        {mode === 'idle' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white/80 text-sm">Hours Idle</label>
              <input
                type="number"
                value={hoursIdle}
                onChange={(e) => setHoursIdle(Math.max(0, Number(e.target.value)))}
                className="w-20 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-right"
                min="0"
              />
            </div>
            <div className="text-xs text-white/50 flex items-center">
              <Info className="w-3 h-3 mr-1" />
              Estimates passive battery drain (1-3% per day)
            </div>
          </div>
        )}

        {mode === 'driving' && (
          <div className="space-y-4">
            <div>
              <label className="text-white/80 text-sm mb-1 block">Driving Style</label>
              <select
                value={drivingStyle}
                onChange={(e) => setDrivingStyle(e.target.value as any)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="city">City Driving (30km/h)</option>
                <option value="highway">Highway (80km/h)</option>
                <option value="mixed">Mixed (50km/h)</option>
              </select>
            </div>
            <div>
              <label className="text-white/80 text-sm mb-1 block">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.max(0, Number(e.target.value)))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                min="0"
              />
            </div>
          </div>
        )}

        {mode === 'gps' && (
          <div className="space-y-3">
            {!isTracking ? (
              <NeonButton
                onClick={startTracking}
                size="sm"
                className="flex items-center justify-center space-x-2 w-full"
              >
                <Play className="w-4 h-4" />
                <span>Start Trip</span>
              </NeonButton>
            ) : (
              <NeonButton
                onClick={stopTracking}
                size="sm"
                glowColor="rose"
                className="flex items-center justify-center space-x-2 w-full"
              >
                <StopCircle className="w-4 h-4" />
                <span>End Trip</span>
              </NeonButton>
            )}
            <div className="text-xs text-white/60 space-y-1">
              {startCoords && <div>Start: {startCoords}</div>}
              {endCoords && <div>End: {endCoords}</div>}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-[#FCEE09]" />
              <span className="text-white/80 text-sm">
                {userData.evName} {userData.evModel}
              </span>
            </div>
            <div className="text-white/70 text-sm">
              Max: {result?.max_range?.toFixed(0) || '--'} km
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-white">
                {result?.estimated_battery?.toFixed(0) || userData.batteryRemaining}%
              </span>
              <span className="text-white/60 text-sm mb-1">
                Current
              </span>
            </div>
            <div className="text-right">
              <div className="text-white/70 text-sm">Estimated Range</div>
              <div className="text-xl font-medium text-white">
                {result?.estimated_range?.toFixed(0) || 
                  ((userData.batteryRemaining / 100) * (result?.max_range || 400)).toFixed(0)} km
              </div>
            </div>
          </div>

          {mode === 'idle' && result?.battery_drain && (
            <div className="mt-3 text-sm text-white/70 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Estimated drain: {result.battery_drain.toFixed(2)}%</span>
            </div>
          )}

          {(mode === 'driving' || mode === 'gps') && result?.distance_covered && (
            <div className="mt-3 text-sm text-white/70 flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Distance: {result.distance_covered.toFixed(1)} km</span>
            </div>
          )}
        </div>

        {result?.charging_suggestions && (
          <div className="pt-3 border-t border-white/10">
            <h4 className="text-white/80 text-sm mb-1">Suggestions</h4>
            <ul className="text-xs text-white/60 space-y-1">
              {result.charging_suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-1">•</span> {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default BatteryEstimator; */
// src/pages/BatteryEstimator.tsx
import React, { useState, useEffect } from 'react';
// FIX 1: Replaced non-existent 'LoaderCircle' with 'Loader2'
import { Battery, Power, Route, Loader2 } from 'lucide-react'; 
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

// Define the shape of props this component expects
interface BatteryEstimatorProps {
  userData: {
    id?: string;
    evName: string;
    evModel: string;
    batteryRemaining: number;
    vehicleRange?: number; // Max range of the vehicle in km
  };
  // This function will be passed from Dashboard.tsx to handle the actual DB update
  onUpdateBattery: (newLevel: number) => void; 
}

// Define the structure of the backend response for idle estimation
interface IdleEstimateResponse {
    estimatedDurationHours: number;
    message: string;
}

const BatteryEstimator: React.FC<BatteryEstimatorProps> = ({ userData, onUpdateBattery }) => {
  const [estimationMode, setEstimationMode] = useState<'idle' | 'travel'>('idle');
  
  // State for the controlled input field for battery level
  const [batteryInput, setBatteryInput] = useState<string>(userData.batteryRemaining.toString());
  
  // State for travel distance input
  const [travelDistance, setTravelDistance] = useState<string>('');

  // State for holding estimation results
  const [idleEstimate, setIdleEstimate] = useState<string | null>(null);
  const [travelEstimate, setTravelEstimate] = useState<string | null>(null);

  // State for loading indicators
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);

  // Keep the input field in sync if the prop changes from outside
  useEffect(() => {
    setBatteryInput(userData.batteryRemaining.toString());
  }, [userData.batteryRemaining]);

  const handleUpdateClick = async () => {
    const newLevel = parseInt(batteryInput, 10);
    if (!isNaN(newLevel) && newLevel >= 0 && newLevel <= 100) {
      setIsUpdating(true);
      await onUpdateBattery(newLevel); // Call the function passed from Dashboard
      setIsUpdating(false);
    } else {
      alert("Please enter a valid battery percentage (0-100).");
    }
  };
  
  const handleIdleEstimate = async () => {
    setIsEstimating(true);
    setIdleEstimate(null);
    try {
      const response = await fetch('http://localhost:5501/api/estimate/idle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evName: userData.evName,
          evModel: userData.evModel,
          batteryPercentage: parseInt(batteryInput, 10),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: IdleEstimateResponse = await response.json();
      setIdleEstimate(data.message);

    } catch (error) {
      console.error("Failed to fetch idle estimate:", error);
      setIdleEstimate("Error: Could not retrieve estimate.");
    } finally {
      setIsEstimating(false);
    }
  };

  const handleTravelEstimate = () => {
    const distance = parseFloat(travelDistance);
    const currentBattery = parseInt(batteryInput, 10);
    const maxRange = userData.vehicleRange || 400; // Default to 400km if not provided

    if (isNaN(distance) || distance <= 0) {
      setTravelEstimate("Please enter a valid distance.");
      return;
    }

    const batteryConsumed = (distance / maxRange) * 100;
    const remainingBattery = currentBattery - batteryConsumed;

    if (remainingBattery < 0) {
      setTravelEstimate(`Trip not possible. This trip requires approx. ${batteryConsumed.toFixed(1)}% battery.`);
    } else {
      setTravelEstimate(`After a ${distance} km trip, you will have approx. ${remainingBattery.toFixed(1)}% battery remaining.`);
    }
  };


  return (
    <GlassCard className="p-6 border border-[#FCEE09]/20 shadow-lg shadow-[#FCEE09]/10">
      <h3 className="text-white font-semibold text-xl mb-4">Battery & Range Estimator</h3>
      
      {/* Battery Level Input and Update */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-grow">
          <Battery className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="number"
            value={batteryInput}
            onChange={(e) => setBatteryInput(e.target.value)}
            placeholder="Enter Battery %"
            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FCEE09]"
            min="0"
            max="100"
          />
        </div>
        {/* FIX 2: Removed the non-existent 'color' prop */}
        <NeonButton onClick={handleUpdateClick} size="sm" disabled={isUpdating}>
          {/* FIX 1: Using Loader2 here */}
          {isUpdating ? <Loader2 className="animate-spin" /> : 'Set'}
        </NeonButton>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-black/30 rounded-lg p-1 mb-4">
        <button 
          onClick={() => setEstimationMode('idle')}
          className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${estimationMode === 'idle' ? 'bg-[#FCEE09] text-black' : 'text-white/70 hover:bg-white/10'}`}
        >
          <Power className="w-4 h-4 inline-block mr-2" />
          Idle Standby
        </button>
        <button 
          onClick={() => setEstimationMode('travel')}
          className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${estimationMode === 'travel' ? 'bg-[#16FFBD] text-black' : 'text-white/70 hover:bg-white/10'}`}
        >
          <Route className="w-4 h-4 inline-block mr-2" />
          Trip Planner
        </button>
      </div>

      {/* Conditional Estimation UI */}
      {estimationMode === 'idle' ? (
        <div>
          <p className="text-sm text-white/60 mb-3">Estimate how long your current charge will last while the vehicle is parked and idle.</p>
          {/* FIX 2: Removed the non-existent 'color' prop */}
          <NeonButton onClick={handleIdleEstimate} className="w-full" disabled={isEstimating}>
            {/* FIX 1: Using Loader2 here */}
            {isEstimating ? <Loader2 className="animate-spin" /> : 'Estimate Idle Time'}
          </NeonButton>
          {idleEstimate && <p className="mt-4 text-center text-[#FCEE09] font-medium">{idleEstimate}</p>}
        </div>
      ) : (
        <div>
           <div className="relative mb-3">
             <Route className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
             <input
                type="number"
                value={travelDistance}
                onChange={(e) => setTravelDistance(e.target.value)}
                placeholder="Distance to travel (km)"
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#16FFBD]"
             />
           </div>
           {/* FIX 2: Removed the non-existent 'color' prop */}
           <NeonButton onClick={handleTravelEstimate} className="w-full">
             Estimate Trip Impact
           </NeonButton>
           {travelEstimate && <p className="mt-4 text-center text-[#16FFBD] font-medium">{travelEstimate}</p>}
        </div>
      )}
    </GlassCard>
  );
};

export default BatteryEstimator;