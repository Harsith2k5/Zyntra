/* import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Car, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  LogOut,
  Moon,
  Sun,
  Bell,
  Shield,
  CreditCard,
  Users
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { mockUser } from '../data/mockData';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [fleetMode, setFleetMode] = useState(mockUser.preferences.fleetMode);
  
  const [profileData, setProfileData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    joinDate: '2023-06-15'
  });

  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8">
      <div className="container-responsive">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-white/60">Manage your account and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                {!isEditing ? (
                  <NeonButton onClick={() => setIsEditing(true)} size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </NeonButton>
                ) : (
                  <div className="flex space-x-2">
                    <NeonButton onClick={handleSave} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </NeonButton>
                    <NeonButton onClick={handleCancel} variant="secondary" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </NeonButton>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <img
                    src={mockUser.avatar}
                    alt={profileData.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#16FFBD]/20"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#16FFBD] rounded-full flex items-center justify-center hover:bg-[#16FFBD]/80 transition-colors">
                      <Edit className="w-4 h-4 text-black" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{profileData.name}</h3>
                  <p className="text-white/60">{mockUser.wallet.tier} Member</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <span className="text-white/60 text-sm">
                      Member since {formatDate(profileData.joinDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-2xl">
                      <User className="w-5 h-5 text-white/40" />
                      <span className="text-white">{profileData.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-2xl">
                      <Mail className="w-5 h-5 text-white/40" />
                      <span className="text-white">{profileData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-2xl">
                      <Phone className="w-5 h-5 text-white/40" />
                      <span className="text-white">{profileData.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-2xl">
                      <MapPin className="w-5 h-5 text-white/40" />
                      <span className="text-white">{profileData.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">My Vehicles</h3>
                <div className="space-y-4">
                  {mockUser.vehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-2xl">
                      <Car className="w-5 h-5 text-[#16FFBD]" />
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {vehicle.brand} {vehicle.model}
                        </div>
                        <div className="text-white/60 text-sm">
                          {vehicle.batteryCapacity} kWh • {vehicle.currentCharge}% charged
                        </div>
                      </div>
                    </div>
                  ))}
                  <NeonButton variant="outline" size="sm" className="w-full">
                    Add Vehicle
                  </NeonButton>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {darkMode ? <Moon className="w-5 h-5 text-white/60" /> : <Sun className="w-5 h-5 text-white/60" />}
                      <span className="text-white">Dark Mode</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`
                        w-12 h-6 rounded-full border-2 transition-all duration-200 relative
                        ${darkMode ? 'bg-[#16FFBD] border-[#16FFBD]' : 'bg-white/10 border-white/20'}
                      `}>
                        <div className={`
                          w-4 h-4 rounded-full bg-white transition-all duration-200 absolute top-0.5
                          ${darkMode ? 'left-6' : 'left-0.5'}
                        `} />
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-white/60" />
                      <span className="text-white">Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`
                        w-12 h-6 rounded-full border-2 transition-all duration-200 relative
                        ${notifications ? 'bg-[#16FFBD] border-[#16FFBD]' : 'bg-white/10 border-white/20'}
                      `}>
                        <div className={`
                          w-4 h-4 rounded-full bg-white transition-all duration-200 absolute top-0.5
                          ${notifications ? 'left-6' : 'left-0.5'}
                        `} />
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-white/60" />
                      <span className="text-white">Fleet Mode</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fleetMode}
                        onChange={(e) => setFleetMode(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`
                        w-12 h-6 rounded-full border-2 transition-all duration-200 relative
                        ${fleetMode ? 'bg-[#FCEE09] border-[#FCEE09]' : 'bg-white/10 border-white/20'}
                      `}>
                        <div className={`
                          w-4 h-4 rounded-full bg-white transition-all duration-200 absolute top-0.5
                          ${fleetMode ? 'left-6' : 'left-0.5'}
                        `} />
                      </div>
                    </label>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors text-left">
                    <CreditCard className="w-5 h-5 text-white/60" />
                    <span className="text-white">Payment Methods</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors text-left">
                    <Shield className="w-5 h-5 text-white/60" />
                    <span className="text-white">Privacy & Security</span>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">Sign Out</span>
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; */
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  User,
  Edit,
  Save,
  X,
  Mail,
  Battery,
  Car,
  CreditCard,
  Calendar,
  LogOut,
  AlertCircle,
  Leaf,
  Wallet
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

type UserProfile = {
  name?: string;
  email?: string;
  emailVerified?: boolean;
  profilePictureUrl?: string;
  evName?: string;
  evModel?: string;
  batteryRemaining?: number;
  greenCredits?: number;
  walletBalance?: number;
  lastUpdated?: string;
  transactions?: Array<{
    id: string;
    amount: number;
    description: string;
    timestamp: string;
    type: string;
  }>;
};

const Profile: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfile>({});
  const [editData, setEditData] = useState<UserProfile>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const docRef = doc(db, 'userProfiles', user.uid);
        const unsub = onSnapshot(docRef, (snap) => {
          setIsLoading(true);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setProfileData(data);
            setEditData(data);
          } else {
            // Initialize new profile if doesn't exist
            const newProfile = {
              name: user.displayName || '',
              email: user.email || '',
              emailVerified: user.emailVerified || false,
              profilePictureUrl: user.photoURL || '',
              evName: '',
              evModel: '',
              batteryRemaining: 0,
              greenCredits: 0,
              walletBalance: 0,
              lastUpdated: new Date().toISOString(),
              transactions: []
            };
            setProfileData(newProfile);
            setEditData(newProfile);
          }
          setIsLoading(false);
        });
        return () => unsub();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    try {
      const updatedData = {
        ...editData,
        lastUpdated: new Date().toISOString()
      };
      await updateDoc(doc(db, 'userProfiles', userId), updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderField = (field: keyof UserProfile, label: string, icon: React.ReactNode) => {
  const value = isEditing ? editData[field] : profileData[field];
  const isEmpty = value === undefined || value === null || value === '';

  // Format the value for display
  const displayValue = () => {
    if (isEmpty) return 'Click edit to add information';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') {
      // Special formatting for battery percentage if this is the battery field
      if (field === 'batteryRemaining') return `${value}%`;
      return value.toString();
    }
    return value as string;
  };

  return (
    <div key={field} className="mb-4">
      <label className="block text-white/80 text-sm font-medium mb-2">
        {label}
        {isEmpty && !isEditing && (
          <span className="text-yellow-400 text-xs ml-2">(Not set)</span>
        )}
      </label>
      {isEditing ? (
        <input
          type={field === 'email' ? 'email' : 'text'}
          value={value as string || ''}
          onChange={(e) =>
            setEditData((prev) => ({
              ...prev,
              [field]: e.target.value
            }))
          }
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
      ) : (
        <div className={`flex items-center space-x-3 p-3 rounded-2xl ${
          isEmpty ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/5'
        }`}>
          {icon}
          <span className={isEmpty ? 'text-yellow-400 italic' : 'text-white'}>
            {displayValue()}
          </span>
        </div>
      )}
    </div>
  );
};

  const renderReadOnlyField = (field: keyof UserProfile, label: string, icon: React.ReactNode) => {
    const value = profileData[field];
    return (
      <div className="mb-4">
        <label className="block text-white/80 text-sm font-medium mb-2">{label}</label>
        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-2xl">
          {icon}
          <span className="text-white">
            {value !== undefined && value !== null ? value.toString() : 'N/A'}
          </span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16FFBD]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8">
      <div className="container-responsive">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-white/60">Manage your account and EV information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                {!isEditing ? (
                  <NeonButton onClick={() => setIsEditing(true)} size="sm">
                    <Edit className="w-4 h-4 mr-2" /> {profileData.name ? 'Edit' : 'Complete Profile'}
                  </NeonButton>
                ) : (
                  <div className="flex space-x-2">
                    <NeonButton onClick={handleSave} size="sm">
                      <Save className="w-4 h-4 mr-2" /> Save
                    </NeonButton>
                    <NeonButton onClick={handleCancel} variant="secondary" size="sm">
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </NeonButton>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-6 mb-8">
                {profileData.profilePictureUrl ? (
                  <img
                    src={profileData.profilePictureUrl}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#16FFBD]/20"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-white/10 border-4 border-[#16FFBD]/20">
                    <User className="w-10 h-10 text-white/60" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {profileData.name || 'Anonymous User'}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <Mail className="w-4 h-4 text-white/40" />
                    <span className="text-white/60 text-sm">
                      {profileData.email}
                      {profileData.emailVerified && (
                        <span className="text-[#16FFBD] ml-2">(Verified)</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <span className="text-white/60 text-sm">
                      Last updated: {formatDate(profileData.lastUpdated)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField('name', 'Full Name', <User className="w-5 h-5 text-white/40" />)}
                {renderField('evName', 'EV Name', <Car className="w-5 h-5 text-white/40" />)}
                {renderField('evModel', 'EV Model', <Car className="w-5 h-5 text-white/40" />)}
              </div>

              {!profileData.name && !isEditing && (
                <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-1">Profile Incomplete</h4>
                    <p className="text-yellow-400/80 text-sm">
                      Please complete your profile information to get the best experience
                    </p>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">EV & Wallet</h3>
              
              {renderReadOnlyField('batteryRemaining', 'Battery Remaining', <Battery className="w-5 h-5 text-white/40" />)}
              {renderReadOnlyField('greenCredits', 'Green Credits', <Leaf className="w-5 h-5 text-white/40" />)}
              {renderReadOnlyField('walletBalance', 'Wallet Balance', <Wallet className="w-5 h-5 text-white/40" />)}

              <div className="mt-6">
                <h4 className="text-white/80 text-sm font-medium mb-2">Recent Transactions</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {profileData.transactions?.slice(0, 3).map((txn) => (
                    <div key={txn.id} className="p-3 bg-white/5 rounded-xl">
                      <div className="flex justify-between">
                        <span className="text-white">{txn.description}</span>
                        <span className={`font-medium ${
                          txn.type === 'recharge' ? 'text-[#16FFBD]' : 'text-white'
                        }`}>
                          ₹{txn.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-white/60 text-xs mt-1">
                        {formatDate(txn.timestamp)}
                      </div>
                    </div>
                  ))}
                  {(!profileData.transactions || profileData.transactions.length === 0) && (
                    <div className="text-center py-4 text-white/60">
                      No transactions yet
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 bg-red-500/10 hover:bg-red-500/20 rounded-2xl text-left transition"
              >
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="text-red-400">Sign Out</span>
              </button>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;