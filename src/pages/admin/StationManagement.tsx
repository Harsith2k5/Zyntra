import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Power, 
  MapPin, 
  Zap,
  Users,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  AlertCircle,
  HardDrive,
  BatteryCharging,
  Wifi
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import NeonButton from '../../components/ui/NeonButton';
import { mockStations } from '../../data/mockData';

interface ChargingStation {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  distance?: number;
  waitTime?: number;
  pricing?: string;
  rating: number;
  amenities?: string[];
  plugTypes: string[];
  isAIPick?: boolean;
  congestionLevel: 'low' | 'medium' | 'high';
  solarPowered?: boolean;
  isActive?: boolean;
  images?: string[];
  reviews?: {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  power?: string; // Added missing property
}

const StationManagement: React.FC = () => {
  const [stations, setStations] = useState<ChargingStation[]>(mockStations);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: keyof ChargingStation; direction: 'ascending' | 'descending'} | null>(null);
  const [expandedStation, setExpandedStation] = useState<string | null>(null);

  // Filter stations based on search term
  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort stations with type safety
  const sortedStations = [...filteredStations].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key;
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === undefined || bValue === undefined) return 0;

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof ChargingStation) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const toggleStationStatus = (stationId: string) => {
    setStations(prev => prev.map(station => 
      station.id === stationId 
        ? { ...station, isActive: !station.isActive }
        : station
    ));
  };

  const deleteStation = (stationId: string) => {
    setStations(prev => prev.filter(station => station.id !== stationId));
  };

  const toggleExpandStation = (stationId: string) => {
    setExpandedStation(expandedStation === stationId ? null : stationId);
  };

  const getStatusColor = (isActive?: boolean) => {
    return isActive ? 'text-[#16FFBD]' : 'text-red-400';
  };

  const getStatusBg = (isActive?: boolean) => {
    return isActive ? 'bg-[#16FFBD]/20' : 'bg-red-500/20';
  };

  const getUsageColor = (usage: 'low' | 'medium' | 'high') => {
    return usage === 'low' ? 'text-[#16FFBD]' :
           usage === 'medium' ? 'text-[#FCEE09]' : 'text-[#FF6EC7]';
  };

  const getUsagePercentage = (usage: 'low' | 'medium' | 'high') => {
    return usage === 'low' ? '23%' :
           usage === 'medium' ? '67%' : '89%';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-[#FCEE09] fill-[#FCEE09]' : 'text-white/20'}`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Station Management</h1>
          <p className="text-white/60">Monitor and manage charging station network</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search stations..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <NeonButton onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Station
          </NeonButton>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard hoverable className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#16FFBD]/20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#16FFBD]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stations.length}</div>
              <div className="text-white/60 text-sm">Total Stations</div>
            </div>
          </div>
          <motion.div 
            className="absolute inset-0 rounded-2xl border border-[#16FFBD]/30 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
            whileHover={{ opacity: 1 }}
          />
        </GlassCard>

        <GlassCard hoverable className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#FCEE09]/20 rounded-full flex items-center justify-center">
              <Power className="w-6 h-6 text-[#FCEE09]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stations.filter(s => s.isActive !== false).length}</div>
              <div className="text-white/60 text-sm">Active Stations</div>
            </div>
          </div>
          <motion.div 
            className="absolute inset-0 rounded-2xl border border-[#FCEE09]/30 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
            whileHover={{ opacity: 1 }}
          />
        </GlassCard>

        <GlassCard hoverable className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#FF6EC7]/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-[#FF6EC7]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-white/60 text-sm">Active Sessions</div>
            </div>
          </div>
          <motion.div 
            className="absolute inset-0 rounded-2xl border border-[#FF6EC7]/30 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
            whileHover={{ opacity: 1 }}
          />
        </GlassCard>

        <GlassCard hoverable className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">4.2</div>
              <div className="text-white/60 text-sm">Avg Wait (min)</div>
            </div>
          </div>
          <motion.div 
            className="absolute inset-0 rounded-2xl border border-white/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
            whileHover={{ opacity: 1 }}
          />
        </GlassCard>
      </div>

      {/* Stations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/60 font-medium py-4 pl-6">Station</th>
                  <th 
                    className="text-left text-white/60 font-medium py-4 cursor-pointer hover:text-white transition-colors"
                    onClick={() => requestSort('location')}
                  >
                    <div className="flex items-center">
                      Location
                      {sortConfig?.key === 'location' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left text-white/60 font-medium py-4 cursor-pointer hover:text-white transition-colors"
                    onClick={() => requestSort('isActive')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig?.key === 'isActive' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left text-white/60 font-medium py-4 cursor-pointer hover:text-white transition-colors"
                    onClick={() => requestSort('congestionLevel')}
                  >
                    <div className="flex items-center">
                      Usage
                      {sortConfig?.key === 'congestionLevel' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left text-white/60 font-medium py-4 cursor-pointer hover:text-white transition-colors"
                    onClick={() => requestSort('rating')}
                  >
                    <div className="flex items-center">
                      Rating
                      {sortConfig?.key === 'rating' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="text-left text-white/60 font-medium py-4 pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedStations.map((station) => (
                  <React.Fragment key={station.id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => toggleExpandStation(station.id)}
                    >
                      <td className="py-4 pl-6">
                        <div className="flex items-center space-x-3">
                          <div className={`
                            w-3 h-3 rounded-full flex-shrink-0
                            ${station.isActive !== false ? 'bg-[#16FFBD]' : 'bg-red-500'}
                          `} />
                          <div>
                            <div className="text-white font-medium">{station.name}</div>
                            <div className="text-white/60 text-sm flex items-center space-x-2">
                              <span>{station.plugTypes.join(', ')}</span>
                              {station.solarPowered && (
                                <span className="text-[#FCEE09] text-xs flex items-center">
                                  <BatteryCharging className="w-3 h-3 mr-1" /> Solar
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-white/40 flex-shrink-0" />
                          <span className="text-white/60 text-sm truncate max-w-xs">
                            {station.location.address}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`
                          px-3 py-1 rounded-full text-sm font-medium
                          ${getStatusBg(station.isActive)} ${getStatusColor(station.isActive)}
                        `}>
                          {station.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className={`text-sm font-medium ${getUsageColor(station.congestionLevel)}`}>
                          {getUsagePercentage(station.congestionLevel)}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {renderStars(station.rating)}
                          </div>
                          <span className="text-white text-sm">{station.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStationStatus(station.id);
                            }}
                            className={`
                              p-2 rounded-full transition-colors
                              ${station.isActive
                                ? 'hover:bg-red-500/20 text-red-400' 
                                : 'hover:bg-[#16FFBD]/20 text-[#16FFBD]'
                              }
                            `}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteStation(station.id);
                            }}
                            className="p-2 rounded-full hover:bg-red-500/20 text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>

                    <AnimatePresence>
                      {expandedStation === station.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-b border-white/5"
                        >
                          <td colSpan={6} className="px-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                              <div>
                                <h4 className="text-white/80 font-medium mb-3 flex items-center">
                                  <HardDrive className="w-4 h-4 mr-2" />
                                  Station Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Power Output:</span>
                                    <span className="text-white">{station.power || '50 kW'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Connectors:</span>
                                    <span className="text-white">{station.plugTypes.join(', ')}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Pricing:</span>
                                    <span className="text-white">{station.pricing || '₹15.0/kWh'}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-white/80 font-medium mb-3 flex items-center">
                                  <Wifi className="w-4 h-4 mr-2" />
                                  Amenities
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {station.amenities?.map((amenity, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs text-white">
                                      {amenity}
                                    </span>
                                  )) || (
                                    <span className="text-white/60 text-sm">No amenities listed</span>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-white/80 font-medium mb-3 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  Recent Issues
                                </h4>
                                <div className="text-white/60 text-sm">
                                  {station.isActive === false ? (
                                    <div className="text-red-400 flex items-center">
                                      <AlertCircle className="w-4 h-4 mr-2" />
                                      Station currently offline
                                    </div>
                                  ) : (
                                    <div className="text-[#16FFBD] flex items-center">
                                      <span className="w-2 h-2 bg-[#16FFBD] rounded-full mr-2"></span>
                                      No reported issues
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      {/* Add Station Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-md"
            >
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Add New Station</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Station Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none"
                      placeholder="Enter station name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none"
                      placeholder="Enter full address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Plug Types
                      </label>
                      <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none">
                        <option value="">Select plug types</option>
                        <option value="type2">Type 2</option>
                        <option value="ccs">CCS</option>
                        <option value="chademo">CHAdeMO</option>
                        <option value="gb/t">GB/T</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Power Output
                      </label>
                      <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none">
                        <option value="">Select power</option>
                        <option value="22">22 kW</option>
                        <option value="50">50 kW</option>
                        <option value="120">120 kW</option>
                        <option value="150">150 kW</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Pricing (₹/kWh)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none"
                      placeholder="Enter price per kWh"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Amenities
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['WiFi', 'Restroom', 'Cafe', 'Waiting Area', 'Shopping', '24/7'].map(amenity => (
                        <button
                          key={amenity}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white transition-colors"
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <NeonButton
                    variant="secondary"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </NeonButton>
                  <NeonButton
                    onClick={() => setShowAddModal(false)}
                    className="flex-1"
                  >
                    Add Station
                  </NeonButton>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StationManagement;