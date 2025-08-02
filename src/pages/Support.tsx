import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Send,
  Bot,
  User,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'charging' | 'payment' | 'account' | 'technical';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdate: string;
}

const mockFAQs: FAQ[] = [
  {
    id: 'FAQ001',
    question: 'How do I book a charging slot?',
    answer: 'You can book a charging slot by going to the Discover page, selecting a station, and choosing an available time slot. You can also use our AI recommendations for optimal charging times.',
    category: 'charging'
  },
  {
    id: 'FAQ002',
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit cards, debit cards, UPI, and wallet payments. You can also use your GreenPoints for discounts on charging sessions.',
    category: 'payment'
  },
  {
    id: 'FAQ003',
    question: 'How do I earn GreenPoints?',
    answer: 'You earn GreenPoints by completing charging sessions, using solar-powered stations, referring friends, and achieving eco-friendly milestones. Points vary based on your tier level.',
    category: 'account'
  },
  {
    id: 'FAQ004',
    question: 'What if a charging station is not working?',
    answer: 'If you encounter a faulty station, please report it immediately through the app. You will receive a full refund, and we will suggest alternative nearby stations.',
    category: 'technical'
  },
  {
    id: 'FAQ005',
    question: 'Can I cancel my booking?',
    answer: 'Yes, you can cancel your booking up to 15 minutes before the scheduled time for a full refund. Cancellations within 15 minutes may incur a small fee.',
    category: 'charging'
  },
  {
    id: 'FAQ006',
    question: 'How does Fast Lane work?',
    answer: 'Fast Lane is our premium service that provides priority access to charging stations and 15% faster charging speeds for an additional fee. Perfect for urgent charging needs.',
    category: 'charging'
  }
];

const mockChatMessages: ChatMessage[] = [
  {
    id: 'MSG001',
    type: 'bot',
    message: 'Hello! I\'m Zyntra AI Assistant. How can I help you today?',
    timestamp: '2024-01-15T10:00:00Z'
  },
  {
    id: 'MSG002',
    type: 'user',
    message: 'I need help finding a charging station near me',
    timestamp: '2024-01-15T10:01:00Z'
  },
  {
    id: 'MSG003',
    type: 'bot',
    message: 'I can help you with that! Based on your location, I found 3 nearby stations. EcoCharge Hub is just 2.3 km away with no wait time. Would you like me to book a slot for you?',
    timestamp: '2024-01-15T10:01:30Z'
  }
];

const mockTickets: SupportTicket[] = [
  {
    id: 'TKT001',
    subject: 'Charging session not starting',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2024-01-15T09:30:00Z',
    lastUpdate: '2024-01-15T11:45:00Z'
  },
  {
    id: 'TKT002',
    subject: 'Refund request for cancelled session',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2024-01-14T14:20:00Z',
    lastUpdate: '2024-01-14T16:30:00Z'
  }
];

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chatMessages, setChatMessages] = useState(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  const filteredFAQs = mockFAQs.filter(faq => 
    selectedCategory === 'all' || faq.category === selectedCategory
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `MSG${Date.now()}`,
      type: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: `MSG${Date.now() + 1}`,
        type: 'bot',
        message: 'Thank you for your message. I\'m processing your request and will get back to you shortly with the best solution.',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleSubmitTicket = () => {
    console.log('Submitting ticket:', ticketForm);
    setShowTicketForm(false);
    setTicketForm({ subject: '', category: '', priority: 'medium', description: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-[#FCEE09]';
      case 'in-progress': return 'text-[#16FFBD]';
      case 'resolved': return 'text-[#16FFBD]';
      case 'closed': return 'text-white/60';
      default: return 'text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return Clock;
      case 'in-progress': return AlertCircle;
      case 'resolved': return CheckCircle;
      case 'closed': return CheckCircle;
      default: return Clock;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-[#FCEE09]';
      case 'low': return 'text-[#16FFBD]';
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

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8">
      <div className="container-responsive">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Support Center</h1>
          <p className="text-white/60">Get help and find answers to your questions</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-6 mb-8">
          {[
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'chat', label: 'Live Chat', icon: MessageCircle },
            { id: 'tickets', label: 'Support Tickets', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 pb-2 border-b-2 transition-colors font-medium
                ${activeTab === tab.id 
                  ? 'border-[#16FFBD] text-[#16FFBD]' 
                  : 'border-transparent text-white/60 hover:text-white'
                }
              `}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Category Filter */}
            <div className="flex space-x-4 overflow-x-auto">
              {[
                { id: 'all', label: 'All Topics' },
                { id: 'charging', label: 'Charging' },
                { id: 'payment', label: 'Payment' },
                { id: 'account', label: 'Account' },
                { id: 'technical', label: 'Technical' }
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    px-4 py-2 rounded-2xl transition-all whitespace-nowrap
                    ${selectedCategory === category.id 
                      ? 'bg-[#16FFBD]/20 text-[#16FFBD] border border-[#16FFBD]/40' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <GlassCard className="p-6">
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-white/10 last:border-b-0"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between py-4 text-left hover:bg-white/5 rounded-2xl px-4 transition-colors"
                    >
                      <span className="text-white font-medium">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-white/60" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/60" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4"
                        >
                          <p className="text-white/60">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <GlassCard className="p-6 h-96 flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-white/10">
                <div className="w-10 h-10 bg-[#16FFBD]/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-[#16FFBD]" />
                </div>
                <div>
                  <div className="text-white font-medium">Zyntra AI Assistant</div>
                  <div className="text-[#16FFBD] text-sm">Online</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`
                      max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
                      ${message.type === 'user' 
                        ? 'bg-[#16FFBD] text-black' 
                        : 'bg-white/10 text-white'
                      }
                    `}>
                      <p className="text-sm">{message.message}</p>
                      <div className={`
                        text-xs mt-1 opacity-60
                        ${message.type === 'user' ? 'text-black' : 'text-white'}
                      `}>
                        {formatDate(message.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none"
                  placeholder="Type your message..."
                />
                <NeonButton onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Create Ticket Button */}
            <div className="flex justify-end">
              <NeonButton onClick={() => setShowTicketForm(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Create Ticket
              </NeonButton>
            </div>

            {/* Tickets List */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Your Support Tickets</h2>
              
              <div className="space-y-4">
                {mockTickets.map((ticket, index) => {
                  const StatusIcon = getStatusIcon(ticket.status);
                  return (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                          <StatusIcon className={`w-5 h-5 ${getStatusColor(ticket.status)}`} />
                        </div>
                        <div>
                          <div className="text-white font-medium">{ticket.subject}</div>
                          <div className="text-white/60 text-sm">
                            Created: {formatDate(ticket.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium capitalize ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('-', ' ')}
                        </div>
                        <div className={`text-xs capitalize ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority} priority
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Create Ticket Modal */}
            <AnimatePresence>
              {showTicketForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-full max-w-md"
                  >
                    <GlassCard className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-6">Create Support Ticket</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Subject
                          </label>
                          <input
                            type="text"
                            value={ticketForm.subject}
                            onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none"
                            placeholder="Brief description of your issue"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Category
                          </label>
                          <select
                            value={ticketForm.category}
                            onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
                          >
                            <option value="">Select category</option>
                            <option value="charging">Charging Issues</option>
                            <option value="payment">Payment Problems</option>
                            <option value="account">Account Issues</option>
                            <option value="technical">Technical Support</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Priority
                          </label>
                          <select
                            value={ticketForm.priority}
                            onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#16FFBD] focus:outline-none"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Description
                          </label>
                          <textarea
                            value={ticketForm.description}
                            onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none resize-none"
                            placeholder="Detailed description of your issue..."
                          />
                        </div>
                      </div>
                      
                      <div className="flex space-x-4 mt-6">
                        <NeonButton
                          variant="secondary"
                          onClick={() => setShowTicketForm(false)}
                          className="flex-1"
                        >
                          Cancel
                        </NeonButton>
                        <NeonButton
                          onClick={handleSubmitTicket}
                          disabled={!ticketForm.subject || !ticketForm.category || !ticketForm.description}
                          className="flex-1"
                        >
                          Submit
                        </NeonButton>
                      </div>
                    </GlassCard>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Support;