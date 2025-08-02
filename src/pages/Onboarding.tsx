import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Car, Battery, QrCode, CheckCircle } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [chargerCode, setChargerCode] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const navigate = useNavigate();

  const totalSteps = 3;

  const vehicleBrands = [
    { id: 'tesla', name: 'Tesla', models: ['Model S', 'Model 3', 'Model X', 'Model Y'] },
    { id: 'bmw', name: 'BMW', models: ['i3', 'i4', 'iX', 'i7'] },
    { id: 'mercedes', name: 'Mercedes', models: ['EQS', 'EQE', 'EQC', 'EQA'] },
    { id: 'audi', name: 'Audi', models: ['e-tron', 'e-tron GT', 'Q4 e-tron'] },
    { id: 'nissan', name: 'Nissan', models: ['Leaf', 'Ariya'] },
    { id: 'hyundai', name: 'Hyundai', models: ['Ioniq 5', 'Ioniq 6', 'Kona Electric'] }
  ];

  const batteryOptions = [
    { value: '40', label: '40 kWh' },
    { value: '60', label: '60 kWh' },
    { value: '75', label: '75 kWh' },
    { value: '100', label: '100 kWh' },
    { value: '120', label: '120+ kWh' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return chargerCode.length > 0;
      case 2:
        return selectedVehicle.length > 0;
      case 3:
        return batteryCapacity.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <QrCode className="w-16 h-16 text-[#16FFBD] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Connect Your Charger</h2>
              <p className="text-white/60">
                Enter your home charger ID or scan the QR code to get started
              </p>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Charger ID
              </label>
              <input
                type="text"
                value={chargerCode}
                onChange={(e) => setChargerCode(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-[#FCEE09]/30 rounded-2xl text-white placeholder-white/40 focus:border-[#FCEE09] focus:outline-none focus:ring-2 focus:ring-[#FCEE09]/20 transition-all"
                placeholder="e.g., ZYN-CH-001234"
              />
            </div>
            <div className="text-center">
              <button className="text-[#16FFBD] hover:text-[#16FFBD]/80 transition-colors">
                Scan QR Code Instead
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Car className="w-16 h-16 text-[#16FFBD] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Select Your Vehicle</h2>
              <p className="text-white/60">
                Choose your electric vehicle brand and model
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {vehicleBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedVehicle(brand.id)}
                  className={`
                    p-4 rounded-2xl border-2 transition-all duration-200 text-left
                    ${selectedVehicle === brand.id 
                      ? 'border-[#16FFBD] bg-[#16FFBD]/10 text-[#16FFBD]' 
                      : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                    }
                  `}
                >
                  <div className="font-semibold">{brand.name}</div>
                  <div className="text-sm opacity-60 mt-1">
                    {brand.models[0]} & more
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Battery className="w-16 h-16 text-[#16FFBD] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Battery Capacity</h2>
              <p className="text-white/60">
                Select your vehicle's battery capacity for optimal charging recommendations
              </p>
            </div>
            <div className="space-y-3">
              {batteryOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                    ${batteryCapacity === option.value 
                      ? 'border-[#16FFBD] bg-[#16FFBD]/10' 
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="battery"
                    value={option.value}
                    checked={batteryCapacity === option.value}
                    onChange={(e) => setBatteryCapacity(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`
                    w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                    ${batteryCapacity === option.value 
                      ? 'border-[#16FFBD]' 
                      : 'border-white/40'
                    }
                  `}>
                    {batteryCapacity === option.value && (
                      <div className="w-2 h-2 bg-[#16FFBD] rounded-full"></div>
                    )}
                  </div>
                  <span className="text-white font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm">Step {currentStep} of {totalSteps}</span>
            <span className="text-white/60 text-sm">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-[#16FFBD] to-[#FF6EC7] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <GlassCard className="p-8 mb-6">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </GlassCard>

        {/* Navigation */}
        <div className="flex justify-between">
          <NeonButton
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </NeonButton>

          <NeonButton
            onClick={handleNext}
            disabled={!canProceed()}
            className={!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {currentStep === totalSteps ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Finish
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;