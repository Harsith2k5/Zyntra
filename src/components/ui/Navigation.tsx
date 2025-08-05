import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Map, 
  Route, 
  Wallet, 
  User, 
  Bell, 
  Star,
  HelpCircle,
  X
} from 'lucide-react';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', description: 'Home & overview' },
    { path: '/discover', icon: Map, label: 'Discover', description: 'Find charging stations' },
    { path: '/planner', icon: Route, label: 'Trip Planner', description: 'Plan your journey' },
    { path: '/wallet', icon: Wallet, label: 'Wallet', description: 'Balance & payments' },
    { path: '/rewards', icon: Star, label: 'Rewards', description: 'GreenPoints & achievements' },
    { path: '/support', icon: HelpCircle, label: 'Support', description: 'Help & assistance' },
    { path: '/notifications', icon: Bell, label: 'Notifications', description: 'Alerts & updates' },
    { path: '/profile', icon: User, label: 'Profile', description: 'Account settings' },
  ];

  return (
    <>
      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Navigation Drawer - Always Mobile Style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#151515] border-r border-white/10 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-[#16FFBD] to-[#FF6EC7] rounded-full flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(22,255,189,0.3)',
                        '0 0 30px rgba(22,255,189,0.5)',
                        '0 0 20px rgba(22,255,189,0.3)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  >
                    <span className="text-black font-bold text-xl">Z</span>
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Zyntra</h2>
                    <p className="text-white/60 text-sm">EV Charging Hub</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`
                        group flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300
                        ${location.pathname === item.path 
                          ? 'bg-[#16FFBD]/10 text-[#16FFBD] shadow-[0_0_20px_rgba(22,255,189,0.2)] border border-[#16FFBD]/20' 
                          : 'text-white/70 hover:bg-white/5 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                        }
                      `}
                    >
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                        ${location.pathname === item.path 
                          ? 'bg-[#16FFBD]/20' 
                          : 'bg-white/5 group-hover:bg-white/10'
                        }
                      `}>
                        <item.icon className={`
                          w-6 h-6 transition-all duration-300
                          ${location.pathname === item.path 
                            ? 'text-[#16FFBD]' 
                            : 'text-white/70 group-hover:text-[#16FFBD]'
                          }
                        `} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`
                          font-semibold transition-colors duration-300
                          ${location.pathname === item.path 
                            ? 'text-[#16FFBD]' 
                            : 'text-white group-hover:text-white'
                          }
                        `}>
                          {item.label}
                        </div>
                        <div className="text-white/50 text-sm truncate">
                          {item.description}
                        </div>
                      </div>
                      
                      {/* Active Indicator */}
                      {location.pathname === item.path && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-1 h-8 bg-[#16FFBD] rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-white/40 text-xs mb-2">Zyntra v2.0</div>
                  <div className="text-white/30 text-xs">Smart EV Charging</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;