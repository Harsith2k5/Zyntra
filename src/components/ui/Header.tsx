import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, BatteryCharging, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { mockUser } from '../../data/mockData'; // REMOVE THIS LINE
import Navigation from './Navigation';
import { User as FirebaseAuthUser } from 'firebase/auth'; // Import Firebase User type

// --- Define the shape of data expected for user profile ---
// It's best to have this in a shared types/interfaces file (e.g., src/types/user.ts)
// and import it. For now, I'm re-defining it here for clarity.
interface UserProfileData {
  id?: string;
  name: string;
  evName: string; // e.g., "Tesla"
  evModel: string; // e.g., "Model 3"
  batteryRemaining: number; // Percentage
  greenCredits: number;
  walletBalance: number;
  lastUpdated?: Date;
  profilePictureUrl?: string; // Assuming you store this for the avatar
  // Add other fields from your user profile that the header might need
  // e.g., notifications settings, etc.
}

// --- Define the props interface for the Header component ---
interface HeaderProps {
  currentUser: FirebaseAuthUser | null;
  userData: UserProfileData | null;
}

const Header: React.FC<HeaderProps> = ({ currentUser, userData }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Dynamic values from props
  const userName = userData?.name || (currentUser?.displayName || 'Guest');
  const userBattery = userData?.batteryRemaining || 0; // Default to 0 if null
  const userProfilePic = userData?.profilePictureUrl || currentUser?.photoURL || 'https://via.placeholder.com/150/0B0B0B/FFFFFF?text=U'; // Fallback avatar
  // Assuming unreadNotifications might come from userData, or stay hardcoded for now
  const unreadNotifications = 3; // You might fetch this from userData.notifications.unreadCount or similar

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#151515] border-b border-white/10">
        <div className="w-full px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <button
                onClick={() => setIsNavOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 min-w-0"
              >
                <motion.div
                  className="w-8 h-8 bg-gradient-to-br from-[#16FFBD] to-[#FF6EC7] rounded-full flex items-center justify-center flex-shrink-0"
                  animate={{
                    boxShadow: [
                      '0 0 15px rgba(22,255,189,0.3)',
                      '0 0 25px rgba(22,255,189,0.5)',
                      '0 0 15px rgba(22,255,189,0.3)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  <span className="text-black font-bold text-lg">Z</span>
                </motion.div>
                <div className="hidden sm:block min-w-0">
                  <h1 className="text-white font-semibold truncate">
                    {greeting}, {userName}
                  </h1>
                  <p className="text-white/60 text-sm">{currentTime}</p>
                </div>
              </motion.div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Battery Status - Hidden on very small screens */}
              <motion.div
                className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <BatteryCharging className="w-4 h-4 text-[#16FFBD]" />
                <span className="text-white text-sm font-medium">
                  {userBattery}%
                </span>
              </motion.div>

              {/* Notifications */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <Bell className="w-5 h-5 text-white" />
                {unreadNotifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6EC7] rounded-full flex items-center justify-center text-black text-xs font-bold"
                  >
                    {unreadNotifications}
                  </motion.span>
                )}
              </button>

              {/* Profile */}
              <button
                onClick={() => navigate('/profile')}
                className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 hover:ring-2 hover:ring-[#16FFBD]/50 transition-all"
              >
                {/* Use actual profile picture or fallback */}
                <img
                  src={userProfilePic}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Component */}
      <Navigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </>
  );
};

export default Header;