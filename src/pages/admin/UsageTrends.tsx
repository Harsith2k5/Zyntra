import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Info, Clock, Zap, Sun, Moon } from 'lucide-react';
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

// Add these styles to your global CSS or component
const heatmapStyles = `
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
`;

// Enhanced mock data with more detailed patterns
const generateMockHeatmapData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return {
    days,
    hours,
    data: days.map((day, dayIndex) => 
      hours.map(hour => {
        // Base pattern with morning and evening peaks
        let intensity = 0.3;
        
        // Morning peak (7-9 AM)
        if (hour >= 7 && hour <= 9) intensity = 0.7;
        
        // Evening peak (5-8 PM)
        if (hour >= 17 && hour <= 20) intensity = 0.9;
        
        // Lunch dip (12-2 PM)
        if (hour >= 12 && hour <= 14) intensity = 0.5;
        
        // Night time drop
        if (hour >= 22 || hour <= 5) intensity = 0.1;
        
        // Weekends have different patterns
        if (dayIndex >= 5) { // Saturday and Sunday
          intensity -= 0.1; // Slightly lower base
          if (hour >= 10 && hour <= 18) intensity = 0.8; // Daytime peak
        }
        
        // Add some random variation
        intensity += (Math.random() * 0.1) - 0.05;
        
        return Math.min(1, Math.max(0, intensity));
      })
    ),
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
      { period: 'Morning Peak', time: '7:00 - 9:00 AM', utilization: 78, icon: Sun, color: '#16FFBD' },
      { period: 'Evening Peak', time: '6:00 - 8:00 PM', utilization: 92, icon: Zap, color: '#FCEE09' },
      { period: 'Night Low', time: '11:00 PM - 5:00 AM', utilization: 23, icon: Moon, color: '#FF6EC7' }
    ]
  };
};

const UsageTrends: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'hourly' | 'daily' | 'weekly'>('hourly');
  const [hoveredCell, setHoveredCell] = useState<{hour: number, day: number} | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  
  const {
    days,
    hours,
    data: heatmapData,
    dailyUsage,
    forecast,
    peakHours
  } = generateMockHeatmapData();

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
    labels: dailyUsage.map(day => day.day),
    datasets: [
      {
        label: 'Actual Sessions',
        data: dailyUsage.map(day => day.sessions),
        borderColor: '#16FFBD',
        backgroundColor: 'rgba(22, 255, 189, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Predicted Sessions',
        data: forecast.map(day => day.predicted),
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
      {/* Inject heatmap styles */}
      <style>{heatmapStyles}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Usage Trends</h1>
          <p className="text-white/60">Analyze charging patterns and station utilization</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
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
                {days.map((day) => (
                  <div key={day} className="text-white/60 text-sm text-right pr-2 h-[60px] flex items-center justify-end">
                    {day}
                  </div>
                ))}
              </div>

              {/* Heatmap Grid */}
              <div className="flex-1 relative">
                <div className="heatmap-grid">
                  {days.map((day, dayIndex) =>
                    hours.map((hour) => {
                      const intensity = heatmapData[dayIndex][hour];
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
            {hoveredCell && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4 bg-[#151515] border border-white/20 rounded-2xl p-4 z-20 shadow-lg w-64"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {days[hoveredCell.day]} {hoveredCell.hour}:00 - {hoveredCell.hour + 1}:00
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    heatmapData[hoveredCell.day][hoveredCell.hour] > 0.7 ? 'bg-red-500/20 text-red-400' :
                    heatmapData[hoveredCell.day][hoveredCell.hour] > 0.4 ? 'bg-[#FF6EC7]/20 text-[#FF6EC7]' :
                    'bg-white/10 text-white/60'
                  }`}>
                    {getTimeOfDayLabel(hoveredCell.hour)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60 text-sm">Utilization:</span>
                  <span className="text-white font-medium">
                    {Math.round(heatmapData[hoveredCell.day][hoveredCell.hour] * 100)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60 text-sm">Sessions:</span>
                  <span className="text-white font-medium">
                    {Math.round(heatmapData[hoveredCell.day][hoveredCell.hour] * 45)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Revenue:</span>
                  <span className="text-white font-medium">
                    ₹{Math.round(heatmapData[hoveredCell.day][hoveredCell.hour] * 2500)}
                  </span>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-[#16FFBD]">
                    {heatmapData[hoveredCell.day][hoveredCell.hour] > 0.7 ? (
                      'Peak hours - consider dynamic pricing'
                    ) : heatmapData[hoveredCell.day][hoveredCell.hour] < 0.3 ? (
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

      {/* Rest of your component remains the same */}
      {/* ... */}
    </div>
  );
};

export default UsageTrends;