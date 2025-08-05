/* import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BatteryCharging, 
  MapPin, 
  Clock, 
  Leaf, 
  Star, 
  CreditCard,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { mockUser, mockStations } from '../data/mockData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const aiPickStation = mockStations.find(station => station.isAIPick);

  const stats = [
    {
      icon: Leaf,
      label: 'CO₂ Saved',
      value: '127.3 kg',
      color: 'mint',
      bgColor: 'bg-[#16FFBD]/10'
    },
    {
      icon: Clock,
      label: 'Time Saved',
      value: '2.4 hrs',
      color: 'amber',
      bgColor: 'bg-[#FCEE09]/10'
    },
    {
      icon: Star,
      label: 'GreenPoints',
      value: mockUser.wallet.greenPoints.toLocaleString(),
      color: 'rose',
      bgColor: 'bg-[#FF6EC7]/10'
    }
  ];

  const quickActions = [
    { label: 'Recent Trips', icon: MapPin, onClick: () => navigate('/planner') },
    { label: 'Wallet', icon: CreditCard, onClick: () => navigate('/wallet') },
    { label: 'Rewards', icon: Star, onClick: () => navigate('/wallet') },
    { label: 'Support', icon: Info, onClick: () => navigate('/assistant') }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8">
      <div className="container-responsive">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold text-lg mb-1">
                  {mockUser.vehicles[0].brand} {mockUser.vehicles[0].model}
                </h2>
                <p className="text-white/60">
                  {mockUser.vehicles[0].range} km range remaining
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <BatteryCharging className="w-6 h-6 text-[#16FFBD]" />
                  <span className="text-2xl font-bold text-white">
                    {mockUser.vehicles[0].currentCharge}%
                  </span>
                </div>
                <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#16FFBD] to-[#FF6EC7]"
                    initial={{ width: 0 }}
                    animate={{ width: `${mockUser.vehicles[0].currentCharge}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {aiPickStation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <GlassCard className="p-6" hoverable glowColor="mint">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-[#16FFBD]/20 text-[#16FFBD] rounded-full text-sm font-medium">
                      AI Pick
                    </span>
                    <Zap className="w-4 h-4 text-[#FCEE09]" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Smart Charging Recommendation
                  </h3>
                  <p className="text-white/60">
                    Statiq Tech Mahindra Station • Rating: 4.9 • Power: 60 kW • Price: ₹18.5/kWh
                  </p>
                </div>
                <button className="text-white/40 hover:text-white transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-white/60" />
                    <span className="text-white/60 text-sm">{aiPickStation.distance} km</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-white/60" />
                    <span className="text-white/60 text-sm">{aiPickStation.waitTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-[#FCEE09]" />
                    <span className="text-white/60 text-sm">{aiPickStation.rating}</span>
                  </div>
                </div>
                <NeonButton
                  onClick={() => navigate(`/booking/${aiPickStation.id}`)}
                  size="sm"
                >
                  Book Now
                </NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <GlassCard className="p-6" hoverable onClick={() => navigate('/discover')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Nearby Stations</h3>
              <ChevronRight className="w-5 h-5 text-white/60" />
            </div>
            <div className="relative h-48 bg-gradient-to-br from-[#16FFBD]/10 to-[#FF6EC7]/10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#16FFBD] mx-auto mb-2" />
                  <p className="text-white/60">
                    {mockStations.length} stations nearby
                  </p>
                </div>
              </div>
              <div className="absolute top-4 left-6 w-3 h-3 bg-[#16FFBD] rounded-full animate-pulse" />
              <div className="absolute top-12 right-8 w-3 h-3 bg-[#FCEE09] rounded-full animate-pulse" />
              <div className="absolute bottom-8 left-12 w-3 h-3 bg-[#FF6EC7] rounded-full animate-pulse" />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <GlassCard key={index} className="p-4 text-center" hoverable>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-white font-semibold text-lg mb-1">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">
                  {stat.label}
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-white font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200 hover:scale-105"
                >
                  <action.icon className="w-6 h-6 text-[#16FFBD]" />
                  <span className="text-white/80 text-sm text-center">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; */
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BatteryCharging,
  MapPin,
  Clock,
  Leaf,
  Star,
  CreditCard,
  Zap,
  Info,
  ChevronRight,
  Gauge,
  CalendarCheck,
  LineChart,
  BellRing,
  MessageCircleQuestion,
  Wrench,
  DollarSign, // Not used but kept from your original imports
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { mockStations } from '../data/mockData'; // Keep mockStations for AI pick and other station data
import BatteryEstimator from './BatteryEstimator';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
// --- Define the shape of data expected from Firestore (copy from App.tsx or create a shared types file) ---
interface UserProfileData {
  id?: string; // Firestore document ID, optional as it's often implicit
  name: string;
  evName: string; // e.g., "Tesla"
  evModel: string; // e.g., "Model 3"
  batteryRemaining: number; // Percentage
  greenCredits: number;
  walletBalance: number;
  lastUpdated?: Date; // Firestore Timestamp will be converted to Date
  // Add other user-specific fields that might be used on the dashboard if they come from Firestore
  co2Saved?: number; // Assuming this might come from user data or be calculated
  timeSaved?: number; // Assuming this might come from user data or be calculated
  // If you store vehicle details in userData, adjust these:
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleRange?: number; // Current estimated range in km
}

// Define the interface for Dashboard component's props
interface DashboardProps {
userData: UserProfileData & { id: string };
}

const Dashboard: React.FC<DashboardProps> = ({ userData }) => {
  const navigate = useNavigate();
  // Ensure aiPickStation exists before trying to access its properties
  const aiPickStation = mockStations.find(station => station.isAIPick);

  // Derive values from userData where possible, or use defaults/calculations
  const currentBattery = userData.batteryRemaining || 0; // Use actual batteryRemaining
  const currentGreenCredits = userData.greenCredits || 0;
  const currentWalletBalance = userData.walletBalance || 0;
  const currentCO2Saved = userData.co2Saved || 127.3; // Placeholder if not in userData
  const currentTimeSaved = userData.timeSaved || 2.4; // Placeholder if not in userData

  // Use actual vehicle info from userData or provide a fallback
  const vehicleBrand = userData.evName || "Your EV";
  const vehicleModel = userData.evModel || "Model";
  // Calculate estimated range (e.g., 5km per percent for a 500km range EV)
  // This is a simple example; you might have a more complex calculation or store it directly
  const estimatedRange = (currentBattery / 100) * (userData.vehicleRange || 400); // Assuming a default 400km max range if not specified
const handleBatteryUpdate = async (newBatteryLevel: number) => {
    if (!userData.id) {
      console.error("User ID is missing. Cannot update battery level.");
      alert("Error: User session is invalid. Please log in again.");
      return;
    }

    const userDocRef = doc(db, 'userProfiles', userData.id);

    try {
      await updateDoc(userDocRef, {
        batteryRemaining: newBatteryLevel,
        lastUpdated: serverTimestamp() // Use server timestamp for accuracy
      });
      console.log("Successfully updated battery level in Firestore.");
      // Optional: Show a success toast/notification to the user
    } catch (error) {
      console.error("Error updating battery level: ", error);
      alert("Failed to update battery level. Please try again.");
    }
  };
  const stats = [
    {
      icon: Leaf,
      label: 'CO₂ Saved',
      value: `${currentCO2Saved.toFixed(1)} kg`,
      color: 'mint',
      bgColor: 'bg-[#16FFBD]/20'
    },
    {
      icon: Clock,
      label: 'Time Saved',
      value: `${currentTimeSaved.toFixed(1)} hrs`,
      color: 'amber',
      bgColor: 'bg-[#FCEE09]/20'
    },
    {
      icon: Star,
      label: 'GreenPoints',
      // Assuming greenCredits from userData maps to GreenPoints
      value: currentGreenCredits.toLocaleString(),
      color: 'rose',
      bgColor: 'bg-[#FF6EC7]/20'
    }
  ];

  const quickActions = [
    { label: 'Recent Trips', icon: MapPin, onClick: () => navigate('/planner') },
    { label: 'Wallet', icon: CreditCard, onClick: () => navigate('/wallet') },
    { label: 'Rewards', icon: Star, onClick: () => navigate('/rewards') },
    { label: 'Support', icon: Info, onClick: () => navigate('/support') } // Changed from /assistant to /support as per App.tsx
  ];

  const advancedFeatures = [
    { label: 'Vehicle Health', icon: Gauge, onClick: () => navigate('/vehicle-health') },
    { label: 'Scheduled Charge', icon: CalendarCheck, onClick: () => navigate('/scheduled-charge') },
    { label: 'Charge History', icon: LineChart, onClick: () => navigate('/charging-history') },
    { label: 'Price Alerts', icon: BellRing, onClick: () => navigate('/price-alerts') },
    { label: 'Community', icon: MessageCircleQuestion, onClick: () => navigate('/community') },
    { label: 'Maintenance', icon: Wrench, onClick: () => navigate('/maintenance') }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8">
      <div className="container-responsive">
        {/* --- Battery Status --- */}
        {/* --- Battery Status --- */}
 <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <BatteryEstimator 
            userData={{
                id: userData.id,
                evName: vehicleBrand,
                evModel: vehicleModel,
                batteryRemaining: userData.batteryRemaining,
                vehicleRange: userData.vehicleRange, // Pass the max range
            }}
            onUpdateBattery={handleBatteryUpdate} // Pass the handler function
          />
        </motion.div>

        {/* --- AI Smart Recommendation --- */}
        {aiPickStation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <GlassCard className="p-6 border border-[#16FFBD]/20 shadow-lg shadow-[#16FFBD]/10" hoverable glowColor="mint">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-[#FCEE09]" />
                  <h3 className="text-white font-semibold text-xl">
                    AI Smart Pick
                  </h3>
                  <span className="px-3 py-1 bg-[#16FFBD]/30 text-white rounded-full text-sm font-medium">
                    Recommended
                  </span>
                </div>
                <button className="text-white/60 hover:text-white transition-colors p-1">
                  <Info className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/90 text-lg font-medium mb-3">
                {aiPickStation.name} • {aiPickStation.power} kW • ₹{aiPickStation.pricePerKwh}/kWh
              </p>
              <div className="flex items-center justify-between flex-wrap gap-y-3">
                <div className="flex items-center space-x-4 text-white/70 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-white/80" />
                    <span>{aiPickStation.distance} km away</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-white/80" />
                    <span>Avg. wait: {aiPickStation.waitTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-[#FCEE09]" />
                    <span>{aiPickStation.rating} Rating</span>
                  </div>
                </div>
                <NeonButton
                  onClick={() => navigate(`/booking/${aiPickStation.id}`)}
                  size="md"
                >
                  Book Now
                </NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* --- Map Preview & Quick Actions --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6 h-full flex flex-col border border-white/10 shadow-lg shadow-black/30" hoverable onClick={() => navigate('/discover')}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Nearby Stations</h3>
                <ChevronRight className="w-5 h-5 text-white/70" />
              </div>
              <div className="relative flex-grow bg-gradient-to-br from-[#16FFBD]/15 to-[#FF6EC7]/15 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-[#16FFBD] mx-auto mb-2" />
                    <p className="text-white/70 text-sm">
                      {mockStations.length} stations nearby
                    </p>
                  </div>
                </div>
                {/* Simulated map pins - more subtle glow */}
                <div className="absolute top-8 left-10 w-3 h-3 bg-[#16FFBD] rounded-full animate-pulse-slow shadow-[0_0_8px_4px_rgba(22,255,189,0.5)]" />
                <div className="absolute top-16 right-12 w-3 h-3 bg-[#FCEE09] rounded-full animate-pulse-slow shadow-[0_0_8px_4px_rgba(252,238,9,0.5)]" />
                <div className="absolute bottom-10 left-20 w-3 h-3 bg-[#FF6EC7] rounded-full animate-pulse-slow shadow-[0_0_8px_4px_rgba(255,110,199,0.5)]" />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6 h-full flex flex-col border border-white/10 shadow-lg shadow-black/30">
              <h3 className="text-white font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4 flex-grow">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="flex flex-col items-center justify-center space-y-2 p-4 rounded-2xl bg-white/10 hover:bg-white/15 transition-all duration-200 hover:scale-105 min-h-[100px] border border-white/5"
                  >
                    <action.icon className="w-7 h-7 text-[#16FFBD]" />
                    <span className="text-white/90 text-sm font-medium text-center">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* --- Explore More Features (Moved Up) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <GlassCard className="p-6 border border-white/10 shadow-lg shadow-black/30">
            <h3 className="text-white font-semibold text-lg mb-4">Explore More Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {advancedFeatures.map((feature, index) => (
                <button
                  key={index}
                  onClick={feature.onClick}
                  className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/10 hover:bg-white/15 transition-all duration-200 hover:scale-105 min-h-[110px] justify-center border border-white/5"
                >
                  <feature.icon className="w-7 h-7 text-[#FCEE09]" />
                  <span className="text-white/90 text-sm font-medium text-center">
                    {feature.label}
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* --- Your Eco Impact (Moved Down) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <GlassCard className="p-6 border border-white/10 shadow-lg shadow-black/30">
            <h3 className="text-white font-semibold text-lg mb-4">Your Eco Impact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <GlassCard key={index} className="p-4 text-center flex flex-col items-center border border-white/5" hoverable>
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${stat.bgColor} mb-3 shadow-inner shadow-black/20`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-white font-bold text-2xl mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/80 text-sm">
                    {stat.label}
                  </div>
                </GlassCard>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;