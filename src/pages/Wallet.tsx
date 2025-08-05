import React, { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import RazorpayButton from '.././pages/Payment';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Plus, 
  TrendingUp, 
  Gift, 
  ArrowUpRight, 
  ArrowDownLeft,
  X,
  Zap,
  Leaf,
  Check,
  Loader2,
  ChevronLeft,
  Banknote,
  Smartphone,
  Wallet as WalletIcon
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { User as FirebaseAuthUser } from 'firebase/auth';

interface Transaction {
  id: string;
  type: 'charge' | 'recharge' | 'reward' | 'refund';
  amount: number;
  description: string;
  timestamp: string;
  stationName?: string;
  greenPoints?: number;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking'|'razorpay' | null;
type RechargeStep = 'amount' | 'method' | 'processing' | 'success';

interface WalletProps {
  userData: {
    walletBalance: number;
    greenCredits: number;
    transactions?: Transaction[];
  };
}

const Wallet: React.FC<WalletProps> = ({ userData }) => {
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [currentStep, setCurrentStep] = useState<RechargeStep>('amount');
  const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('••/••');
  const [cardCvv, setCardCvv] = useState('•••');
  const [upiId, setUpiId] = useState('user@upi');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const controls = useAnimation();
  const [walletData, setWalletData] = useState(userData);
  const navigate = useNavigate();
// Add this useEffect to listen for real-time updates
useEffect(() => {
  if (!currentUser) return;

  const userRef = doc(db, 'userProfiles', currentUser.uid);
  const unsubscribe = onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      setWalletData({
        walletBalance: data.walletBalance || 0,
        greenCredits: data.greenCredits || 0,
        transactions: data.transactions || []
      });
    }
  });

  return () => unsubscribe();
}, [currentUser]);
  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

const handleRecharge = async () => {
  if (!rechargeAmount || parseFloat(rechargeAmount) <= 0 || !currentUser) return;
  
  setCurrentStep('processing');
  
  try {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      const amountInPaisa = parseFloat(rechargeAmount) * 100;
      
      const options = {
        key: "rzp_test_V34kkTd9Flgwg0", // Your test key
        amount: amountInPaisa,
        currency: "INR",
        name: "EV Charging Wallet",
        description: "Wallet Top-up",
        handler: async (response: any) => {
          // Update wallet balance in Firestore on successful payment
          const userRef = doc(db, 'userProfiles', currentUser.uid);
          const newBalance = (walletData?.walletBalance || 0) + parseFloat(rechargeAmount);
          const newTransaction: Transaction = {
            id: `TXN${Date.now()}`,
            type: 'recharge',
            amount: parseFloat(rechargeAmount),
            description: 'Wallet Top-up',
            timestamp: new Date().toISOString()
          };

          const updateData = {
            walletBalance: newBalance,
            transactions: [...(walletData?.transactions || []), newTransaction],
            lastUpdated: new Date()
          };

          await updateDoc(userRef, updateData);
          setCurrentStep('success');
        },
        prefill: {
          name: currentUser.displayName || '',
          email: currentUser.email || '',
        },
        theme: {
          color: "#0f172a",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', (response: any) => {
        console.error("Payment failed:", response);
        setCurrentStep('amount');
        alert(`Payment failed! Error: ${response.error.description}`);
      });
    };
    
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      setCurrentStep('amount');
      alert('Failed to load payment processor. Please try again.');
    };
    
    document.body.appendChild(script);
    
  } catch (error) {
    console.error("Error processing payment:", error);
    setCurrentStep('amount');
  }
};
  const resetModal = () => {
    setShowRechargeModal(false);
    setRechargeAmount('');
    setPaymentMethod(null);
    setCurrentStep('amount');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'charge': return ArrowDownLeft;
      case 'recharge': return ArrowUpRight;
      case 'reward': return Gift;
      case 'refund': return ArrowUpRight;
      default: return CreditCard;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'charge': return 'text-red-400';
      case 'recharge': return 'text-[#16FFBD]';
      case 'reward': return 'text-[#FCEE09]';
      case 'refund': return 'text-[#16FFBD]';
      default: return 'text-white';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Simulate balance animation
  const [displayBalance, setDisplayBalance] = useState(walletData?.walletBalance || 0);
  useEffect(() => {
    if (walletData?.walletBalance !== undefined) {
      const timer = setTimeout(() => {
        setDisplayBalance(walletData.walletBalance);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [walletData?.walletBalance]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8">
      <div className="container-responsive">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
              <p className="text-white/60">Manage your balance and track transactions</p>
            </div>
            <NeonButton
              onClick={() => setShowRechargeModal(true)}
              size="sm"
              className="hidden md:flex"
            >
              <Plus className="w-4 h-4 mr-2" />
              Top Up
            </NeonButton>
          </div>
        </motion.div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Main Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6" hoverable glowColor="mint">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    whileHover={{ rotate: 5 }}
                    className="w-12 h-12 bg-[#16FFBD]/20 rounded-full flex items-center justify-center"
                  >
                    <CreditCard className="w-6 h-6 text-[#16FFBD]" />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-semibold">Wallet Balance</h3>
                    <p className="text-white/60 text-sm">Available funds</p>
                  </div>
                </div>
                <NeonButton
                  onClick={() => setShowRechargeModal(true)}
                  size="sm"
                  className="md:hidden"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Top Up
                </NeonButton>
              </div>
              
              <motion.div
                key={`balance-${userData?.walletBalance}`}
                initial={{ scale: 1.1, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold text-white mb-2 flex items-end"
              >
                <motion.span
                  key={displayBalance}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  ₹{displayBalance.toLocaleString('en-IN')}
                </motion.span>
                <span className="text-sm text-white/60 ml-1 mb-1">INR</span>
              </motion.div>
              
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#16FFBD]" />
                <span className="text-[#16FFBD] text-sm">+12% this month</span>
              </div>
            </GlassCard>
          </motion.div>

          {/* GreenCredits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6" hoverable glowColor="amber">
              <div className="flex items-center space-x-3 mb-4">
                <motion.div 
                  whileHover={{ rotate: 5 }}
                  className="w-12 h-12 bg-[#FCEE09]/20 rounded-full flex items-center justify-center"
                >
                  <Leaf className="w-6 h-6 text-[#FCEE09]" />
                </motion.div>
                <div>
                  <h3 className="text-white font-semibold">GreenCredits</h3>
                  <p className="text-white/60 text-sm">Eco rewards • basic tier</p>
                </div>
              </div>
              
              <div className="text-3xl font-bold text-white mb-2">
                {walletData?.greenCredits.toLocaleString() || '0'}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#FCEE09]" />
                  <span className="text-[#FCEE09] text-sm">127 kg CO₂ saved</span>
                </div>
<NeonButton 
  variant="outline" 
  size="sm" 
  glowColor="amber"
  onClick={() => navigate('/rewards')}
>
  Redeem
</NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
              <button className="text-sm text-[#16FFBD] hover:text-[#16FFBD]/80 transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {walletData?.transactions?.length ? (
                [...walletData.transactions]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 5)
                  .map((transaction, index) => {
                    const Icon = getTransactionIcon(transaction.type);
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            whileTap={{ scale: 0.9 }}
                            className={`
                              w-10 h-10 rounded-full flex items-center justify-center
                              ${transaction.type === 'charge' ? 'bg-red-500/20' :
                                transaction.type === 'recharge' ? 'bg-[#16FFBD]/20' :
                                transaction.type === 'reward' ? 'bg-[#FCEE09]/20' :
                                'bg-[#16FFBD]/20'
                              }
                            `}
                          >
                            <Icon className={`w-5 h-5 ${getTransactionColor(transaction.type)}`} />
                          </motion.div>
                          
                          <div>
                            <div className="text-white font-medium">{transaction.description}</div>
                            <div className="text-white/60 text-sm">
                              {transaction.stationName && `${transaction.stationName} • `}
                              {formatDate(transaction.timestamp)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                            {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                          </div>
                          {transaction.greenPoints && (
                            <div className="text-[#FCEE09] text-sm">
                              +{transaction.greenPoints} GP
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
              ) : (
                <div className="text-center py-8 text-white/60">
                  No transactions yet
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Enhanced Recharge Modal */}
        <AnimatePresence>
          {showRechargeModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md"
              >
                <GlassCard className="p-6 relative overflow-hidden">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-6">
                    {currentStep !== 'amount' && (
                      <button
                        onClick={() => {
                          if (currentStep === 'method') setCurrentStep('amount');
                          else if (currentStep === 'processing') return;
                        }}
                        disabled={currentStep === 'processing'}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                      >
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </button>
                    )}
                    <h3 className="text-xl font-semibold text-white flex-1 text-center">
                      {currentStep === 'amount' && 'Recharge Amount'}
                      {currentStep === 'method' && 'Payment Method'}
                      {currentStep === 'processing' && 'Processing Payment'}
                      {currentStep === 'success' && 'Payment Successful'}
                    </h3>
                    <button
                      onClick={resetModal}
                      disabled={currentStep === 'processing'}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5 text-white/60" />
                    </button>
                  </div>
                  
                  {/* Step 1: Amount Selection */}
                  <AnimatePresence mode="wait">
                    {currentStep === 'amount' && (
                      <motion.div
                        key="amount-step"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Enter Amount (₹)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={rechargeAmount}
                              onChange={(e) => setRechargeAmount(e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all text-2xl font-medium"
                              placeholder="0"
                              min="1"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60">INR</span>
                          </div>
                        </div>
                        
                        {/* Quick Amount Buttons */}
                        <div>
                          <p className="text-white/60 text-sm mb-3">Quick Top-up</p>
                          <div className="grid grid-cols-3 gap-3">
                            {[500, 1000, 2000, 5000, 10000, 20000].map((amount) => (
                              <motion.button
                                key={amount}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setRechargeAmount(amount.toString())}
                                className={`py-3 px-4 rounded-2xl transition-all ${rechargeAmount === amount.toString() ? 
                                  'bg-[#16FFBD] text-black font-medium' : 
                                  'bg-white/5 hover:bg-white/10 border border-white/10 text-white'}`}
                              >
                                ₹{amount.toLocaleString('en-IN')}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        
                        <NeonButton
                          onClick={() => setCurrentStep('method')}
                          disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}
                          className="w-full mt-4"
                        >
                          Continue to Payment
                        </NeonButton>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Step 2: Payment Method */}
                                    {/* Step 2: Payment Method */}
                  <AnimatePresence mode="wait">
{currentStep === 'method' && (
  <motion.div
    key="method-step"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="space-y-6"
  >
    <div className="space-y-4">
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => setPaymentMethod('razorpay')}
        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'razorpay' ? 
          'border-[#16FFBD] bg-[#16FFBD]/10' : 
          'border-white/10 hover:border-white/20 bg-white/5'}`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#16FFBD]/20 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#16FFBD]" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium">Secure Payment</h4>
            <p className="text-white/60 text-sm">Powered by Razorpay</p>
          </div>
          {paymentMethod === 'razorpay' && (
            <div className="w-5 h-5 bg-[#16FFBD] rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-black" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
    
    <div className="bg-white/5 p-4 rounded-2xl">
      <div className="flex justify-between mb-2">
        <span className="text-white/60">Amount</span>
        <span className="text-white font-medium">₹{parseFloat(rechargeAmount).toLocaleString('en-IN')}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/60">Convenience Fee</span>
        <span className="text-[#16FFBD]">Free</span>
      </div>
      <div className="h-px bg-white/10 my-3"></div>
      <div className="flex justify-between">
        <span className="text-white font-medium">Total</span>
        <span className="text-white font-bold">₹{parseFloat(rechargeAmount).toLocaleString('en-IN')}</span>
      </div>
    </div>
    
    <NeonButton
      onClick={handleRecharge}
      disabled={!paymentMethod}
      className="w-full mt-2"
    >
      Pay ₹{parseFloat(rechargeAmount).toLocaleString('en-IN')}
    </NeonButton>
  </motion.div>
)}
                  </AnimatePresence>
                  
                  {/* Step 3: Processing */}
                  <AnimatePresence mode="wait">
                    {currentStep === 'processing' && (
                      <motion.div
                        key="processing-step"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-10"
                      >
                        <motion.div
                          animate={controls}
                          className="relative"
                        >
                          <div className="w-20 h-20 bg-[#16FFBD]/20 rounded-full flex items-center justify-center">
                            <WalletIcon className="w-8 h-8 text-[#16FFBD]" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#16FFBD] rounded-full flex items-center justify-center">
                            <Loader2 className="w-4 h-4 text-black animate-spin" />
                          </div>
                        </motion.div>
                        
                        <h4 className="text-white font-medium mt-6 mb-2 text-center">
                          Processing your payment
                        </h4>
                        <p className="text-white/60 text-sm text-center max-w-xs">
                          Please wait while we process your payment of ₹{parseFloat(rechargeAmount).toLocaleString('en-IN')}
                        </p>
                        
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-8">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2.5, ease: "linear" }}
                            className="h-full bg-[#16FFBD]"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Step 4: Success */}
                  <AnimatePresence mode="wait">
                    {currentStep === 'success' && (
                      <motion.div
                        key="success-step"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-10"
                      >
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                          className="w-20 h-20 bg-[#16FFBD]/20 rounded-full flex items-center justify-center mb-6"
                        >
                          <Check className="w-8 h-8 text-[#16FFBD]" />
                        </motion.div>
                        
                        <h4 className="text-white font-medium text-2xl mb-2 text-center">
                          Payment Successful!
                        </h4>
                        <p className="text-white/60 text-sm text-center max-w-xs mb-6">
                          ₹{parseFloat(rechargeAmount).toLocaleString('en-IN')} has been added to your wallet
                        </p>
                        
                        <div className="w-full bg-white/5 p-4 rounded-2xl mb-6">
                          <div className="flex justify-between mb-3">
                            <span className="text-white/60">Transaction ID</span>
                            <span className="text-white font-mono text-sm">TXN{Date.now().toString().slice(-6)}</span>
                          </div>
                          <div className="flex justify-between mb-3">
  <span className="text-white/60">Payment Method</span>
  <span className="text-white capitalize">
    {paymentMethod === 'card' && 'Credit Card'}
    {paymentMethod === 'upi' && 'UPI Payment'}
    {paymentMethod === 'netbanking' && 'Net Banking'}
    {paymentMethod === 'razorpay' && 'Razorpay'}
  </span>
</div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Date & Time</span>
                            <span className="text-white">
                              {new Date().toLocaleString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <NeonButton
                          onClick={resetModal}
                          className="w-full"
                        >
                          Done
                        </NeonButton>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wallet;