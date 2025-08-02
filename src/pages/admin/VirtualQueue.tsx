import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion } from 'framer-motion';
import { Clock, Zap, Battery, Car, ChevronRight, CheckCircle } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

interface Booking {
  bookedAt: string;
  pin: number;
  slotTime: string;
  status: 'reserved' | 'active' | 'completed' | 'cancelled';
  userId: string;
  userName: string;
  createdAt?: string;
  id?: string;
}

interface Station {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  bookings: Booking[];
  availableSlots: number;
  totalSlots: number;
  chargingRate: number;
  pricePerKWh: number;
  amenities: string[];
}

const VirtualQueue: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all stations
  useEffect(() => {
    const q = query(collection(db, 'stations'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const stationsData: Station[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          stationsData.push({
            id: doc.id,
            name: data.name,
            location: data.location,
            address: data.address || "Address not available",
            bookings: data.bookings || [],
            availableSlots: data.availableSlots || 0,
            totalSlots: data.totalSlots || 0,
            chargingRate: data.chargingRate || 0,
            pricePerKWh: data.pricePerKWh || 0,
            amenities: data.amenities || []
          });
        });
        setStations(stationsData);
        setLoading(false);
      },
      (err) => {
        setError('Failed to load stations');
        console.error('Error loading stations:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatTime = (timeString: string) => {
    // Convert time string to Date object if needed
    try {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    } catch (e) {
      // If parsing fails, return the original string
    }
    return timeString;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reserved': return 'text-yellow-400';
      case 'active': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const formatLocation = (location: any) => {
    if (typeof location === 'string') return location;
    if (location?.lat && location?.lng) {
      return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
    }
    return 'Location not available';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16FFBD]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-6 text-center text-red-400">
        <p>{error}</p>
      </GlassCard>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8">
      <div className="container-responsive">
        <h1 className="text-3xl font-bold text-white mb-6">Virtual Queue</h1>
        
        {!selectedStation ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Select a Station</h2>
            {stations.map((station) => (
              <motion.div
                key={station.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassCard 
                  className="p-6 cursor-pointer" 
                  onClick={() => setSelectedStation(station)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">{station.name}</h3>
                      <p className="text-white/60">{station.address}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Zap className="w-4 h-4 text-[#FCEE09]" />
                          <span className="text-sm text-white/80">
                            {station.bookings?.filter(b => b.status === 'reserved' || b.status === 'active').length} active bookings
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Battery className="w-4 h-4 text-[#16FFBD]" />
                          <span className="text-sm text-white/80">
                            {station.chargingRate} kW
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-white/60" />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setSelectedStation(null)}
                className="flex items-center space-x-2 text-[#16FFBD] hover:text-[#16FFBD]/80"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                <span>Back to stations</span>
              </button>
              <h2 className="text-xl font-semibold text-white">
                {selectedStation.name} Queue
              </h2>
              <div className="w-8"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Station Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Address:</span>
                    <span className="text-white">{selectedStation.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Available Slots:</span>
                    <span className="text-white">
                      {selectedStation.availableSlots}/{selectedStation.totalSlots}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Charging Rate:</span>
                    <span className="text-white">{selectedStation.chargingRate} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Price:</span>
                    <span className="text-white">₹{selectedStation.pricePerKWh}/kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Amenities:</span>
                    <span className="text-white">
                      {selectedStation.amenities.join(', ')}
                    </span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Current Queue</h3>
                {selectedStation.bookings?.length === 0 ? (
                  <div className="text-center py-8 text-white/60">
                    No bookings in queue
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedStation.bookings
                      ?.filter(booking => booking.status !== 'completed' && booking.status !== 'cancelled')
                      .sort((a, b) => new Date(a.bookedAt).getTime() - new Date(b.bookedAt).getTime())
                      .map((booking) => (
                        <div key={`${booking.userId}-${booking.bookedAt}`} className="p-4 bg-white/5 rounded-xl">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-white font-medium">{booking.userName}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Clock className="w-4 h-4 text-white/40" />
                                <span className="text-white/60 text-sm">
                                  {formatTime(booking.slotTime)}
                                </span>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-white/40" />
                              <span className="text-white/80 text-sm">
                                PIN: {booking.pin}
                              </span>
                            </div>
                            <div className="text-white/60 text-sm">
                              Booked: {new Date(booking.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </GlassCard>
            </div>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Live Availability</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {Array.from({ length: selectedStation.totalSlots }).map((_, index) => {
                  const isBooked = selectedStation.bookings?.some(
                    b => (b.status === 'reserved' || b.status === 'active') && 
                         // This assumes bookings are assigned to specific slots
                         // You might need to adjust this logic based on your actual slot assignment
                         parseInt(b.slotTime.split(':')[0]) % selectedStation.totalSlots === index
                  );
                  const isAvailable = !isBooked && (index < selectedStation.availableSlots);
                  
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl flex flex-col items-center justify-center ${
                        isAvailable ? 'bg-[#16FFBD]/20 border border-[#16FFBD]/40' : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full mb-2 ${
                        isAvailable ? 'bg-[#16FFBD]' : 'bg-white/40'
                      }`}></div>
                      <span className="text-white">Slot {index + 1}</span>
                      <span className={`text-xs mt-1 ${
                        isAvailable ? 'text-[#16FFBD]' : 'text-white/60'
                      }`}>
                        {isAvailable ? 'Available' : 'Occupied'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualQueue;