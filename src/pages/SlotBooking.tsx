/* import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Zap, 
  CheckCircle, 
  QrCode, 
  Share2,
  Calendar,
  CreditCard
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { mockStations, mockBookingSlots } from '../data/mockData';

const SlotBooking: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [fastLane, setFastLane] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(600);
  const [pinVerified, setPinVerified] = useState(false);
  const [checkingPin, setCheckingPin] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPin, setGeneratedPin] = useState('');

  const station = mockStations.find(s => s.id === stationId);
  const slots = mockBookingSlots.filter(slot => slot.stationId === stationId);
  const selectedSlotData = slots.find(slot => slot.id === selectedSlot);

  // Countdown timer for booking confirmation
  useEffect(() => {
    if (showConfirmation && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showConfirmation, countdown]);

  // Mock PIN verification
  useEffect(() => {
    if (showConfirmation && generatedPin && !pinVerified) {
      const timer = setTimeout(() => {
        setPinVerified(true);
      }, 5000); // Auto-verify after 5 seconds for demo purposes
      return () => clearTimeout(timer);
    }
  }, [showConfirmation, generatedPin, pinVerified]);

  const handleBookSlot = async () => {
    if (selectedSlot) {
      try {
        setError(null);
        setBookingLoading(true);
        
        // Mock booking process
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        // Generate a random 6-digit PIN
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedPin(pin);
        setShowConfirmation(true);
        setCountdown(600); // 10 minute countdown
      } catch (error) {
        console.error('Error:', error);
        setError('Booking failed');
      } finally {
        setBookingLoading(false);
      }
    }
  };

  const getSlotColor = (slot: any) => {
    if (!slot.isAvailable) return 'bg-red-500/20 border-red-500/40 text-red-400';
    if (slot.congestionLevel === 'low') return 'bg-[#16FFBD]/20 border-[#16FFBD]/40 text-[#16FFBD]';
    if (slot.congestionLevel === 'medium') return 'bg-[#FCEE09]/20 border-[#FCEE09]/40 text-[#FCEE09]';
    return 'bg-red-500/20 border-red-500/40 text-red-400';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!station) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-xl">Station not found</h2>
          <NeonButton onClick={() => navigate('/discover')} className="mt-4">
            Back to Discover
          </NeonButton>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-[#16FFBD]/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-[#16FFBD]" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
            <p className="text-white/60 mb-6">
              Your charging slot at {station.name} is reserved
            </p>

            <div className="mb-6 p-4 bg-[#16FFBD]/10 rounded-lg">
              <div className="flex justify-center items-center space-x-2">
                <Clock className="w-5 h-5 text-[#16FFBD]" />
                <span className="text-[#16FFBD] font-medium">
                  Time remaining: {formatTime(countdown)}
                </span>
              </div>
            </div>

            <div className="mb-6 min-h-[72px] flex items-center justify-center">
              {pinVerified ? (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 w-full">
                  <div className="flex justify-center items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-500 font-medium">PIN Verified - Charging Started</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#FCEE09]/10 rounded-lg border border-[#FCEE09]/30 w-full">
                  <div className="flex justify-center items-center space-x-2">
                    <Clock className="w-5 h-5 text-[#FCEE09]" />
                    <span className="text-[#FCEE09] font-medium">
                      {checkingPin ? "Verifying PIN..." : "Enter PIN at Station"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Time Slot</span>
                <span className="text-white font-medium">{selectedSlotData?.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Cost</span>
                <span className="text-white font-medium">₹{selectedSlotData?.cost}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">PIN Code</span>
                <span className="text-[#16FFBD] font-bold text-lg tracking-widest">
                  {generatedPin}
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <NeonButton
                variant="secondary"
                onClick={() => {}}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </NeonButton>
              <NeonButton
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Done
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8">
      <div className="container-responsive">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Book Charging Slot</h1>
          <p className="text-white/60">Statiq Tech Mahindra Station</p>
        </motion.div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 rounded-lg text-red-400">
            Error: {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-6 h-6 text-[#16FFBD]" />
              <h2 className="text-xl font-semibold text-white">Select Time Slot</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {slots.map((slot) => (
                <motion.button
                  key={slot.id}
                  onClick={() => slot.isAvailable && setSelectedSlot(slot.id)}
                  disabled={!slot.isAvailable}
                  className={`
                    p-4 rounded-2xl border-2 transition-all duration-200 text-center
                    ${selectedSlot === slot.id 
                      ? 'border-[#16FFBD] bg-[#16FFBD]/20 scale-105' 
                      : getSlotColor(slot)
                    }
                    ${slot.isAvailable ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}
                  `}
                  whileHover={slot.isAvailable ? { scale: 1.05 } : {}}
                  whileTap={slot.isAvailable ? { scale: 0.95 } : {}}
                >
                  <div className="font-semibold text-lg mb-1">{slot.time}</div>
                  <div className="text-sm opacity-80 mb-2">{slot.duration} min</div>
                  <div className="text-sm font-medium">₹{slot.cost}</div>
                  {!slot.isAvailable && (
                    <div className="text-xs mt-1 opacity-60">Booked</div>
                  )}
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#FCEE09]/20 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#FCEE09]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Fast Lane</h3>
                  <p className="text-white/60 text-sm">Priority charging with 15% faster speeds</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-[#FCEE09] font-medium">+₹9</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fastLane}
                    onChange={(e) => setFastLane(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`
                    w-12 h-6 rounded-full border-2 transition-all duration-200 relative
                    ${fastLane ? 'bg-[#FCEE09] border-[#FCEE09]' : 'bg-white/10 border-white/20'}
                  `}>
                    <div className={`
                      w-4 h-4 rounded-full bg-white transition-all duration-200 absolute top-0.5
                      ${fastLane ? 'left-6' : 'left-0.5'}
                    `} />
                  </div>
                </label>
              </div>
            </div>
            
            {fastLane && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-[#FCEE09]/10 rounded-2xl border border-[#FCEE09]/20"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#FCEE09]" />
                  <span className="text-[#FCEE09] font-medium">Fast Lane Active</span>
                </div>
                <p className="text-white/60 text-sm mt-2">
                  Reduced wait time by 3 minutes and 15% faster charging speed
                </p>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>

        {selectedSlot && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="w-6 h-6 text-[#16FFBD]" />
                <h2 className="text-xl font-semibold text-white">Booking Summary</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Station</span>
                  <span className="text-white font-medium">{station.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Time Slot</span>
                  <span className="text-white font-medium">{selectedSlotData?.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Duration</span>
                  <span className="text-white font-medium">{selectedSlotData?.duration} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Base Cost</span>
                  <span className="text-white font-medium">₹{selectedSlotData?.cost}</span>
                </div>
                {fastLane && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Fast Lane</span>
                    <span className="text-[#FCEE09] font-medium">+₹9</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-[#16FFBD] font-bold text-lg">
                      ₹{(selectedSlotData?.cost || 0) + (fastLane ? 9 : 0)}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex space-x-4"
        >
          <NeonButton
            variant="secondary"
            onClick={() => navigate('/discover')}
            className="flex-1"
          >
            Cancel
          </NeonButton>
          <NeonButton
            onClick={handleBookSlot}
            disabled={!selectedSlot || bookingLoading}
            className="flex-1"
          >
            {bookingLoading ? (
              <span className="flex items-center justify-center">
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Booking...
              </span>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Book Slot
              </>
            )}
          </NeonButton>
        </motion.div>
      </div>
    </div>
  );
};

export default SlotBooking; */
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Clock, Calendar, CheckCircle } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const SlotBooking: React.FC = () => {
  const { stationId } = useParams();
  const { state } = useLocation();
  const { stationName, stationAddress } = state || {};
  const navigate = useNavigate();
  const auth = getAuth();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [pin, setPin] = useState<number | null>(null);

  // Available time slots
  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  const handleBook = async () => {
    if (!selectedTime || !stationId || !auth.currentUser) return;

    try {
      setIsBooking(true);
      const user = auth.currentUser;
      
      // Generate random 4-digit PIN
      const newPin = Math.floor(1000 + Math.random() * 9000);
      
      // Create booking object
      const booking = {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        bookedAt: new Date().toISOString(),
        slotTime: selectedTime,
        pin: newPin,
        status: "reserved"
      };

      // Update station document with new booking
      const stationRef = doc(db, "stations", stationId);
      await updateDoc(stationRef, {
        bookings: arrayUnion(booking)
      });

      setPin(newPin);
      setBookingComplete(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to complete booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (!stationName) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-xl">Station information missing</h2>
          <NeonButton onClick={() => navigate('/discover')} className="mt-4">
            Back to Map
          </NeonButton>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] pt-20 flex items-center justify-center px-4">
        <GlassCard className="p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-[#16FFBD]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#16FFBD]" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-white/60 mb-6">
            Your charging slot at {stationName} is reserved
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Time Slot</span>
              <span className="text-white font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">PIN Code</span>
              <span className="text-[#16FFBD] font-bold text-lg tracking-widest">
                {pin}
              </span>
            </div>
          </div>

          <NeonButton
            onClick={() => navigate('/discover')}
            className="w-full"
          >
            Done
          </NeonButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8">
      <div className="container-responsive">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Book Charging Slot</h1>
          <p className="text-white/60">{stationName}</p>
          {stationAddress && (
            <p className="text-white/60 text-sm mt-1">{stationAddress}</p>
          )}
        </div>

        <GlassCard className="p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-[#16FFBD]" />
            <h2 className="text-xl font-semibold text-white">Select Time Slot</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`
                  p-4 rounded-2xl border-2 transition-all
                  ${selectedTime === time 
                    ? 'border-[#16FFBD] bg-[#16FFBD]/20' 
                    : 'border-white/20 hover:border-white/40'
                  }
                `}
              >
                <div className="font-semibold">{time}</div>
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="flex space-x-4">
          <NeonButton
            variant="secondary"
            onClick={() => navigate('/discover')}
            className="flex-1"
          >
            Cancel
          </NeonButton>
          <NeonButton
            onClick={handleBook}
            disabled={!selectedTime || isBooking}
            className="flex-1"
          >
            {isBooking ? (
              <span className="flex items-center justify-center">
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Booking...
              </span>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Confirm Booking
              </>
            )}
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default SlotBooking;