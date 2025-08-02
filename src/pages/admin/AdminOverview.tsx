import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

const generateMockAnalytics = (period: 'today' | 'week' | 'month'): AnalyticsData => {
  const now = new Date();
  
  // Generate labels based on period
  let labels: string[] = [];
  if (period === 'today') {
    labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  } else if (period === 'week') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  } else {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    labels = Array.from({ length: Math.min(daysInMonth, 30) }, (_, i) => `${i + 1}/${now.getMonth() + 1}`);
  }

  // Generate session data with some randomness
  const sessions = labels.map((_, i) => {
    const base = period === 'today' ? 
      (i >= 6 && i <= 10 ? 150 : i >= 17 && i <= 21 ? 200 : 80) :
      period === 'week' ?
      (i >= 0 && i <= 4 ? 1200 : 1800) :
      Math.floor(3000 + Math.random() * 2000);
    
    return base + Math.floor(Math.random() * 200) - 100;
  });

  // Generate revenue data correlated with sessions but with some variation
  const revenue = sessions.map(s => {
    const multiplier = period === 'today' ? 
      (s > 180 ? 120 : s > 150 ? 100 : 80) :
      period === 'week' ?
      (s > 1700 ? 110 : 90) :
      95;
    return s * multiplier;
  });

  // Calculate peak hour
  let peakHour = '';
  if (period === 'today') {
    const peakIndex = sessions.indexOf(Math.max(...sessions));
    peakHour = `${peakIndex}:00 - ${peakIndex + 1}:00`;
  } else if (period === 'week') {
    const peakDay = labels[sessions.indexOf(Math.max(...sessions))];
    peakHour = `${peakDay} ${Math.floor(17 + Math.random() * 4)}:00`;
  } else {
    peakHour = `${Math.floor(17 + Math.random() * 4)}:00 - ${Math.floor(20 + Math.random() * 2)}:00`;
  }

  // Smart tips based on data
  const smartTips = [
    `Peak usage detected around ${peakHour}. Consider implementing dynamic pricing to optimize revenue and reduce congestion during these hours.`,
    `Your station is ${Math.floor(Math.random() * 20) + 70}% busier than similar stations in your area. Consider expanding capacity.`,
    `Revenue per session is ₹${Math.floor(revenue.reduce((a, b) => a + b, 0) / sessions.reduce((a, b) => a + b, 1))}. Premium services could increase this.`,
    `${period === 'today' ? 'Today' : period === 'week' ? 'This week' : 'This month'} has seen ${Math.floor(Math.random() * 30) + 10}% more sessions than average.`
  ];

  return {
    overview: {
      totalSessions: sessions.reduce((a, b) => a + b, 0),
      sessionChange: `${Math.floor(Math.random() * 20) - 5}%`,
      revenue: Math.floor(revenue.reduce((a, b) => a + b, 0)),
      revenueChange: `${Math.floor(Math.random() * 25) - 5}%`,
      peakHour,
      peakConsistency: ['Consistent', 'Growing', 'Fluctuating'][Math.floor(Math.random() * 3)],
      utilizationRate: Math.floor(Math.random() * 30) + 65,
      utilizationChange: `${Math.floor(Math.random() * 10) - 2}%`
    },
    dailyTrends: {
      labels,
      sessions,
      revenue
    },
    smartTip: smartTips[Math.floor(Math.random() * smartTips.length)]
  };
};

const mockData = {
  today: generateMockAnalytics('today'),
  week: generateMockAnalytics('week'),
  month: generateMockAnalytics('month')
};

const AdminOverview: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<'today' | 'week' | 'month'>('today');
  const [isExporting, setIsExporting] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [suggestionApplied, setSuggestionApplied] = useState(false);

  const currentData = mockData[selectedDate];

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