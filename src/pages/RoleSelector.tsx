import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Settings } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

const RoleSelector: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      id: 'user',
      title: 'User',
      description: 'Access rider features, maps, booking',
      icon: User,
      color: 'mint',
      path: '/dashboard'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Access analytics, management tools',
      icon: Settings,
      color: 'amber',
      path: '/admin/overview'
    }
  ];

  const handleRoleSelect = async (roleId: string, path: string) => {
    setLoading(true);
    setError('');
    
    const user = auth.currentUser;
    if (!user) {
      setError('No authenticated user found');
      setLoading(false);
      return;
    }

    try {
      // Update Firestore with selected role
      const userRef = doc(db, 'userProfiles', user.uid);
      await setDoc(userRef, { 
        role: roleId,
        lastUpdated: new Date() 
      }, { merge: true });

      // Navigate to selected dashboard
      navigate(path);
    } catch (err) {
      console.error("Role selection failed:", err);
      setError('Failed to save role selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-block w-20 h-20 bg-gradient-to-br from-[#16FFBD] to-[#FF6EC7] rounded-full flex items-center justify-center mb-6"
            animate={{
              boxShadow: [
                '0 0 20px rgba(22,255,189,0.3)',
                '0 0 40px rgba(22,255,189,0.5)',
                '0 0 20px rgba(22,255,189,0.3)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            <span className="text-black font-bold text-3xl">Z</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Zyntra</h1>
          <p className="text-white/60 text-lg">Choose your access level to continue</p>
        </motion.div>

{error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-500/20 text-red-300 rounded-xl text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <GlassCard 
                className="p-8 text-center cursor-pointer h-full"
                hoverable
                glowColor={role.color as 'mint' | 'amber'}
                onClick={() => !loading && handleRoleSelect(role.id, role.path)}
              >
                <div className={`
                  inline-flex items-center justify-center w-20 h-20 rounded-full mb-6
                  ${role.color === 'mint' ? 'bg-[#16FFBD]/20' : 'bg-[#FCEE09]/20'}
                `}>
                  <role.icon className={`
                    w-10 h-10
                    ${role.color === 'mint' ? 'text-[#16FFBD]' : 'text-[#FCEE09]'}
                  `} />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">{role.title}</h2>
                <p className="text-white/60 mb-8 leading-relaxed">{role.description}</p>
                
                <NeonButton
                  glowColor={role.color as 'mint' | 'amber'}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Continue as ${role.title}`}
                </NeonButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
