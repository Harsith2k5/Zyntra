import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Info, Clock, Zap, Sun, Moon, Loader2 } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Booking {
  bookedAt: string;
  slotTime: string;
  status: string;
  userId: string;
  userName: string;
}

interface UsageData {
  heatmap: {
    days: string[];
    hours: number[];
    data: number[][];
  };
  dailyUsage: Array<{
    day: string;
    sessions: number;
    revenue: number;
  }>;
  forecast: Array<{
    day: string;
    predicted: number;
  }>;
  peakHours: Array<{
    period: string;
    time: string;
    utilization: number;
    color: string;
  }>;
  insights: {
    busiestDay: string;
    busiestHour: string;
    recommendation: string;
  };
}

const UsageTrends: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'hourly' | 'daily' | 'weekly'>('hourly');
  const [hoveredCell, setHoveredCell] = useState<{hour: number, day: number} | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Fetch booking data from Firebase
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setIsLoading(true);
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

        // Process data for usage trends
        const processedData = await processUsageData(bookings);
        setUsageData(processedData);
      } catch (error) {
        console.error('Error fetching booking data:', error);
        // Fallback to mock data if API fails
        setUsageData(generateMockUsageData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [timeRange]);

  // Process raw booking data into usage trends format
  const processUsageData = async (bookings: Booking[]): Promise<UsageData> => {
    try {
      // Call backend API for advanced processing
      const response = await axios.post('/api/usage-trends', {
        bookings,
        timeRange
      });
      return response.data;
    } catch (error) {
      console.error('Error processing usage data:', error);
      // Fallback to local processing if API fails
      return processUsageDataLocally(bookings);
    }
  };

  // Local processing fallback
  const processUsageDataLocally = (bookings: Booking[]): UsageData => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    // Initialize heatmap data
    const heatmapData = days.map(() => hours.map(() => 0));
    const dailyUsageData = days.map(day => ({
      day,
      sessions: 0,
      revenue: 0
    }));
    
    // Process each booking
    bookings.forEach(booking => {
      try {
        const date = new Date(booking.bookedAt);
        const dayIndex = (date.getDay() + 6) % 7; // Convert to 0-6 (Mon-Sun)
        const hour = parseInt(booking.slotTime.split(':')[0]);
        const isPM = booking.slotTime.includes('PM') && hour !== 12;
        const hour24 = isPM ? hour + 12 : hour === 12 ? 0 : hour;
        
        // Update heatmap
        heatmapData[dayIndex][hour24] += 1;
        
        // Update daily usage
        dailyUsageData[dayIndex].sessions += 1;
        dailyUsageData[dayIndex].revenue += 30; // Assuming ₹30 per session
      } catch (e) {
        console.error('Error processing booking:', booking, e);
      }
    });
    
    // Normalize heatmap data (0-1 scale)
    const maxSessions = Math.max(...heatmapData.flat());
    const normalizedHeatmap = heatmapData.map(day => 
      day.map(hour => hour / Math.max(maxSessions, 1))
    );
    
    // Generate forecast (simple projection)
    const forecast = dailyUsageData.map(day => ({
      day: day.day,
      predicted: Math.floor(day.sessions * 1.1) // 10% growth
    }));
    
    // Find peak hours
    let maxHour = 0;
    let maxDay = 0;
    let maxValue = 0;
    heatmapData.forEach((day, dayIdx) => {
      day.forEach((hour, hourIdx) => {
        if (hour > maxValue) {
          maxValue = hour;
          maxDay = dayIdx;
          maxHour = hourIdx;
        }
      });
    });
    
    return {
      heatmap: {
        days,
        hours,
        data: normalizedHeatmap
      },
      dailyUsage: dailyUsageData,
      forecast,
      peakHours: [
        {
          period: 'Morning Peak',
          time: '7:00 - 9:00 AM',
          utilization: Math.floor(normalizedHeatmap[maxDay][7] * 100),
          color: '#16FFBD'
        },
        {
          period: 'Evening Peak',
          time: '6:00 - 8:00 PM',
          utilization: Math.floor(normalizedHeatmap[maxDay][18] * 100),
          color: '#FCEE09'
        },
        {
          period: 'Night Low',
          time: '11:00 PM - 5:00 AM',
          utilization: Math.floor(normalizedHeatmap[maxDay][23] * 100),
          color: '#FF6EC7'
        }
      ],
      insights: {
        busiestDay: days[maxDay],
        busiestHour: `${maxHour}:00`,
        recommendation: `Increase capacity during ${days[maxDay]} ${maxHour}:00 - ${maxHour + 1}:00 when utilization peaks`
      }
    };
  };

  // Generate mock data for fallback
  const generateMockUsageData = (): UsageData => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    const heatmapData = days.map((day, dayIndex) => 
      hours.map(hour => {
        let intensity = 0.3;
        if (hour >= 7 && hour <= 9) intensity = 0.7;
        if (hour >= 17 && hour <= 20) intensity = 0.9;
        if (hour >= 12 && hour <= 14) intensity = 0.5;
        if (hour >= 22 || hour <= 5) intensity = 0.1;
        if (dayIndex >= 5) {
          intensity -= 0.1;
          if (hour >= 10 && hour <= 18) intensity = 0.8;
        }
        intensity += (Math.random() * 0.1) - 0.05;
        return Math.min(1, Math.max(0, intensity));
      })
    );
    
    return {
      heatmap: { days, hours, data: heatmapData },
      dailyUsage: days.map((day, index) => ({
        day,
        sessions: Math.floor(100 + (Math.random() * 900)),
        revenue: Math.floor(5000 + (Math.random() * 15000))
      })),
      forecast: days.map((day, index) => ({
        day,
        predicted: Math.floor(100 + (Math.random() * 1000))
      })),
      peakHours: [
        { period: 'Morning Peak', time: '7:00 - 9:00 AM', utilization: 78, color: '#16FFBD' },
        { period: 'Evening Peak', time: '6:00 - 8:00 PM', utilization: 92, color: '#FCEE09' },
        { period: 'Night Low', time: '11:00 PM - 5:00 AM', utilization: 23, color: '#FF6EC7' }
      ],
      insights: {
        busiestDay: 'Fri',
        busiestHour: '19:00',
        recommendation: 'Increase capacity on Friday evenings when utilization peaks at 92%'
      }
    };
  };

  const getIntensityClass = (intensity: number) => {
    if (intensity < 0.2) return 'intensity-0';
    if (intensity < 0.4) return 'intensity-1';
    if (intensity < 0.6) return 'intensity-2';
    if (intensity < 0.8) return 'intensity-3';
    return 'intensity-4';
  };

  const getTimeOfDayLabel = (hour: number) => {
    if (hour < 5) return 'Late Night';
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    if (hour < 21) return 'Evening';
    return 'Night';
  };

  const chartData = {
    labels: usageData?.dailyUsage.map(day => day.day) || [],
    datasets: [
      {
        label: 'Actual Sessions',
        data: usageData?.dailyUsage.map(day => day.sessions) || [],
        borderColor: '#16FFBD',
        backgroundColor: 'rgba(22, 255, 189, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Predicted Sessions',
        data: usageData?.forecast.map(day => day.predicted) || [],
        borderColor: '#FF6EC7',
        borderDash: [5, 5],
        borderWidth: 2,
        tension: 0.4,
        pointRadius: showForecast ? 3 : 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff'
        },
        display: showForecast
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#16FFBD',
        bodyColor: '#ffffff',
        borderColor: '#16FFBD',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Heatmap styles */}
      <style>{`
        .heatmap-grid {
          display: grid;
          grid-template-columns: repeat(24, minmax(0, 1fr));
          gap: 2px;
          height: 420px;
        }
        
        .heatmap-cell {
          border-radius: 2px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .heatmap-cell:hover {
          transform: scale(1.1);
          z-index: 10;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
        }
        
        .intensity-0 { background-color: rgba(255, 255, 255, 0.05) }
        .intensity-1 { background-color: rgba(22, 255, 189, 0.2) }
        .intensity-2 { background-color: rgba(252, 238, 9, 0.4) }
        .intensity-3 { background-color: rgba(255, 110, 199, 0.6) }
        .intensity-4 { background-color: rgba(255, 0, 0, 0.8) }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Usage Trends</h1>
          <p className="text-white/60">Analyze charging patterns and station utilization</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value as 'hourly' | 'daily' | 'weekly')}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
          >
            <option value="hourly">Hourly View</option>
            <option value="daily">Daily View</option>
            <option value="weekly">Weekly View</option>
          </select>
          
          <button
            onClick={() => setShowForecast(!showForecast)}
            className={`px-4 py-2 rounded-2xl text-sm font-medium ${
              showForecast 
                ? 'bg-[#FF6EC7]/20 text-[#FF6EC7] border border-[#FF6EC7]/30'
                : 'bg-white/5 text-white/80 hover:bg-white/10'
            }`}
          >
            {showForecast ? 'Hide Forecast' : 'Show Forecast'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#16FFBD]" />
        </div>
      ) : (
        <>
          {/* Heatmap Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold text-white">Station Utilization Heatmap</h2>
                <div className="flex items-center flex-wrap gap-2">
                  {['Low (0-20%)', 'Moderate (20-40%)', 'High (40-60%)', 'Very High (60-80%)', 'Peak (80-100%)'].map((label, i) => (
                    <div key={label} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded ${`intensity-${i}`}`}></div>
                      <span className="text-white/60 text-xs">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                {/* Y-axis labels (Days) */}
                <div className="flex">
                  <div className="w-12 flex flex-col justify-between h-[420px]">
                    {usageData?.heatmap.days.map((day) => (
                      <div key={day} className="text-white/60 text-sm text-right pr-2 h-[60px] flex items-center justify-end">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap Grid */}
                  <div className="flex-1 relative">
                    <div className="heatmap-grid">
                      {usageData?.heatmap.days.map((day, dayIndex) =>
                        usageData?.heatmap.hours.map((hour) => {
                          const intensity = usageData.heatmap.data[dayIndex][hour];
                          return (
                            <motion.div
                              key={`${day}-${hour}`}
                              className={`heatmap-cell ${getIntensityClass(intensity)}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: (dayIndex * 0.05) + (hour * 0.002) }}
                              onMouseEnter={() => setHoveredCell({ hour, day: dayIndex })}
                              onMouseLeave={() => setHoveredCell(null)}
                            />
                          );
                        })
                      )}
                    </div>

                    {/* X-axis labels (Hours) */}
                    <div className="flex justify-between mt-2 text-white/60 text-xs">
                      {[0, 6, 12, 18, 24].map((hour) => (
                        <span key={hour}>{hour}:00</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Tooltip */}
                {hoveredCell && usageData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 bg-[#151515] border border-white/20 rounded-2xl p-4 z-20 shadow-lg w-64"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {usageData.heatmap.days[hoveredCell.day]} {hoveredCell.hour}:00 - {hoveredCell.hour + 1}:00
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        usageData.heatmap.data[hoveredCell.day][hoveredCell.hour] > 0.7 ? 'bg-red-500/20 text-red-400' :
                        usageData.heatmap.data[hoveredCell.day][hoveredCell.hour] > 0.4 ? 'bg-[#FF6EC7]/20 text-[#FF6EC7]' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {getTimeOfDayLabel(hoveredCell.hour)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/60 text-sm">Utilization:</span>
                      <span className="text-white font-medium">
                        {Math.round(usageData.heatmap.data[hoveredCell.day][hoveredCell.hour] * 100)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/60 text-sm">Sessions:</span>
                      <span className="text-white font-medium">
                        {Math.round(usageData.heatmap.data[hoveredCell.day][hoveredCell.hour] * 45)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Revenue:</span>
                      <span className="text-white font-medium">
                        ₹{Math.round(usageData.heatmap.data[hoveredCell.day][hoveredCell.hour] * 2500)}
                      </span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-[#16FFBD]">
                        {usageData.heatmap.data[hoveredCell.day][hoveredCell.hour] > 0.7 ? (
                          'Peak hours - consider dynamic pricing'
                        ) : usageData.heatmap.data[hoveredCell.day][hoveredCell.hour] < 0.3 ? (
                          'Low usage - good time for maintenance'
                        ) : (
                          'Normal usage - standard rates apply'
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Usage Trends</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#16FFBD] rounded-full"></div>
                    <span className="text-white/60 text-sm">Actual</span>
                  </div>
                  {showForecast && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#FF6EC7] rounded-full"></div>
                      <span className="text-white/60 text-sm">Forecast</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="h-80">
                <Line data={chartData} options={chartOptions} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Peak Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {usageData?.peakHours.map((peak, index) => (
              <GlassCard key={peak.period} className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${peak.color}20` }}
                  >
                    {peak.period.includes('Morning') ? (
                      <Sun className="w-6 h-6" style={{ color: peak.color }} />
                    ) : peak.period.includes('Evening') ? (
                      <Zap className="w-6 h-6" style={{ color: peak.color }} />
                    ) : (
                      <Moon className="w-6 h-6" style={{ color: peak.color }} />
                    )}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{peak.period}</div>
                    <div className="text-white/60 text-sm">{peak.time}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">{peak.utilization}%</div>
                <div className="text-sm" style={{ color: peak.color }}>
                  {peak.period.includes('Peak') ? 'High demand period' : 'Low utilization period'}
                </div>
              </GlassCard>
            ))}
          </motion.div>

          {/* AI Insights */}
          {usageData?.insights && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-[#16FFBD]/20 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-[#16FFBD]" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">AI Insights</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-[#16FFBD]/10 rounded-2xl border border-[#16FFBD]/20">
                    <div className="text-[#16FFBD] font-medium mb-2">Busiest Period</div>
                    <div className="text-white/60 text-sm">
                      {usageData.insights.busiestDay} at {usageData.insights.busiestHour}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-white font-medium mb-2">Recommendation</div>
                    <div className="text-white/60 text-sm">
                      {usageData.insights.recommendation}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default UsageTrends;