import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Mic, MicOff, X, Minimize2, Maximize2, MapPin, Zap, Clock, Star } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
  suggestions?: string[];
  stationData?: {
    name: string;
    distance: string;
    waitTime: string;
    rating: number;
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  action: string;
}

interface UserProfile {
  name: string;
  evName: string;
  evModel: string;
  batteryRemaining: number;
  greenCredits: number;
  walletBalance: number;
  profilePictureUrl: string;
}

const quickActions: QuickAction[] = [
  { id: 'find-station', label: 'Find Nearby Stations', icon: MapPin, action: 'find_stations' },
  { id: 'book-slot', label: 'Book Charging Slot', icon: Clock, action: 'book_slot' },
  { id: 'check-status', label: 'Check Charging Status', icon: Zap, action: 'check_status' },
  { id: 'trip-plan', label: 'Plan Trip', icon: Star, action: 'plan_trip' }
];

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    type: 'bot',
    message: "Hello! I'm Zyntra AI Assistant. I can help you find charging stations, book slots, plan trips, and answer questions about EV charging. How can I assist you today?",
    timestamp: new Date().toISOString(),
    suggestions: ['Find nearby stations', 'Book a charging slot', 'Plan my trip', 'Check my bookings']
  }
];


const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognitionRef.current
  };
};


const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
 // const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

    const [isSpeaking, setIsSpeaking] = useState(false);
  const {
    isListening: isVoiceListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport
  } = useSpeechRecognition();
  
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
  if (transcript) {
    setInputMessage(transcript);
  }
}, [transcript]);

  // Fetch user profile from Firebase
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'userProfiles', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      }
    };

    fetchUserProfile();
  }, []);

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  }
};
// Update the error handling in handleSendMessage
const handleSendMessage = async (message?: string) => {
  const userText = (message ?? inputMessage).trim();
  if (!userText) return;

  const userMsg: ChatMessage = {
    id: `user-${Date.now()}`,
    type: 'user',
    message: userText,
    timestamp: new Date().toISOString()
  };
  setMessages(prev => [...prev, userMsg]);
  setInputMessage('');
  setIsTyping(true);

  try {
    const botText = await callOpenAI(userText);
    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      message: botText,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, botMsg]);
    speak(botText); // Add this line to speak responses
  }
  catch (err: unknown) {
  let errorMessage = "Sorry, I encountered an error. Please try again.";
  
  if (err instanceof Error) {
    errorMessage = err.message;
  } else if (typeof err === 'string') {
    errorMessage = err;
  }

  const errorMsg: ChatMessage = {
    id: `error-${Date.now()}`,
    type: 'bot',
    message: errorMessage,
    timestamp: new Date().toISOString()
  };
  setMessages(prev => [...prev, errorMsg]);
} finally {
  setIsTyping(false);
}
};

// Update callOpenAI function
async function callOpenAI(prompt: string): Promise<string> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const response = await fetch('http://localhost:5501/ai_assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: prompt,
        user_id: user.uid,
        ev_context: {
          model: userProfile?.evModel || 'Unknown',
          battery: userProfile?.batteryRemaining || 0,
          location: 'Current Location',
          is_voice: isVoiceListening
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data.response || "I couldn't process that request.";

  } catch (err: unknown) {
    console.error("AI request failed:", err);
    
    // More specific error messages
    if (err instanceof Error) {
      if (err.message.includes("Failed to fetch")) {
        return "Our AI service is currently unavailable. Please try again later.";
      }
      if (err.message.includes("401")) {
        return "Authentication error with AI service. Please contact support.";
      }
      if (err.message.includes("429")) {
        return "We're receiving too many requests. Please wait a moment and try again.";
      }
    }
    
    return generateBotResponse(prompt).message;
  }
}
  const generateBotResponse = (msg: string): ChatMessage => {
    const lower = msg.toLowerCase();
    if (lower.includes('station')) {
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        message: `Based on your ${userProfile?.evName || 'EV'} with ${userProfile?.batteryRemaining || 0}% battery, I found 3 charging stations near you!`,
        timestamp: new Date().toISOString(),
        stationData: {
          name: 'EcoCharge Hub',
          distance: '2.3 km',
          waitTime: '4 min',
          rating: 4.8
        },
        suggestions: ['Book this station', 'Show more options', 'Get directions']
      };
    }

    return {
      id: `bot-${Date.now()}`,
      type: 'bot',
      message: "Could you please provide more details?",
      timestamp: new Date().toISOString(),
      suggestions: ['Find charging stations', 'Book a slot', 'Plan a trip']
    };
  };



  const handleQuickAction = (action: string) => {
    const map: Record<string, string> = {
      find_stations: 'Find nearby charging stations',
      book_slot: 'I want to book a charging slot',
      check_status: 'Check my charging status',
      plan_trip: 'Help me plan a trip'
    };
    handleSendMessage(map[action] || action);
  };

  const handleSuggestionClick = (s: string) => handleSendMessage(s);
const toggleListening = () => {
  if (isVoiceListening) {
    stopListening();
    if (transcript) {
      handleSendMessage(transcript);
    }
  } else {
    startListening();
  }
};

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#16FFBD] to-[#FF6EC7] rounded-full flex items-center justify-center shadow-lg z-50"
          >
            <Bot className="w-8 h-8 text-black" />
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-[#FCEE09] rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 60 : 600
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-96 bg-[#0B0B0B]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex justify-between p-4 border-b border-white/10">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#16FFBD] to-[#FF6EC7] rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="text-white font-medium">Zyntra AI</div>
                  <div className="text-[#16FFBD] text-sm">Online</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 rounded-full hover:bg-white/10">
                  {isMinimized ? <Maximize2 className="w-4 h-4 text-white/60" /> : <Minimize2 className="w-4 h-4 text-white/60" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-white/10">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Quick Actions */}
                <div className="p-4 border-b border-white/10">
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map(a => (
                      <button key={a.id} onClick={() => handleQuickAction(a.action)}
                        className="flex items-center space-x-2 p-2 bg-white/5 hover:bg-white/10 rounded-xl">
                        <a.icon className="w-4 h-4 text-[#16FFBD]" />
                        <span className="text-white text-sm">{a.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.type === 'user' ? 'bg-[#16FFBD] text-black' : 'bg-white/10 text-white'}`}>
                        <p className="text-sm">{msg.message}</p>
                        {msg.stationData && (
                          <div className="mt-3 p-3 bg-black/20 rounded-xl">
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{msg.stationData.name}</span>
                              <span className="flex items-center space-x-1 text-xs"><Star className="w-3 h-3 text-[#FCEE09]" /><span>{msg.stationData.rating}</span></span>
                            </div>
                            <div className="flex space-x-4 text-xs opacity-80">
                              <span>{msg.stationData.distance}</span>
                              <span>{msg.stationData.waitTime} wait</span>
                            </div>
                          </div>
                        )}
                        {msg.suggestions?.map((s, i) => (
                          <button key={i} onClick={() => handleSuggestionClick(s)} className="block w-full text-left px-2 py-1 bg-black/20 hover:bg-black/30 rounded text-xs mt-2">{s}</button>
                        ))}
                        <div className={`text-xs mt-1 opacity-60 ${msg.type === 'user' ? 'text-black' : 'text-white'}`}>{formatTime(msg.timestamp)}</div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                      <div className="bg-white/10 px-4 py-2 rounded-2xl">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map(i => (
                            <motion.div key={i} className="w-2 h-2 bg-[#16FFBD] rounded-full"
                              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 * i }} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex space-x-3 p-4 border-t border-white/10">
                  <button 
  onClick={toggleListening} 
  className={`p-2 rounded-full ${
    isVoiceListening ? 'bg-red-500/20 text-red-400' : 
    isSpeaking ? 'bg-[#16FFBD]/20 text-[#16FFBD]' : 
    'bg-white/10 hover:bg-white/20 text-white/60'
  }`}
  disabled={!hasRecognitionSupport}
  title={!hasRecognitionSupport ? "Voice recognition not supported" : ""}
>
  {isVoiceListening ? (
    <MicOff className="w-4 h-4" />
  ) : isSpeaking ? (
    <div className="flex space-x-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1 h-1 bg-[#16FFBD] rounded-full"
          animate={{ height: [2, 6, 2] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 * i }}
        />
      ))}
    </div>
  ) : (
    <Mic className="w-4 h-4" />
  )}
</button>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#16FFBD]"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim()}
                    className="p-2 bg-[#16FFBD] hover:bg-[#16FFBD]/80 rounded-xl disabled:opacity-50">
                    <Send className="w-4 h-4 text-black" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Assistant;
