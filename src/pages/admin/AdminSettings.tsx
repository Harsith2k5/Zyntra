import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  DollarSign, 
  Users, 
  Bell,
  Shield,
  Zap
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import NeonButton from '../../components/ui/NeonButton';

const AdminSettings: React.FC = () => {
  const [dynamicPricing, setDynamicPricing] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoApproval, setAutoApproval] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/60">Configure system preferences and operational settings</p>
      </div>

      {/* Pricing Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <DollarSign className="w-6 h-6 text-[#FCEE09]" />
            <h2 className="text-xl font-semibold text-white">Pricing Configuration</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Dynamic Pricing</div>
                <div className="text-white/60 text-sm">Automatically adjust prices based on demand</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dynamicPricing}
                  onChange={(e) => setDynamicPricing(e.target.checked)}
                  className="sr-only"
                />
                <div className={`
                  w-12 h-6 rounded-full border-2 transition-all duration-200 relative
                  ${dynamicPricing ? 'bg-[#FCEE09] border-[#FCEE09]' : 'bg-white/10 border-white/20'}
                `}>
                  <div className={`
                    w-4 h-4 rounded-full bg-white transition-all duration-200 absolute top-0.5
                    ${dynamicPricing ? 'left-6' : 'left-0.5'}
                  `} />
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Base Rate (₹/kWh)
                </label>
                <input
                  type="number"
                  defaultValue="14"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#FCEE09] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Peak Multiplier
                </label>
                <input
                  type="number"
                  defaultValue="1.5"
                  step="0.1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#FCEE09] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Fleet Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-6 h-6 text-[#16FFBD]" />
            <h2 className="text-xl font-semibold text-white">Fleet Management</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Auto-approve Fleet Registrations</div>
                <div className="text-white/60 text-sm">Automatically approve new fleet owner applications</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApproval}
                  onChange={(e) => setAutoApproval(e.target.checked)}
                  className="sr-only"
                />
                <div className={`
                  w-12 h-6 rounded-full border-2 transition-all duration-200 relative
                  ${autoApproval ? 'bg-[#16FFBD] border-[#16FFBD]' : 'bg-white/10 border-white/20'}
                `}>
                  <div className={`
                    w-4 h-4 rounded-full bg-white transition-all duration-200 absolute top-0.5
                    ${autoApproval ? 'left-6' : 'left-0.5'}
                  `} />
                </div>
              </label>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Fleet Discount Rate (%)
              </label>
              <input
                type="number"
                defaultValue="15"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-[#FF6EC7]" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">System Alerts</div>
                <div className="text-white/60 text-sm">Receive notifications for system events</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only"
                />
                <div className={`
                  w-12 h-6 rounded-full border-2 transition-all duration-200 relative
                  ${notifications ? 'bg-[#FF6EC7] border-[#FF6EC7]' : 'bg-white/10 border-white/20'}
                `}>
                  <div className={`
                    w-4 h-4 rounded-full bg-white transition-all duration-200 absolute top-0.5
                    ${notifications ? 'left-6' : 'left-0.5'}
                  `} />
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5" />
                  <span className="text-white/80 text-sm">Station Outages</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5" />
                  <span className="text-white/80 text-sm">High Demand Alerts</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                  <span className="text-white/80 text-sm">Maintenance Reminders</span>
                </label>
              </div>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5" />
                  <span className="text-white/80 text-sm">Revenue Reports</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                  <span className="text-white/80 text-sm">Fleet Registrations</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                  <span className="text-white/80 text-sm">Security Alerts</span>
                </label>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Security & Access</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-white/40 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                API Rate Limit (requests/minute)
              </label>
              <input
                type="number"
                defaultValue="100"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-white/40 focus:outline-none"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <NeonButton>
          <Settings className="w-4 h-4 mr-2" />
          Save Settings
        </NeonButton>
      </div>
    </div>
  );
};

export default AdminSettings;