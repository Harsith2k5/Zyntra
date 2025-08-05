import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Activity, 
  Clock, 
  Settings,
  LogOut,
  UsersRound, // More appropriate icon
  MonitorSmartphone // More appropriate icon
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/overview', icon: BarChart2, label: 'Overview' },
    { path: '/admin/usage', icon: Activity, label: 'Usage Trends' },
    { path: '/admin/forecast', icon: Clock, label: 'Forecast' },
        { path: '/workstation/dummy', icon: MonitorSmartphone, label: 'Zyntra Queue' } ,// Changed Icon
    { path: '/admin/stations', icon: UsersRound, label: 'Station Management' }, // Changed Icon
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    { path: '/virtual-queue', icon: UsersRound, label: 'Virtual Queue' }, // Changed Icon

  ];

  // This effect handles the automatic fullscreen logic
  useEffect(() => {
    const enterFullscreen = async () => {
      // Check if we are already in fullscreen to avoid errors
      if (document.fullscreenElement) return;
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.error(`Could not enter fullscreen mode: ${err}`);
      }
    };

    const exitFullscreen = async () => {
      // Check if we are in fullscreen before trying to exit
      if (!document.fullscreenElement) return;
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error(`Could not exit fullscreen mode: ${err}`);
      }
    };

    // Trigger fullscreen based on the current path
    if (location.pathname === '/workstation/dummy') {
      enterFullscreen();
    } else {
      exitFullscreen();
    }

    // When the component unmounts, ensure we exit fullscreen
    // This handles cases like logging out directly from the fullscreen page
    return () => {
      exitFullscreen();
    };
  }, [location.pathname]); // Re-run the effect whenever the path changes

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#151515] border-r border-white/10 z-40 hidden lg:block">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#16FFBD] to-[#FF6EC7] rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xl">Z</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">Zyntra Admin</h1>
            <p className="text-white/60 text-sm">Station Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group
                ${location.pathname === item.path 
                  ? 'bg-[#16FFBD]/10 text-[#16FFBD] shadow-[0_0_20px_rgba(22,255,189,0.2)]' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <item.icon className={`
                w-5 h-5 transition-colors duration-200
                ${location.pathname === item.path 
                  ? 'text-[#16FFBD]' 
                  : 'text-white/70 group-hover:text-[#16FFBD]'
                }
              `} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <Link
            to="/login"
            className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;