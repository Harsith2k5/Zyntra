import React from 'react';
import { useState } from 'react';
import { 
  Menu, 
  X,
  BarChart2,
  Activity,
  Clock,
  Loader,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#151515] border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#16FFBD] to-[#FF6EC7] rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">Z</span>
            </div>
            <h1 className="text-white font-semibold">Zyntra Admin</h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isSidebarOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-80 bg-[#151515] border-r border-white/10 z-50 lg:hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#16FFBD] to-[#FF6EC7] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xl">Z</span>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">Zyntra Admin</h1>
                <p className="text-white/60 text-sm">Station Management</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <nav className="space-y-2">
            {[
              { path: '/admin/overview', icon: BarChart2, label: 'Overview' },
              { path: '/admin/usage', icon: Activity, label: 'Usage Trends' },
              { path: '/admin/forecast', icon: Clock, label: 'Forecast' },
              { path: '/admin/stations', icon: Loader, label: 'Station Management' },
              { path: '/admin/settings', icon: Settings, label: 'Settings' }
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 text-white/70 hover:bg-white/5 hover:text-white"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Desktop Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;