import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, MessageCircle, Mic, MicOff } from 'lucide-react';
import { PHONE_NUMBER_CLEAN } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: () => void;
}

type SupportAction =
  | 'open_booking'
  | 'scroll_fare_estimator'
  | 'scroll_custom_request'
  | 'scroll_services'
  | 'scroll_reviews'
  | 'open_whatsapp';

/**
 * What typing into the chat box does. Matched locally against the message —
 * first entry whose keywords appear wins, so order them most specific first.
 * To teach the assistant a new phrase, add it to the relevant keywords list.
 */
const INTENTS: { action: SupportAction; reply: string; keywords: string[] }[] = [
  {
    action: 'scroll_custom_request',
    reply: 'For bigger groups and special vehicles we quote personally — taking you to the custom request form 🚕',
    keywords: ['suv', 'van', 'minibus', 'multiple', 'two cars', '2 cars', 'group', 'luggage', 'bags', '4+', 'family'],
  },
  {
    action: 'open_whatsapp',
    reply: 'Opening WhatsApp so you can talk to us directly 💬',
    keywords: ['human', 'person', 'agent', 'someone', 'call', 'phone', 'whatsapp', 'urgent', 'talk to', 'speak to'],
  },
  {
    action: 'scroll_fare_estimator',
    reply: 'Here are our prices ✨',
    keywords: ['price', 'prices', 'pricing', 'cost', 'costs', 'fare', 'how much', 'rate', 'rates', 'estimate', 'quote', 'cheap', 'expensive'],
  },
  {
    action: 'open_booking',
    reply: 'Perfect! Opening the booking form for you now 🚕',
    keywords: ['book', 'booking', 'reserve', 'reservation', 'ride', 'pick me up', 'pickup', 'taxi now', 'order'],
  },
  {
    action: 'scroll_reviews',
    reply: 'Here is what our customers say ⭐',
    keywords: ['review', 'reviews', 'rating', 'ratings', 'star', 'trust', 'reliable', 'safe'],
  },
  {
    action: 'scroll_services',
    reply: 'Here is what we offer 🚕',
    keywords: ['service', 'services', 'airport', 'offer', 'do you do', 'what do you', 'tour', 'hour'],
  },
];

const matchIntent = (text: string) => {
  const haystack = text.toLowerCase();
  return INTENTS.find((intent) => intent.keywords.some((k) => haystack.includes(k))) ?? null;
};

export const SupportChat: React.FC<SupportChatProps> = ({ isOpen, onClose, onOpenBooking }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! 👋 How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [micAvailable, setMicAvailable] = useState(true); // Assume available until proven otherwise
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const recognitionInitialized = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Cleanup speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    if (recognitionInitialized.current) return true;

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setMicAvailable(false);
      return false;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? ' ' : '') + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        if (event.error === 'aborted') return;
        
        // Network errors are common and don't mean the feature is broken
        // Just disable the button silently and let user continue typing
        if (event.error === 'network') {
          setMicAvailable(false);
          return; // Don't show error message for network issues
        }
        
        let errorMessage = '';
        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            errorMessage = '⚠️ Microphone access denied. Please type your message.';
            setMicAvailable(false);
            break;
          case 'no-speech':
            // Don't show error for no-speech, let user try again
            return;
          default:
            // Silently disable for other errors
            setMicAvailable(false);
            return;
        }
        
        if (errorMessage) {
          const errorMsg: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: errorMessage,
          };
          setMessages((prev) => [...prev, errorMsg]);
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionInitialized.current = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      setMicAvailable(false);
      return false;
    }
  };

  const handleVoiceInput = () => {
    if (!micAvailable) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '⚠️ Voice input is not available. Please type your message.',
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    // Initialize speech recognition on first use
    if (!recognitionRef.current) {
      if (!initializeSpeechRecognition()) {
        const errorMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '⚠️ Voice input is not supported in your browser. Please type your message.',
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
      setIsRecording(false);
    } else {
      try {
        setIsRecording(true);
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setIsRecording(false);
        setMicAvailable(false);
        const errorMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '⚠️ Could not start voice input. Please type your message instead.',
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    }
  };

  const handleQuickAction = (action: SupportAction, label: string) => {
    setShowQuickActions(false);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: label,
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // Execute action immediately
    if (action === 'open_booking') {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Perfect! Opening the booking chatbot for you now 🚕',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setTimeout(() => executeAction(action), 500);
    } else if (action === 'scroll_fare_estimator') {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Let me show you our fare calculator! ✨',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setTimeout(() => executeAction(action), 500);
    } else if (action === 'scroll_custom_request') {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Taking you to our custom request form 🚕',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setTimeout(() => executeAction(action), 500);
    } else if (action === 'open_whatsapp') {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Opening WhatsApp for you! 💬',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setTimeout(() => executeAction(action), 500);
    }
  };

  const executeAction = (action: SupportAction) => {
    switch (action) {
      case 'open_booking':
        onOpenBooking?.();
        onClose();
        break;
      case 'scroll_fare_estimator':
        document.getElementById('fare-estimator')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
        break;
      case 'scroll_custom_request':
        const fareSection = document.getElementById('fare-estimator');
        if (fareSection) {
          fareSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            window.scrollBy(0, 600);
          }, 500);
        }
        onClose();
        break;
      case 'scroll_services':
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
        break;
      case 'scroll_reviews':
        document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
        break;
      case 'open_whatsapp':
        window.open(`https://wa.me/${PHONE_NUMBER_CLEAN}`, '_blank');
        break;
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    setShowQuickActions(false);
    const text = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Short pause so the "Typing..." bubble still reads as a reply, not a lookup.
    window.setTimeout(() => {
      if (!isMountedRef.current) return;

      const intent = matchIntent(text);
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: intent
          ? intent.reply
          : "I'm not sure about that one — but here's what I can do right away. For anything else, message us on WhatsApp and a real person will answer. 💬",
      };

      setMessages((prev) => [...prev, reply]);
      setIsLoading(false);

      if (intent) {
        window.setTimeout(() => executeAction(intent.action), 500);
      } else {
        setShowQuickActions(true);
      }
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-taxi-dark to-gray-800 text-white p-4 rounded-t-2xl flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-taxi-yellow rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-taxi-dark" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Live Support</h3>
              <p className="text-xs text-gray-300">Quick help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-all duration-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-taxi-yellow text-taxi-dark'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {showQuickActions && (
            <div className="space-y-2 animate-fadeIn">
              <button
                onClick={() => handleQuickAction('open_booking', 'Book a ride')}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-taxi-yellow hover:bg-taxi-yellow/5 transition-all text-left flex items-center gap-3 group"
              >
                <span className="text-2xl">🚕</span>
                <div>
                  <p className="font-semibold text-gray-800 group-hover:text-taxi-dark">Book a ride</p>
                  <p className="text-xs text-gray-500">Start booking process</p>
                </div>
              </button>
              <button
                onClick={() => handleQuickAction('scroll_fare_estimator', 'Get fare estimate')}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-taxi-yellow hover:bg-taxi-yellow/5 transition-all text-left flex items-center gap-3 group"
              >
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-semibold text-gray-800 group-hover:text-taxi-dark">Get fare estimate</p>
                  <p className="text-xs text-gray-500">Calculate trip cost</p>
                </div>
              </button>
              <button
                onClick={() => handleQuickAction('scroll_custom_request', 'Custom request')}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-taxi-yellow hover:bg-taxi-yellow/5 transition-all text-left flex items-center gap-3 group"
              >
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-semibold text-gray-800 group-hover:text-taxi-dark">Custom request</p>
                  <p className="text-xs text-gray-500">Multiple cars, SUV, 4+ passengers</p>
                </div>
              </button>
              <button
                onClick={() => handleQuickAction('open_whatsapp', 'Talk to us directly')}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-taxi-yellow hover:bg-taxi-yellow/5 transition-all text-left flex items-center gap-3 group"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-semibold text-gray-800 group-hover:text-taxi-dark">Talk to us directly</p>
                  <p className="text-xs text-gray-500">Open WhatsApp</p>
                </div>
              </button>
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2.5 rounded-2xl flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                <span className="text-sm text-gray-600">Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-taxi-yellow disabled:bg-gray-100 transition-all duration-200"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading || !micAvailable}
              className={`p-2.5 rounded-xl transition-all ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : micAvailable
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } disabled:opacity-50`}
              title={micAvailable ? 'Voice input' : 'Voice input unavailable'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-taxi-yellow hover:bg-yellow-400 text-taxi-dark p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            For bookings and exact prices, message us on WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};
