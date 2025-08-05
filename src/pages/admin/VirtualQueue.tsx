import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase'; // Make sure auth is exported
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, Zap, BatteryCharging, Car, ChevronRight, ShieldCheck, UserPlus, 
    IndianRupee, Wrench, MapPin 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// A placeholder for your GlassCard component for standalone functionality
const GlassCard: React.FC<{ className?: string; children: React.ReactNode; onClick?: () => void }> = ({ className, children, onClick }) => (
  <div 
    className={`bg-slate-900/40 border border-slate-700/50 backdrop-blur-lg rounded-2xl ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// --- TYPE DEFINITIONS ---
interface Booking {
  bookedAt: string;
  pin: number;
  slotTime: string;
  status: 'reserved' | 'active' | 'completed' | 'cancelled';
  userId: string;
  userName: string;
}

interface Station {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  bookings: Booking[];
  availableSlots: number;
  totalSlots: number;
  chargingRate: number;
  pricePerKWh: number;
  amenities: string[];
}

interface StationDocument {
    name: string;
    location: { lat: number; lng: number; };
    bookings: Booking[];
    availableSlots: number;
    totalSlots: number;
    chargingRate: number;
    pricePerKWh: number;
    amenities: string[];
}

// --- MODAL PROP TYPES ---
interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: number) => void;
  booking: Booking | null;
}

interface WalkinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, password: string) => Promise<void>;
}

// --- ANIMATION VARIANTS ---
const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const listItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// --- MODAL COMPONENTS ---
const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSubmit, booking }) => {
    const [pin, setPin] = useState('');
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); if (pin.length === 4) { onSubmit(parseInt(pin)); setPin(''); } else { toast.error('PIN must be 4 digits.'); } };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPin(e.target.value.replace(/\D/g, '')); };
    return (<AnimatePresence>{isOpen && (<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"><motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-sm"><GlassCard className="p-6"><form onSubmit={handleSubmit}><h3 className="text-xl font-bold text-white mb-2">Verify Booking</h3><p className="text-slate-400 mb-4">Enter the 4-digit PIN for {booking?.userName}.</p><input type="password" maxLength={4} value={pin} onChange={handleInputChange} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg text-center text-3xl tracking-[1rem] p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#16FFBD]" placeholder="----" autoFocus /><div className="flex justify-end space-x-3 mt-6"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Cancel</button><button type="submit" className="px-6 py-2 rounded-lg bg-[#16FFBD] text-black font-bold hover:bg-opacity-80 transition-colors">Verify</button></div></form></GlassCard></motion.div></div>)}</AnimatePresence>);
};

const WalkinModal: React.FC<WalkinModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); if (email && password) { await onSubmit(email, password); } else { toast.error('Please enter email and password.'); } };
    return (<AnimatePresence>{isOpen && (<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"><motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-sm"><GlassCard className="p-6"><form onSubmit={handleSubmit}><h3 className="text-xl font-bold text-white mb-4">Walk-in User Login</h3><div className="space-y-4"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16FFBD]" placeholder="Email Address" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16FFBD]" placeholder="Password" /></div><div className="flex justify-end space-x-3 mt-6"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">Cancel</button><button type="submit" className="px-6 py-2 rounded-lg bg-[#16FFBD] text-black font-bold hover:bg-opacity-80 transition-colors">Log In & Join Queue</button></div></form></GlassCard></motion.div></div>)}</AnimatePresence>);
};

// --- MAIN COMPONENT ---
const VirtualQueue: React.FC = () => {
    const [stations, setStations] = useState<Station[]>([]);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPinModalOpen, setPinModalOpen] = useState(false);
    const [isWalkinModalOpen, setWalkinModalOpen] = useState(false);
    const [bookingToVerify, setBookingToVerify] = useState<Booking | null>(null);

  useEffect(() => {
    const MOCK_RATES = [25, 50, 75, 120, 150, 180, 250];
    
    const q = query(collection(db, 'stations'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const stationsData: Station[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as StationDocument;
            const pseudoRandomRate = MOCK_RATES[doc.id.charCodeAt(0) % MOCK_RATES.length];
            stationsData.push({
                id: doc.id,
                name: data.name,
                location: data.location,
                bookings: data.bookings || [],
                availableSlots: data.availableSlots || 0,
                totalSlots: data.totalSlots || 8,
                chargingRate: data.chargingRate || pseudoRandomRate,
                pricePerKWh: data.pricePerKWh || 18,
                amenities: data.amenities?.length ? data.amenities : ["Restroom", "Wi-Fi"],
            });
        });
        setStations(stationsData);
        setSelectedStation(current => current ? stationsData.find(s => s.id === current.id) || null : null);
        setLoading(false);
    }, (err) => {
        setError('Failed to load stations'); console.error(err); setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenPinModal = (booking: Booking) => { setBookingToVerify(booking); setPinModalOpen(true); };
  const handleVerifyPin = (enteredPin: number) => { if (!bookingToVerify) return; const slotTime = new Date(bookingToVerify.slotTime); if (isNaN(slotTime.getTime())) { toast.error("Invalid booking time."); return; } const now = new Date(); const timeDifference = Math.abs(now.getTime() - slotTime.getTime()); const fifteenMinutes = 15 * 60 * 1000; if (timeDifference > fifteenMinutes) { toast.error('Outside the 15-minute verification window.'); return; } if (enteredPin === bookingToVerify.pin) { toast.success('Verification Successful!'); setPinModalOpen(false); setBookingToVerify(null); } else { toast.error('Incorrect PIN.'); } };
  const handleWalkin = async (email: string, password: string) => { if (!selectedStation) return; const toastId = toast.loading('Authenticating...'); try { const userCredential = await signInWithEmailAndPassword(auth, email, password); const user = userCredential.user; toast.dismiss(toastId); toast.success(`Welcome, ${user.displayName || user.email}!`); const stationRef = doc(db, 'stations', selectedStation.id); const latestValidBookingTime = selectedStation.bookings.filter(b => ['reserved', 'active'].includes(b.status)).map(b => new Date(b.slotTime).getTime()).filter(t => !isNaN(t)).reduce((max, current) => (current > max ? current : max), 0); const baseTime = new Date(); if (latestValidBookingTime > 0) { baseTime.setTime(latestValidBookingTime); } baseTime.setHours(baseTime.getHours() + 1, 0, 0, 0); const nextSlotTime = baseTime; const newBooking: Booking = { userId: user.uid, userName: user.displayName || 'Walk-in User', bookedAt: new Date().toISOString(), slotTime: nextSlotTime.toISOString(), pin: Math.floor(1000 + Math.random() * 9000), status: 'reserved', }; await updateDoc(stationRef, { bookings: arrayUnion(newBooking) }); toast.success('Successfully added to the queue!'); setWalkinModalOpen(false); } catch (error: any) { toast.dismiss(toastId); toast.error(error.code === 'auth/invalid-credential' ? 'Invalid email or password.' : 'Login failed.'); console.error("Walk-in error:", error); } };
  
  const getStatusColor = (status: Booking['status']) => { switch(status) { case 'reserved': return 'bg-yellow-400/20 text-yellow-300'; case 'active': return 'bg-green-400/20 text-green-300'; default: return 'bg-slate-400/20 text-slate-300'; } };
  const formatTime = (timeString: string) => { try { return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch (e) { return "Invalid Time"; } };

  if (loading && !stations.length) {
    return (
        <div className="flex justify-center items-center h-screen bg-slate-950">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16FFBD]"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(18,164,138,0.3),rgba(255,255,255,0))] text-slate-100 font-sans">
      <Toaster position="top-center" toastOptions={{ style: { background: '#2D3748', color: '#FFF' } }}/>
      <PinModal isOpen={isPinModalOpen} onClose={() => setPinModalOpen(false)} onSubmit={handleVerifyPin} booking={bookingToVerify} />
      <WalkinModal isOpen={isWalkinModalOpen} onClose={() => setWalkinModalOpen(false)} onSubmit={handleWalkin} />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Virtual Queue</h1>
          <p className="text-slate-400">Real-time charging station status across all locations</p>
        </header>

        <AnimatePresence mode="wait">
          {!selectedStation ? (
            <motion.div
              key="station-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={listContainerVariants}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {stations.map((station) => {
                // FIX: Calculate queue count directly from bookings array
                const queueCount = station.bookings.filter(b => ['reserved', 'active'].includes(b.status)).length;
                const availableNow = station.totalSlots - queueCount > 0;

                return (
                    <motion.div key={station.id} variants={listItemVariants}>
                    <GlassCard 
                        className="p-6 cursor-pointer group transition-all duration-300 hover:border-teal-400/80 hover:bg-slate-900/60" 
                        onClick={() => setSelectedStation(station)}
                    >
                        <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white">{station.name}</h3>
                        <div className={`text-xs px-3 py-1 font-semibold rounded-full ${availableNow ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {availableNow ? 'Accepting' : 'Full'}
                        </div>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400 text-sm mb-6">
                            <MapPin size={16} />
                            <span>{station.location.lat.toFixed(3)}, {station.location.lng.toFixed(3)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-slate-950/50 p-3 rounded-lg">
                                <p className="text-2xl font-semibold text-white">{queueCount}/{station.totalSlots}</p>
                                <p className="text-xs text-slate-400">Queue</p>
                            </div>
                            <div className="bg-slate-950/50 p-3 rounded-lg">
                                <p className="text-2xl font-semibold text-white">{station.chargingRate}<span className="text-lg">kW</span></p>
                                <p className="text-xs text-slate-400">Max Rate</p>
                            </div>
                        </div>
                        <div className="mt-6 text-center text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details <ChevronRight className="inline-block" size={16} />
                        </div>
                    </GlassCard>
                    </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div key="station-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => setSelectedStation(null)} className="flex items-center space-x-2 text-[#16FFBD] hover:text-white transition-colors font-semibold">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                  <span>All Stations</span>
                </button>
                <button onClick={() => setWalkinModalOpen(true)} className="flex items-center space-x-2 text-black bg-[#16FFBD] px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors shadow-lg shadow-teal-500/20">
                  <UserPlus className="w-5 h-5" />
                  <span>Walk-in</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Queue */}
                <GlassCard className="lg:col-span-2 p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Live Queue</h3>
                    <motion.div variants={listContainerVariants} initial="hidden" animate="visible" className="space-y-3 max-h-[28rem] overflow-y-auto pr-2">
                    {selectedStation.bookings?.filter(b => ['reserved', 'active'].includes(b.status)).length > 0 ? (
                        selectedStation.bookings.filter(b => ['reserved', 'active'].includes(b.status))
                            .sort((a, b) => new Date(a.slotTime).getTime() - new Date(b.slotTime).getTime())
                            .map((booking, index) => (
                            <motion.div key={booking.userId + booking.bookedAt} variants={listItemVariants} className="p-4 bg-slate-950/60 rounded-xl flex items-center justify-between hover:bg-slate-900 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="text-lg font-bold text-teal-400">#{index + 1}</div>
                                    <div>
                                        <h4 className="font-medium text-white">{booking.userName}</h4>
                                        <div className="flex items-center space-x-2 mt-1 text-slate-400 text-sm">
                                            <Clock size={14} /><span>Slot: {formatTime(booking.slotTime)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className={`text-xs capitalize px-3 py-1 font-semibold rounded-full ${getStatusColor(booking.status)}`}>{booking.status}</div>
                                    <button onClick={() => handleOpenPinModal(booking)} className="p-2 rounded-lg bg-slate-800 hover:bg-teal-500/20 text-teal-400 transition-colors"><ShieldCheck size={20} /></button>
                                </div>
                            </motion.div>
                            ))
                    ) : (<div className="flex flex-col items-center justify-center h-64 text-slate-500"><Car size={48} /><p className="mt-4">The queue is empty.</p></div>)}
                    </motion.div>
                </GlassCard>

                {/* Vitals & Slots */}
                <div className="space-y-6">
                    <GlassCard className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Station Vitals</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center"><BatteryCharging size={16} className="mr-2"/>Max Rate</span><span className="font-semibold text-white">{selectedStation.chargingRate} kW</span></div>
                            <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center"><IndianRupee size={16} className="mr-2"/>Price</span><span className="font-semibold text-white">₹{selectedStation.pricePerKWh} / kWh</span></div>
                            <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center"><Wrench size={16} className="mr-2"/>Amenities</span><span className="font-semibold text-white text-right">{selectedStation.amenities.join(', ')}</span></div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Slot Status</h3>
                        <div className="grid grid-cols-3 gap-3">
                        {Array.from({ length: selectedStation.totalSlots }).map((_, index) => {
                            const occupiedCount = selectedStation.bookings?.filter(b => ['reserved', 'active'].includes(b.status)).length || 0;
                            const isOccupied = index < occupiedCount;
                            return (
                                <div key={index} className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${!isOccupied ? 'bg-green-500/10 border border-green-500/40 animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]' : 'bg-slate-800/50'}`}>
                                    <Car size={24} className={!isOccupied ? 'text-green-400' : 'text-slate-600'} />
                                    <span className={`text-xs mt-2 font-bold ${!isOccupied ? 'text-green-400' : 'text-slate-500'}`}>{!isOccupied ? 'FREE' : 'IN USE'}</span>
                                </div>
                            );
                        })}
                        </div>
                    </GlassCard>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default VirtualQueue;