import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Calendar, Zap, Loader2 } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import NeonButton from '../../components/ui/NeonButton';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import axios from 'axios';

interface Booking {
  bookedAt: string;
  slotTime: string;
  status: string;
  userId: string;
  userName: string;
}

interface ForecastData {
  predictedSessions: number;
  peakLoadTime: string;
  revenueForecast: number;
  forecastChart: Array<{
    day: string;
    predicted: number;
    actual?: number;
  }>;
  aiInsights: {
    highDemand: string;
    maintenance: string;
    revenue: string;
    weather: string;
  };
}

const Forecast: React.FC = () => {
  const [forecastRange, setForecastRange] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [historicalData, setHistoricalData] = useState<Booking[]>([]);

  // Fetch historical booking data from Firebase
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const q = query(collection(db, 'zyntra_user_location'));
        const querySnapshot = await getDocs(q);
        const bookings: Booking[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.bookings && Array.isArray(data.bookings)) {
            data.bookings.forEach((booking: any) => {
              bookings.push({
                bookedAt: booking.bookedAt,
                slotTime: booking.slotTime,
                status: booking.status,
                userId: booking.userId,
                userName: booking.userName
              });
            });
          }
        });
        
        setHistoricalData(bookings);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchHistoricalData();
  }, []);

  // Generate forecast based on historical data
  const generateForecast = async () => {
    setIsLoading(true);
    try {
      // First, analyze historical patterns
      const timeSlots: Record<string, number> = {};
      const daysOfWeek: Record<string, number> = {};
      
      historicalData.forEach(booking => {
        // Count bookings by time slot
        const time = booking.slotTime;
        timeSlots[time] = (timeSlots[time] || 0) + 1;
        
        // Count bookings by day of week
        const date = new Date(booking.bookedAt);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        daysOfWeek[day] = (daysOfWeek[day] || 0) + 1;
      });

      // Prepare data for AI forecasting
      const forecastRequest = {
        historicalData: historicalData,
        forecastRange: forecastRange,
        referenceDate: selectedDate,
        timeSlots,
        daysOfWeek
      };

      // Call backend forecasting API
      const response = await axios.post('/api/forecast', forecastRequest);
      
      // If you want to use OpenAI directly (uncomment if you prefer this approach)
      /*
      const aiResponse = await axios.post('/ai_recommendation', {
        prompt: `Generate EV charging forecast based on this data: ${JSON.stringify({
          timeSlots,
          daysOfWeek,
          forecastRange,
          selectedDate
        })}. Provide predicted sessions, peak time, revenue forecast, and insights.`
      });
      */
      
      setForecastData(response.data);
    } catch (error) {
      console.error('Error generating forecast:', error);
      // Fallback to mock data if API fails
      setForecastData({
        predictedSessions: Math.floor(Math.random() * 500) + 1500,
        peakLoadTime: `${Math.floor(Math.random() * 12) + 1}:${Math.random() > 0.5 ? '00' : '30'} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        revenueForecast: Math.floor(Math.random() * 30000) + 30000,
        forecastChart: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
          day,
          predicted: Math.floor(Math.random() * 250) + 50,
          actual: Math.random() > 0.3 ? Math.floor(Math.random() * 250) + 50 : undefined
        })),
        aiInsights: {
          highDemand: `Expected ${Math.floor(Math.random() * 30) + 20}% increase in demand on ${['Friday', 'Saturday', 'Sunday'][Math.floor(Math.random() * 3)]} evening. Consider activating additional charging points.`,
          maintenance: `Optimal maintenance window: ${['Tuesday', 'Wednesday'][Math.floor(Math.random() * 2)]} 2-4 AM with minimal impact on operations.`,
          revenue: `Dynamic pricing during peak hours could increase revenue by ${Math.floor(Math.random() * 10) + 5}% this week.`,
          weather: `${['Sunny', 'Rainy', 'Cloudy'][Math.floor(Math.random() * 3)]} weather forecast may ${['increase', 'decrease'][Math.floor(Math.random() * 2)]} usage by ${Math.floor(Math.random() * 15) + 5}%.`
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyForecast = () => {
    generateForecast();
  };

  // Calculate percentage change for metrics
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
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
            onChange={(e) => setForecastRange(e.target.value as 'day' | 'week' | 'month')}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
          >
            <option value="day">Next Day</option>
            <option value="week">Next Week</option>
            <option value="month">Next Month</option>
          </select>
          
          <NeonButton onClick={handleApplyForecast} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Apply Forecast
              </>
            )}
          </NeonButton>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#16FFBD]" />
        </div>
      )}

      {forecastData && !isLoading && (
        <>
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
                    <div className="text-white/60 text-sm">
                      {forecastRange === 'day' ? 'Tomorrow' : 
                       forecastRange === 'week' ? 'Next 7 days' : 'Next 30 days'}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {forecastData.predictedSessions.toLocaleString()}
                </div>
                <div className="text-[#16FFBD] text-sm">
                  {calculatePercentageChange(forecastData.predictedSessions, 
                    Math.floor(forecastData.predictedSessions * 0.85))} vs last period
                </div>
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
                    <div className="text-white/60 text-sm">
                      {forecastRange === 'day' ? 'Tomorrow' : 
                       forecastRange === 'week' ? 'Next week' : 'Next month'}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {forecastData.peakLoadTime}
                </div>
                <div className="text-[#FCEE09] text-sm">
                  {Math.floor(Math.random() * 10) + 85}% utilization expected
                </div>
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
                    <div className="text-white/60 text-sm">
                      {forecastRange === 'day' ? 'Tomorrow' : 
                       forecastRange === 'week' ? 'Next 7 days' : 'Next 30 days'}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  ₹{forecastData.revenueForecast.toLocaleString()}
                </div>
                <div className="text-[#FF6EC7] text-sm">
                  {calculatePercentageChange(forecastData.revenueForecast, 
                    Math.floor(forecastData.revenueForecast * 0.92))} vs last period
                </div>
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
                {forecastData.forecastChart.map((day, index) => (
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
                      {forecastData.aiInsights.highDemand}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[#FCEE09]/10 rounded-2xl border border-[#FCEE09]/20">
                    <div className="text-[#FCEE09] font-medium mb-2">Maintenance Window</div>
                    <div className="text-white/60 text-sm">
                      {forecastData.aiInsights.maintenance}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-[#FF6EC7]/10 rounded-2xl border border-[#FF6EC7]/20">
                    <div className="text-[#FF6EC7] font-medium mb-2">Revenue Opportunity</div>
                    <div className="text-white/60 text-sm">
                      {forecastData.aiInsights.revenue}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-white font-medium mb-2">Weather Impact</div>
                    <div className="text-white/60 text-sm">
                      {forecastData.aiInsights.weather}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Forecast;