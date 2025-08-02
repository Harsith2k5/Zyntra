/* // src/pages/Login.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

const Login: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/role-select');
    } catch (error: any) {
      setErrorMsg(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-block w-20 h-20 bg-gradient-to-br from-[#16FFBD] to-[#FF6EC7] rounded-full flex items-center justify-center mb-4"
            animate={{
              boxShadow: [
                '0 0 20px rgba(22,255,189,0.3)',
                '0 0 40px rgba(22,255,189,0.5)',
                '0 0 20px rgba(22,255,189,0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <span className="text-black font-bold text-3xl">Z</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Zyntra</h1>
          <p className="text-white/60">AI-driven EV Charging Orchestrator</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-8">
            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border border-white/20 bg-white/5 checked:bg-[#16FFBD] checked:border-[#16FFBD] focus:ring-[#16FFBD]/20"
                  />
                  <span className="ml-2 text-white/60 text-sm">Remember me</span>
                </label>
                {!isSignup && (
                  <a
                    href="#"
                    className="text-[#16FFBD] text-sm hover:text-[#16FFBD]/80 transition-colors"
                  >
                    Forgot password?
                  </a>
                )}
              </div>

              {errorMsg && <div className="text-red-500 text-sm text-center">{errorMsg}</div>}

              <NeonButton type="submit" size="lg" disabled={isLoading} className="w-full">
                {isLoading
                  ? isSignup
                    ? 'Creating account...'
                    : 'Signing in...'
                  : isSignup
                  ? 'Sign Up'
                  : 'Sign In'}
              </NeonButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-[#16FFBD] hover:text-[#16FFBD]/80 transition-colors underline"
                >
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
 */
// login.tsx (Ensure you have this version)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Car } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut, // Import signOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Login: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [evName, setEvName] = useState('');
  const [evModel, setEvModel] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    // Basic client-side validation
    if (isSignup) {
      if (!name || !evName || !evModel || !email || !password) {
        setErrorMsg('Please fill in all fields.');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }
    } else {
      if (!email || !password) {
        setErrorMsg('Please enter email and password.');
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isSignup) {
        console.log('Attempting signup...');
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        console.log('User created in Firebase Auth:', user.uid);

        await updateProfile(user, { displayName: name });
        console.log('User display name updated in Firebase Auth.');

        await sendEmailVerification(user);
        setInfoMsg('Verification email sent! Please check your inbox and verify your email. Then, sign in.');
        console.log('Verification email sent.');

        // Create user profile in Firestore
        const userRef = doc(db, 'userProfiles', user.uid);
        console.log('Attempting Firestore document creation for user:', user.uid);

        await setDoc(userRef, {
          name,
          evName,
          evModel,
          batteryRemaining: 100,
          greenCredits: 0,
          walletBalance: 0,
          lastUpdated: new Date(),
          emailVerified: false, // Mark as unverified initially
          profilePictureUrl: user.photoURL || 'https://via.placeholder.com/150/0B0B0B/FFFFFF?text=U'
        });
        console.log('User profile document created successfully in Firestore for UID:', user.uid);

        // Crucial: Sign out the user immediately after signup
        // because createUserWithEmailAndPassword logs them in automatically.
        await signOut(auth);
        console.log('User signed out after signup to enforce email verification on next login.');

        // Switch to login form and clear fields
        setIsSignup(false);
        setEmail('');
        setPassword('');
        setName('');
        setEvName('');
        setEvModel('');

      } else { // Sign In
        console.log('Attempting sign in...');
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        console.log('User signed in successfully.');

        // --- Check if email is verified after successful sign-in ---
        // Reload user data to get the latest emailVerified status
        await user.reload();
/*         if (!user.emailVerified) {
          setErrorMsg('Please verify your email address before logging in. A verification link was sent to your inbox.');
          await sendEmailVerification(user); // Re-send verification email
          setInfoMsg('Another verification email has been sent. Please check your inbox.');
          await signOut(auth); // Sign out the user if email is not verified
          setIsLoading(false);
          return;
        } */
        // Replace this block in handleAuth():
        if (user.emailVerified) {
          // If email is verified, update Firestore status
          const userRef = doc(db, 'userProfiles', user.uid);
          await setDoc(userRef, { emailVerified: true }, { merge: true });
          console.log('User email verified and Firestore status updated.');

          // Navigate only if email is verified
          navigate('/role-select');  // <-- This stays, but we'll modify the RoleSelector flow
        }
        // If email is verified, update Firestore status
        const userRef = doc(db, 'userProfiles', user.uid);
        await setDoc(userRef, { emailVerified: true }, { merge: true });
        console.log('User email verified and Firestore status updated.');

        // Navigate only if email is verified
        navigate('/role-select');
      }
    } catch (error: any) {
      console.error('Authentication Error:', error.code, error.message, error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMsg('This email is already in use. Try signing in or use a different email.');
          break;
        case 'auth/invalid-email':
          setErrorMsg('Invalid email address format.');
          break;
        case 'auth/weak-password':
          setErrorMsg('Password should be at least 6 characters.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setErrorMsg('Invalid email or password.');
          break;
        default:
          setErrorMsg(error.message || 'Authentication failed. Please try again.');
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-block w-20 h-20 bg-gradient-to-br from-[#16FFBD] to-[#FF6EC7] rounded-full flex items-center justify-center mb-4"
            animate={{
              boxShadow: [
                '0 0 20px rgba(22,255,189,0.3)',
                '0 0 40px rgba(22,255,189,0.5)',
                '0 0 20px rgba(22,255,189,0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <span className="text-black font-bold text-3xl">Z</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Zyntra</h1>
          <p className="text-white/60">AI-driven EV Charging Orchestrator</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-8">
            <form onSubmit={handleAuth} className="space-y-6">
              {isSignup && (
                <>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all"
                        placeholder="Your full name"
                        required={isSignup}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">EV Name</label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                      <input
                        type="text"
                        value={evName}
                        onChange={(e) => setEvName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all"
                        placeholder="e.g., Tata Nexon EV"
                        required={isSignup}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">EV Model</label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                      <input
                        type="text"
                        value={evModel}
                        onChange={(e) => setEvModel(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all"
                        placeholder="e.g., XZ+"
                        required={isSignup}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border border-white/20 bg-white/5 checked:bg-[#16FFBD] checked:border-[#16FFBD] focus:ring-[#16FFBD]/20"
                  />
                  <span className="ml-2 text-white/60 text-sm">Remember me</span>
                </label>
                {!isSignup && (
                  <a
                    href="#"
                    className="text-[#16FFBD] text-sm hover:text-[#16FFBD]/80 transition-colors"
                  >
                    Forgot password?
                  </a>
                )}
              </div>

              {errorMsg && <div className="text-red-500 text-sm text-center">{errorMsg}</div>}
              {infoMsg && <div className="text-[#16FFBD] text-sm text-center">{infoMsg}</div>}

              <NeonButton type="submit" size="lg" disabled={isLoading} className="w-full">
                {isLoading
                  ? isSignup
                    ? 'Creating account...'
                    : 'Signing in...'
                  : isSignup
                    ? 'Sign Up'
                    : 'Sign In'}
              </NeonButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setErrorMsg('');
                    setInfoMsg('');
                    setEmail('');
                    setPassword('');
                    setName('');
                    setEvName('');
                    setEvModel('');
                  }}
                  className="text-[#16FFBD] hover:text-[#16FFBD]/80 transition-colors underline"
                >
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;