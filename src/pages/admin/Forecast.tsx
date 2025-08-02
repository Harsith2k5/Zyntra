import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Calendar, Zap } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import NeonButton from '../../components/ui/NeonButton';
import { mockAnalytics } from '../../data/mockData';

const Forecast: React.FC = () => {
  const [forecastRange, setForecastRange] = useState('week');
  const [selectedDate, setSelectedDate] = useState('2024-01-22');

  const handleApplyForecast = () => {
    console.log('Applying forecast for:', selectedDate, forecastRange);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Forecast</h1>
          <p className="text-white/60">Predict usage patterns and optimize operations</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
          />
          
          <select
            value={forecastRange}
            onChange={(e) => setForecastRange(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
          >
            <option value="day">Next Day</option>
            <option value="week">Next Week</option>
            <option value="month">Next Month</option>
          </select>
          
          <NeonButton onClick={handleApplyForecast}>
            <Zap className="w-4 h-4 mr-2" />
            Apply Forecast
          </NeonButton>
        </div>
      </div>

      {/* Forecast Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#16FFBD]/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#16FFBD]" />
              </div>
              <div>
                <div className="text-white font-semibold">Predicted Sessions</div>
                <div className="text-white/60 text-sm">Next 7 days</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">1,847</div>
            <div className="text-[#16FFBD] text-sm">+15% vs last week</div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#FCEE09]/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#FCEE09]" />
              </div>
              <div>
                <div className="text-white font-semibold">Peak Load Time</div>
                <div className="text-white/60 text-sm">Tomorrow</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">7:30 PM</div>
            <div className="text-[#FCEE09] text-sm">95% utilization</div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#FF6EC7]/20 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#FF6EC7]" />
              </div>
              <div>
                <div className="text-white font-semibold">Revenue Forecast</div>
                <div className="text-white/60 text-sm">Next 7 days</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">₹52,400</div>
            <div className="text-[#FF6EC7] text-sm">+8% vs last week</div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Forecast vs Actual Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Forecast vs Actual</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#16FFBD] rounded-full"></div>
                <span className="text-white/60 text-sm">Predicted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#FCEE09] rounded-full"></div>
                <span className="text-white/60 text-sm">Actual</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {mockAnalytics.forecast.nextWeek.map((day, index) => (
              <div key={day.day} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm w-12">{day.day}</span>
                  <div className="flex-1 mx-4 relative">
                    {/* Predicted bar */}
                    <div className="h-6 bg-white/5 rounded-full overflow-hidden mb-1">
                      <motion.div
                        className="h-full bg-[#16FFBD]/60"
                        initial={{ width: 0 }}
                        animate={{ width: `${(day.predicted / 250) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                      />
                    </div>
                    {/* Actual bar */}
                    {day.actual && (
                      <div className="h-6 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#FCEE09]/80"
                          initial={{ width: 0 }}
                          animate={{ width: `${(day.actual / 250) * 100}%` }}
                          transition={{ delay: index * 0.1 + 0.4, duration: 0.8 }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="text-right w-20">
                    <div className="text-[#16FFBD] text-sm">{day.predicted}</div>
                    {day.actual && (
                      <div className="text-[#FCEE09] text-sm">{day.actual}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-[#16FFBD]/20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#16FFBD]" />
            </div>
            <h2 className="text-xl font-semibold text-white">AI Insights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-[#16FFBD]/10 rounded-2xl border border-[#16FFBD]/20">
                <div className="text-[#16FFBD] font-medium mb-2">High Demand Alert</div>
                <div className="text-white/60 text-sm">
                  Expected 40% increase in demand this Friday evening. Consider activating additional charging points.
                </div>
              </div>
              
              <div className="p-4 bg-[#FCEE09]/10 rounded-2xl border border-[#FCEE09]/20">
                <div className="text-[#FCEE09] font-medium mb-2">Maintenance Window</div>
                <div className="text-white/60 text-sm">
                  Optimal maintenance window: Tuesday 2-4 AM with minimal impact on operations.
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-[#FF6EC7]/10 rounded-2xl border border-[#FF6EC7]/20">
                <div className="text-[#FF6EC7] font-medium mb-2">Revenue Opportunity</div>
                <div className="text-white/60 text-sm">
                  Dynamic pricing during peak hours could increase revenue by 12% this week.
                </div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-white font-medium mb-2">Weather Impact</div>
                <div className="text-white/60 text-sm">
                  Rain forecast for Thursday may reduce usage by 15%. Adjust staffing accordingly.
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Forecast;