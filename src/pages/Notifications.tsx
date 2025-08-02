import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellOff, 
  Check, 
  X, 
  Filter,
  Trash2,
  Settings
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { mockNotifications } from '../data/mockData';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const filterOptions = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'ai', label: 'AI Suggestions', count: notifications.filter(n => n.type === 'ai').length },
    { id: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
    { id: 'environmental', label: 'Environmental', count: notifications.filter(n => n.type === 'environmental').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ai': return '🤖';
      case 'payment': return '💳';
      case 'environmental': return '🌱';
      case 'error': return '⚠️';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'ai': return 'border-l-[#16FFBD]';
      case 'payment': return 'border-l-[#FCEE09]';
      case 'environmental': return 'border-l-[#16FFBD]';
      case 'error': return 'border-l-red-400';
      default: return 'border-l-white/20';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return notificationTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8">
      <div className="container-responsive">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-white/60">Stay updated with your charging activities</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            
            {notifications.some(n => !n.read) && (
              <NeonButton onClick={markAllAsRead} variant="secondary" size="sm">
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </NeonButton>
            )}
            
            <NeonButton onClick={clearAll} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </NeonButton>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-4 overflow-x-auto">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all whitespace-nowrap
                  ${selectedFilter === filter.id 
                    ? 'bg-[#16FFBD]/20 text-[#16FFBD] border border-[#16FFBD]/40' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span className="text-sm font-medium">{filter.label}</span>
                {filter.count > 0 && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${selectedFilter === filter.id 
                      ? 'bg-[#16FFBD] text-black' 
                      : 'bg-white/20 text-white/80'
                    }
                  `}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <BellOff className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-white font-semibold text-lg mb-2">No notifications</h3>
                <p className="text-white/60">
                  {selectedFilter === 'all' 
                    ? "You're all caught up! No new notifications."
                    : `No ${selectedFilter} notifications found.`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        relative p-4 rounded-2xl border-l-4 transition-all duration-200
                        ${notification.read ? 'bg-white/5' : 'bg-white/10'}
                        ${getNotificationColor(notification.type)}
                        hover:bg-white/15
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`
                                font-semibold
                                ${notification.read ? 'text-white/80' : 'text-white'}
                              `}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-[#16FFBD] rounded-full" />
                              )}
                            </div>
                            
                            <p className={`
                              text-sm mb-2
                              ${notification.read ? 'text-white/60' : 'text-white/80'}
                            `}>
                              {notification.message}
                            </p>
                            
                            <div className="text-xs text-white/40">
                              {formatTime(notification.timestamp)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1.5 rounded-full bg-[#16FFBD]/20 hover:bg-[#16FFBD]/30 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3 text-[#16FFBD]" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
                            title="Delete notification"
                          >
                            <X className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-full max-w-md"
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Notification Settings</h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 text-white/60" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'ai', label: 'AI Suggestions', description: 'Smart charging recommendations' },
                      { id: 'payment', label: 'Payment Alerts', description: 'Transaction confirmations and receipts' },
                      { id: 'environmental', label: 'Environmental Updates', description: 'GreenPoints and eco achievements' },
                      { id: 'booking', label: 'Booking Reminders', description: 'Upcoming charging sessions' },
                      { id: 'promotional', label: 'Promotions', description: 'Special offers and discounts' }
                    ].map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{setting.label}</div>
                          <div className="text-white/60 text-sm">{setting.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={setting.id !== 'promotional'}
                            className="sr-only"
                          />
                          <div className="w-12 h-6 bg-white/10 rounded-full border-2 border-white/20 transition-all duration-200 peer-checked:bg-[#16FFBD] peer-checked:border-[#16FFBD]">
                            <div className="w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-6" />
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <NeonButton onClick={() => setShowSettings(false)}>
                      Save Settings
                    </NeonButton>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;