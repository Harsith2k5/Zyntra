import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path to your firebase config

import { 
  TrendingUp, 
  Users, 
  Clock, 
  Lightbulb,
  Download,
  ChevronDown
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import NeonButton from '../../components/ui/NeonButton';
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


interface Booking {
  bookedAt: string;
  slotTime: string;
  status: string;
}

interface Revenue {
  amount: number;
  date: string;
}
interface StationData {
  bookings: Booking[];
  revenue: Revenue[];
  totalRevenue: number;
  // other fields you might need
}
interface AnalyticsData {
  overview: {
    totalSessions: number;
    sessionChange: string;
    revenue: number;
    revenueChange: string;
    peakHour: string;
    peakConsistency: string;
    utilizationRate: number;
    utilizationChange: string;
  };
  dailyTrends: {
    labels: string[];
    sessions: number[];
    revenue: number[];
  };
  smartTip: string;
}



const fetchStationData = async (): Promise<StationData> => {
  const docRef = doc(db, "stations", "zyntra_user_location");
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as StationData;
  } else {
    throw new Error("No such document!");
  }
};
const generateAnalyticsFromFirebase = (data: StationData, period: 'today' | 'week' | 'month'): AnalyticsData => {
  const now = new Date();
  
  // Filter bookings based on period
  const filteredBookings = data.bookings.filter(booking => {
    const bookingDate = new Date(booking.bookedAt);
    if (period === 'today') {
      return bookingDate.toDateString() === now.toDateString();
    } else if (period === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return bookingDate >= oneWeekAgo;
    } else {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return bookingDate >= oneMonthAgo;
    }
  });

  // Filter revenue based on period
  const filteredRevenue = data.revenue.filter(revenue => {
    const revenueDate = new Date(revenue.date);
    if (period === 'today') {
      return revenueDate.toDateString() === now.toDateString();
    } else if (period === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return revenueDate >= oneWeekAgo;
    } else {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return revenueDate >= oneMonthAgo;
    }
  });

  // Calculate total sessions (this should equal filteredBookings.length)
  const totalSessions = filteredBookings.length;

  // Calculate peak hour
  const timeSlots = filteredBookings.reduce((acc, booking) => {
    // Parse the slotTime (format: "05:00 PM")
    const [time, period] = booking.slotTime.split(' ');
    let [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    // Use the hour as key
    const hourKey = hours.toString().padStart(2, '0');
    acc[hourKey] = (acc[hourKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Find the hour with most bookings
  const peakHourEntry = Object.entries(timeSlots).reduce((max, entry) => 
    entry[1] > max[1] ? entry : max, ['00', 0]
  );

  // Format the peak hour display
  const peakHour = `${peakHourEntry[0]}:00 - ${(parseInt(peakHourEntry[0]) + 1).toString().padStart(2, '0')}:00`;

  // Calculate total revenue for period
  const periodRevenue = filteredRevenue.reduce((sum, rev) => sum + rev.amount, 0);

  // Generate labels and data for chart
  let labels: string[] = [];
  let sessionsData: number[] = [];
  let revenueData: number[] = [];

  if (period === 'today') {
    // Group by hour for today
    labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    sessionsData = Array(24).fill(0);
    filteredBookings.forEach(booking => {
      const hour = new Date(booking.bookedAt).getHours();
      sessionsData[hour]++;
    });
    
    // Similarly for revenue
    revenueData = Array(24).fill(0);
    filteredRevenue.forEach(rev => {
      const hour = new Date(rev.date).getHours();
      revenueData[hour] += rev.amount;
    });
  } else if (period === 'week') {
    // Group by day for week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    labels = days;
    sessionsData = Array(7).fill(0);
    filteredBookings.forEach(booking => {
      const day = new Date(booking.bookedAt).getDay(); // 0-6 (Sun-Sat)
      sessionsData[day]++;
    });
    
    // Similarly for revenue
    revenueData = Array(7).fill(0);
    filteredRevenue.forEach(rev => {
      const day = new Date(rev.date).getDay();
      revenueData[day] += rev.amount;
    });
  } else {
    // Group by day for month (last 30 days)
    const daysInPeriod = 30;
    labels = Array.from({ length: daysInPeriod }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (daysInPeriod - 1 - i));
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    
    sessionsData = Array(daysInPeriod).fill(0);
    filteredBookings.forEach(booking => {
      const bookingDate = new Date(booking.bookedAt);
      const today = new Date();
      const diffTime = today.getTime() - bookingDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const index = daysInPeriod - 1 - diffDays;
      if (index >= 0 && index < daysInPeriod) {
        sessionsData[index]++;
      }
    });
    
    // Similarly for revenue
    revenueData = Array(daysInPeriod).fill(0);
    filteredRevenue.forEach(rev => {
      const revDate = new Date(rev.date);
      const today = new Date();
      const diffTime = today.getTime() - revDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const index = daysInPeriod - 1 - diffDays;
      if (index >= 0 && index < daysInPeriod) {
        revenueData[index] += rev.amount;
      }
    });
  }

  // Calculate utilization rate
  const totalPossibleSessions = period === 'today' ? 24 : period === 'week' ? 7 * 24 : 30 * 24;
  const utilizationRate = Math.round((filteredBookings.length / totalPossibleSessions) * 100);

  return {
    overview: {
      totalSessions: totalSessions, // This will now match filteredBookings.length
      sessionChange: "0%",
      revenue: periodRevenue,
      revenueChange: "0%",
      peakHour,
      peakConsistency: "Consistent",
      utilizationRate,
      utilizationChange: "0%"
    },
    dailyTrends: {
      labels,
      sessions: sessionsData,
      revenue: revenueData
    },
    smartTip: `Peak usage detected around ${peakHour}. Consider implementing dynamic pricing to optimize revenue and reduce congestion during these hours.`
  };
};

const AdminOverview: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<'today' | 'week' | 'month'>('today');
  const [isExporting, setIsExporting] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [suggestionApplied, setSuggestionApplied] = useState(false);
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStationData();
        setStationData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load station data");
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const currentData = stationData ? generateAnalyticsFromFirebase(stationData, selectedDate) : null;

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  if (!currentData) {
    return <div className="flex justify-center items-center h-64 text-white">No data available</div>;
  }

  const handleExportCSV = () => {
    setIsExporting(true);
    
    // Simulate CSV generation and download
    const headers = ['Metric,Value,Change'];
    const rows = overviewCards.map(card => 
      `"${card.title}","${card.value}","${card.change}"`
    );
    
    const csvContent = [
      `Station Analytics Report - ${selectedDate}`,
      ...headers,
      ...rows,
      `"Generated at", "${new Date().toLocaleString()}"`
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `station_analytics_${selectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setIsExporting(false), 1500);
  };

  const handleApplySuggestion = () => {
    setIsApplyingSuggestion(true);
    // Simulate API call to apply suggestion
    setTimeout(() => {
      setIsApplyingSuggestion(false);
      setSuggestionApplied(true);
      // Show success toast/message
      alert('Suggestion applied successfully! Dynamic pricing will be activated during peak hours.');
    }, 2000);
  };

  const handleLearnMore = () => {
    setShowLearnMore(!showLearnMore);
  };

  const overviewCards = [
    {
      title: `${selectedDate === 'today' ? 'Today' : selectedDate === 'week' ? 'This Week' : 'This Month'} Sessions`,
      value: currentData.overview.totalSessions.toLocaleString(),
      icon: Users,
      color: 'mint',
      change: currentData.overview.sessionChange
    },
    {
      title: 'Revenue',
      value: `₹${currentData.overview.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'amber',
      change: currentData.overview.revenueChange
    },
    {
      title: 'Peak Time',
      value: currentData.overview.peakHour,
      icon: Clock,
      color: 'rose',
      change: currentData.overview.peakConsistency
    },
    {
      title: 'Utilization Rate',
      value: `${currentData.overview.utilizationRate}%`,
      icon: Lightbulb,
      color: 'mint',
      change: currentData.overview.utilizationChange
    }
  ];

  // Chart data configuration
  const chartData = {
    labels: currentData.dailyTrends.labels,
    datasets: [
      {
        label: 'Sessions',
        data: currentData.dailyTrends.sessions,
        borderColor: '#16FFBD',
        backgroundColor: 'rgba(22, 255, 189, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#16FFBD',
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'Revenue (₹)',
        data: currentData.dailyTrends.revenue,
        borderColor: '#FCEE09',
        backgroundColor: 'rgba(252, 238, 9, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FCEE09',
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y1'
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
          color: '#ffffff',
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#16FFBD',
        bodyColor: '#ffffff',
        borderColor: '#16FFBD',
        borderWidth: 1,
        padding: 10,
        usePointStyle: true
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
      },
      y1: {
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
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
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
          <p className="text-white/60">Station performance and analytics dashboard</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-40">
            <button 
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="w-full flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-white hover:border-[#16FFBD] transition-colors"
            >
              <span className="capitalize">{selectedDate}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDateDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 mt-1 w-full bg-[#0F172A] border border-white/10 rounded-xl overflow-hidden shadow-lg"
              >
                {(['today', 'week', 'month'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedDate(option);
                      setShowDateDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left capitalize hover:bg-white/5 transition-colors ${
                      selectedDate === option ? 'text-[#16FFBD]' : 'text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          
          <NeonButton
            variant="secondary"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </>
            )}
          </NeonButton>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-6 h-full" hoverable>
              <div className="flex items-start justify-between mb-4">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${card.color === 'mint' ? 'bg-[#16FFBD]/20' : 
                    card.color === 'amber' ? 'bg-[#FCEE09]/20' : 'bg-[#FF6EC7]/20'}
                `}>
                  <card.icon className={`
                    w-6 h-6
                    ${card.color === 'mint' ? 'text-[#16FFBD]' : 
                      card.color === 'amber' ? 'text-[#FCEE09]' : 'text-[#FF6EC7]'}
                  `} />
                </div>
                <span className={`text-sm font-medium ${
                  card.change.startsWith('+') ? 'text-[#16FFBD]' : 
                  card.change.startsWith('-') ? 'text-[#FF6EC7]' : 'text-[#FCEE09]'
                }`}>
                  {card.change}
                </span>
              </div>
              
              <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-white/60 text-sm">{card.title}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Usage Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-semibold text-white">
              {selectedDate === 'today' ? 'Hourly' : selectedDate === 'week' ? 'Daily' : 'Weekly'} Usage Trends
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#16FFBD] rounded-full"></div>
                <span className="text-white/60 text-sm">Sessions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#FCEE09] rounded-full"></div>
                <span className="text-white/60 text-sm">Revenue</span>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </GlassCard>
      </motion.div>

      {/* Smart Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="w-12 h-12 bg-[#FCEE09]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-[#FCEE09]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">Smart Tip</h3>
              <p className="text-white/60 mb-4">
                {currentData.smartTip}
              </p>
              
              {showLearnMore && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 bg-white/5 p-4 rounded-lg border border-white/10"
                >
                  <h4 className="text-[#FCEE09] font-medium mb-2">How This Works:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-white/60 text-sm">
                    <li>Dynamic pricing adjusts rates based on demand</li>
                    <li>During peak hours (6-8 PM), rates increase by 15-20%</li>
                    <li>Automated notifications inform users of busy periods</li>
                    <li>Revenue typically increases by 12-18% with this strategy</li>
                  </ul>
                </motion.div>
              )}
              
              <div className="flex flex-wrap gap-3">
                <NeonButton 
                  size="sm" 
                  glowColor="amber"
                  onClick={handleApplySuggestion}
                  disabled={isApplyingSuggestion || suggestionApplied}
                >
                  {isApplyingSuggestion ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Applying...
                    </>
                  ) : suggestionApplied ? (
                    <>
                      <svg className="w-4 h-4 mr-2 text-[#16FFBD]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Applied
                    </>
                  ) : (
                    'Apply Suggestion'
                  )}
                </NeonButton>
                
                <NeonButton 
                  variant="outline" 
                  size="sm"
                  onClick={handleLearnMore}
                >
                  {showLearnMore ? 'Hide Details' : 'Learn More'}
                </NeonButton>
                
                {suggestionApplied && (
                  <div className="flex items-center text-sm text-[#16FFBD] ml-2">
                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    Active until {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default AdminOverview;