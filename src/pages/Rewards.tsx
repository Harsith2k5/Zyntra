import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Star, 
  Trophy, 
  Leaf, 
  Zap, 
  Crown,
  CheckCircle,
  Clock,
  X,
  Loader2,
  ChevronLeft,
  BatteryCharging,
  Car,
  Coffee,
  ShoppingBag,
  
  Plane,
  Bus,
  Bike
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

import { doc, onSnapshot, updateDoc, collection, getDocs, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { User as FirebaseAuthUser } from 'firebase/auth';

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: 'discount' | 'merchandise' | 'experience' | 'carbon';
  image: string;
  available: boolean;
  tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  redemptionCode?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  maxProgress: number;
  completed: boolean;
  pointsReward: number;
}

interface RedemptionHistory {
  id: string;
  rewardTitle: string;
  pointsUsed: number;
  redeemedAt: string;
  status: 'completed' | 'pending' | 'expired';
  redemptionCode?: string;
}

const Rewards: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rewards');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionHistory[]>([]);
  const [userPoints, setUserPoints] = useState(1250);
  const [userTier, setUserTier] = useState('Silver');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTierUpgrade, setShowTierUpgrade] = useState(false);
  const [newTier, setNewTier] = useState('');
  const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  // Sample rewards data with images
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: '10% Off Next Charge',
      description: 'Get 10% discount on your next EV charging session',
      pointsRequired: 500,
      category: 'discount',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      available: true,
      tier: 'Bronze',
      redemptionCode: 'CHARGEDISC10'
    },
    {
      id: '2',
      title: 'Eco-Friendly Water Bottle',
      description: 'Premium stainless steel water bottle with your name engraved',
      pointsRequired: 1200,
      category: 'merchandise',
      image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      available: true,
      tier: 'Silver'
    },
    {
      id: '3',
      title: 'VIP Charging Lounge Access',
      description: 'One-day access to premium charging lounge with free snacks',
      pointsRequired: 2000,
      category: 'experience',
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      available: true,
      tier: 'Gold',
      redemptionCode: 'VIPLOUNGE2023'
    },
    {
      id: '4',
      title: 'Carbon Offset Certificate',
      description: 'Offset 1 ton of CO2 emissions with verified certificate',
      pointsRequired: 1500,
      category: 'carbon',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      available: true,
      tier: 'Silver'
    },
    {
      id: '5',
      title: 'Free Coffee for a Month',
      description: 'Daily free coffee at participating charging stations',
      pointsRequired: 800,
      category: 'discount',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      available: true,
      tier: 'Bronze',
      redemptionCode: 'COFFEEMONTH'
    },
    {
      id: '6',
      title: 'Tesla Model 3 Test Drive',
      description: 'Exclusive 1-hour test drive experience with a Tesla Model 3',
      pointsRequired: 2500,
      category: 'experience',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      available: true,
      tier: 'Platinum'
    }
  ]);

  // Sample achievements data
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'a1',
      title: 'First Charge',
      description: 'Complete your first EV charging session',
      icon: BatteryCharging,
      progress: 1,
      maxProgress: 1,
      completed: true,
      pointsReward: 100
    },
    {
      id: 'a2',
      title: 'Eco Warrior',
      description: 'Charge your EV 10 times using renewable energy',
      icon: Leaf,
      progress: 7,
      maxProgress: 10,
      completed: false,
      pointsReward: 500
    },
    {
      id: 'a3',
      title: 'Road Trip Ready',
      description: 'Complete 5 long-distance charging sessions',
      icon: Car,
      progress: 3,
      maxProgress: 5,
      completed: false,
      pointsReward: 300
    },
    {
      id: 'a4',
      title: 'Carbon Neutral',
      description: 'Offset 1 ton of CO2 emissions',
      icon:"N/A",
      progress: 0,
      maxProgress: 1,
      completed: false,
      pointsReward: 200
    },
    {
      id: 'a5',
      title: 'Public Transport Pro',
      description: 'Use public transport 20 times instead of driving',
      icon: Bus,
      progress: 12,
      maxProgress: 20,
      completed: false,
      pointsReward: 400
    }
  ]);

  // Sample redemption history
  const sampleRedemptionHistory: RedemptionHistory[] = [
    {
      id: 'h1',
      rewardTitle: '15% Off Next Charge',
      pointsUsed: 750,
      redeemedAt: '2023-05-15T10:30:00Z',
      status: 'completed',
      redemptionCode: 'CHARGEDISC15'
    },
    {
      id: 'h2',
      rewardTitle: 'Eco Tote Bag',
      pointsUsed: 900,
      redeemedAt: '2023-04-22T14:15:00Z',
      status: 'completed'
    },
    {
      id: 'h3',
      rewardTitle: 'Free Coffee for a Week',
      pointsUsed: 400,
      redeemedAt: '2023-06-01T08:45:00Z',
      status: 'expired'
    },
    {
      id: 'h4',
      rewardTitle: 'VIP Charging Lounge Access',
      pointsUsed: 2000,
      redeemedAt: '2023-06-10T16:20:00Z',
      status: 'pending',
      redemptionCode: 'VIPLOUNGE2023'
    }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      // Initialize with sample data
      setRedemptionHistory(sampleRedemptionHistory);
    });
    return unsubscribe;
  }, []);

  const filteredRewards = rewards.filter(reward => 
    selectedCategory === 'all' || reward.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'discount': return Gift;
      case 'merchandise': return Star;
      case 'experience': return Crown;
      case 'carbon': return Leaf;
      default: return Gift;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-[#16FFBD]';
      case 'pending': return 'text-[#FCEE09]';
      case 'expired': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
    setShowConfirmation(true);
  };

  const confirmRedemption = async () => {
    if (!selectedReward || !currentUser) return;
    
    try {
      const newPoints = userPoints - selectedReward.pointsRequired;
      
      const newRedemption: RedemptionHistory = {
        id: `RH${Date.now()}`,
        rewardTitle: selectedReward.title,
        pointsUsed: selectedReward.pointsRequired,
        redeemedAt: new Date().toISOString(),
        status: 'completed',
        redemptionCode: selectedReward.redemptionCode
      };
      
      setUserPoints(newPoints);
      setRedemptionHistory([newRedemption, ...redemptionHistory]);
      setShowConfirmation(false);
      
      // Tier upgrade logic
      if (newPoints >= 3000 && userTier !== 'Platinum') {
        setNewTier('Platinum');
        setUserTier('Platinum');
        setTimeout(() => {
          setShowTierUpgrade(true);
        }, 1000);
      } else if (newPoints >= 2000 && userTier === 'Silver') {
        setNewTier('Gold');
        setUserTier('Gold');
        setTimeout(() => {
          setShowTierUpgrade(true);
        }, 1000);
      } else if (newPoints >= 1000 && userTier === 'Bronze') {
        setNewTier('Silver');
        setUserTier('Silver');
        setTimeout(() => {
          setShowTierUpgrade(true);
        }, 1000);
      }
      
      setShowSuccess(true);
    } catch (error) {
      console.error("Error redeeming reward:", error);
    }
  };

  const closeModals = () => {
    setShowConfirmation(false);
    setShowSuccess(false);
    setShowTierUpgrade(false);
    setSelectedReward(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8 relative overflow-hidden">
      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1A1A1A] border border-[#16FFBD]/30 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Confirm Redemption</h3>
                <button onClick={closeModals} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                  <img
                    src={selectedReward.image}
                    alt={selectedReward.title}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200';
                    }}
                  />
                  <div>
                    <h4 className="text-white font-medium">{selectedReward.title}</h4>
                    <p className="text-white/60 text-sm">{selectedReward.description}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-[#FCEE09]" />
                    <span className="text-white">Points to redeem</span>
                  </div>
                  <span className="text-xl font-bold text-[#FCEE09]">
                    -{selectedReward.pointsRequired}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-[#16FFBD]" />
                    <span className="text-white">Remaining points</span>
                  </div>
                  <span className="text-xl font-bold text-[#16FFBD]">
                    {userPoints - selectedReward.pointsRequired}
                  </span>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={closeModals}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRedemption}
                    className="flex-1 py-3 bg-gradient-to-r from-[#16FFBD] to-[#2BD2FF] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1A1A1A] border border-[#16FFBD]/30 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-[#16FFBD]/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-[#16FFBD]" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Redemption Successful!</h3>
                <p className="text-white/70 mb-6">You've redeemed {selectedReward.title}</p>
                
                {selectedReward.redemptionCode && (
                  <div className="mb-6">
                    <div className="text-white/60 text-sm mb-2">Your redemption code:</div>
                    <div className="bg-[#16FFBD]/10 border border-[#16FFBD]/30 rounded-xl py-3 px-6 text-[#16FFBD] font-mono text-lg tracking-wider">
                      {selectedReward.redemptionCode}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={closeModals}
                  className="w-full py-3 bg-gradient-to-r from-[#16FFBD] to-[#2BD2FF] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tier Upgrade Modal */}
      <AnimatePresence>
        {showTierUpgrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full max-w-2xl bg-gradient-to-br from-[#FCEE09]/10 to-[#FF6EC7]/10 border border-[#FCEE09]/30 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
              
              <div className="p-8 text-center relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-24 h-24 bg-gradient-to-br from-[#FCEE09] to-[#FF6EC7] rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Crown className="w-12 h-12 text-black" />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  Tier Upgraded to {newTier}!
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/80 mb-8 max-w-md mx-auto"
                >
                  Congratulations! You've unlocked exclusive {newTier} tier benefits including higher rewards, priority support, and special promotions.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="grid grid-cols-3 gap-4 mb-8"
                >
                  <div className="bg-black/30 p-4 rounded-xl border border-[#FCEE09]/20">
                    <Star className="w-6 h-6 text-[#FCEE09] mx-auto mb-2" />
                    <div className="text-xs text-white/80">+30% Points</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-[#FF6EC7]/20">
                    <Zap className="w-6 h-6 text-[#FF6EC7] mx-auto mb-2" />
                    <div className="text-xs text-white/80">Priority Charging</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-[#16FFBD]/20">
                    <Gift className="w-6 h-6 text-[#16FFBD] mx-auto mb-2" />
                    <div className="text-xs text-white/80">Exclusive Rewards</div>
                  </div>
                </motion.div>
                
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  onClick={closeModals}
                  className="px-8 py-3 bg-gradient-to-r from-[#FCEE09] to-[#FF6EC7] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Continue to Rewards
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container-responsive">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Rewards</h1>
          <p className="text-white/60">Redeem your GreenPoints for exclusive rewards</p>
        </motion.div>

        {/* Points Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard className="p-6" hoverable glowColor="amber">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#FCEE09]/20 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-[#FCEE09]" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">
                    {userPoints.toLocaleString()}
                  </div>
                  <div className="text-white/60">Available GreenPoints</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Crown className="w-4 h-4 text-[#FCEE09]" />
                    <span className="text-[#FCEE09] text-sm font-medium">
                      {userTier} Tier
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-sm mb-1">Next Tier</div>
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FCEE09] to-[#FF6EC7]" 
                    style={{ 
                      width: `${userTier === 'Platinum' ? '100%' : userTier === 'Gold' ? '75%' : userTier === 'Silver' ? '50%' : '25%'}` 
                    }} 
                  />
                </div>
                <div className="text-white/60 text-xs mt-1">
                  {userTier === 'Platinum' ? 'Max tier reached' : 
                   `${userTier === 'Gold' ? 3000 - userPoints : 
                     userTier === 'Silver' ? 2000 - userPoints : 
                     1000 - userPoints} points to ${userTier === 'Gold' ? 'Platinum' : 
                     userTier === 'Silver' ? 'Gold' : 'Silver'}`}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-6 mb-8">
          {[
            { id: 'rewards', label: 'Rewards' },
            { id: 'achievements', label: 'Achievements' },
            { id: 'history', label: 'History' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                pb-2 border-b-2 transition-colors font-medium
                ${activeTab === tab.id 
                  ? 'border-[#16FFBD] text-[#16FFBD]' 
                  : 'border-transparent text-white/60 hover:text-white'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Category Filter */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {[
                { id: 'all', label: 'All', icon: Gift },
                { id: 'discount', label: 'Discounts', icon: Gift },
                { id: 'merchandise', label: 'Merchandise', icon: ShoppingBag },
                { id: 'experience', label: 'Experience', icon: Crown },
                { id: 'carbon', label: 'Carbon Offset', icon: Leaf }
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all whitespace-nowrap
                    ${selectedCategory === category.id 
                      ? 'bg-[#16FFBD]/20 text-[#16FFBD] border border-[#16FFBD]/40' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>

            {/* Rewards Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-[#16FFBD] animate-spin" />
              </div>
            ) : filteredRewards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard className="p-6 h-full" hoverable>
                      <div className="relative mb-4">
                        <img
                          src={reward.image}
                          alt={reward.title}
                          className="w-full h-32 object-cover rounded-2xl"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200';
                          }}
                        />
                        {!reward.available && (
                          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                            <span className="text-white/80 text-sm font-medium">Coming Soon</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-white font-semibold">{reward.title}</h3>
                          <p className="text-white/60 text-sm">{reward.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-[#FCEE09]" />
                            <span className="text-white font-medium">
                              {reward.pointsRequired.toLocaleString()}
                            </span>
                          </div>
                          {reward.tier && (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              reward.tier === 'Platinum' ? 'bg-purple-500/20 text-purple-400' :
                              reward.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                              reward.tier === 'Silver' ? 'bg-gray-400/20 text-gray-300' :
                              'bg-amber-800/20 text-amber-600'
                            }`}>
                              {reward.tier}
                            </span>
                          )}
                        </div>
                        
                        <NeonButton
                          size="sm"
                          disabled={!reward.available || userPoints < reward.pointsRequired}
                          className="w-full"
                          glowColor={reward.available && userPoints >= reward.pointsRequired ? 'mint' : 'amber'}
                          onClick={() => handleRedeemClick(reward)}
                        >
                          {!reward.available ? 'Coming Soon' :
                           userPoints < reward.pointsRequired ? 'Insufficient Points' :
                           'Redeem'}
                        </NeonButton>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            ) : (
              <GlassCard className="p-6 text-center">
                <div className="py-8 flex flex-col items-center">
                  <Gift className="w-12 h-12 text-white/30 mb-4" />
                  <h3 className="text-white font-medium mb-2">No Rewards Available</h3>
                  <p className="text-white/60 max-w-md">
                    Check back later for new rewards to redeem with your GreenPoints
                  </p>
                </div>
              </GlassCard>
            )}
          </motion.div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6" hoverable>
                    <div className="flex items-center space-x-4">
                      <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center
                        ${achievement.completed ? 'bg-[#16FFBD]/20' : 'bg-white/10'}
                      `}>
                        <achievement.icon className={`
                          w-8 h-8
                          ${achievement.completed ? 'text-[#16FFBD]' : 'text-white/60'}
                        `} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-white font-semibold">{achievement.title}</h3>
                          {achievement.completed && (
                            <CheckCircle className="w-5 h-5 text-[#16FFBD]" />
                          )}
                        </div>
                        <p className="text-white/60 text-sm mb-3">{achievement.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-white/60">Progress</span>
                              <span className="text-white">
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-[#16FFBD] to-[#FF6EC7]"
                                initial={{ width: 0 }}
                                animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                transition={{ delay: index * 0.2, duration: 1 }}
                              />
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-[#FCEE09] font-medium">
                              +{achievement.pointsReward}
                            </div>
                            <div className="text-white/60 text-xs">points</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            ) : (
              <GlassCard className="p-6 text-center">
                <div className="py-8 flex flex-col items-center">
                  <Trophy className="w-12 h-12 text-white/30 mb-4" />
                  <h3 className="text-white font-medium mb-2">No Achievements Yet</h3>
                  <p className="text-white/60 max-w-md">
                    Complete charging sessions and eco-friendly actions to unlock achievements
                  </p>
                </div>
              </GlassCard>
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Redemption History</h2>
              
              <div className="space-y-4">
                {redemptionHistory.length > 0 ? (
                  redemptionHistory.map((redemption, index) => (
                    <motion.div
                      key={redemption.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${redemption.status === 'completed' ? 'bg-[#16FFBD]/20' : 
                            redemption.status === 'pending' ? 'bg-[#FCEE09]/20' : 'bg-red-400/20'}
                        `}>
                          {redemption.status === 'completed' ? (
                            <Gift className="w-5 h-5 text-[#16FFBD]" />
                          ) : redemption.status === 'pending' ? (
                            <Clock className="w-5 h-5 text-[#FCEE09]" />
                          ) : (
                            <X className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium">{redemption.rewardTitle}</div>
                          <div className="text-white/60 text-sm">
                            {formatDate(redemption.redeemedAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white font-medium">
                          -{redemption.pointsUsed} points
                        </div>
                        <div className={`text-sm capitalize ${getStatusColor(redemption.status)}`}>
                          {redemption.status}
                        </div>
                        {redemption.redemptionCode && (
                          <div className="text-xs text-white/50 mt-1 font-mono">
                            {redemption.redemptionCode}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No Redemption History</h3>
                    <p className="text-white/60">Redeem rewards to see them appear here</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Rewards;