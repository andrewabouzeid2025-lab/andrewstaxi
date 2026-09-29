import React, { lazy, Suspense, useRef, createContext, useContext } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ChatbotBooking, ChatbotRef } from './components/ChatbotBooking';
import { SEO } from './components/SEO';

const FareEstimator = lazy(() => import('./components/FareEstimator').then(m => ({ default: m.FareEstimator })));

export const ChatbotContext = createContext<{ openChatbot: () => void } | null>(null);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};

function App() {
  const chatbotRef = useRef<ChatbotRef>(null);

  return (
    <ChatbotContext.Provider value={{ openChatbot: () => chatbotRef.current?.open() }}>
      <SEO />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Hero />
          {/* Gradient wrapper for content sections - creates visual depth and contrast */}
          <div className="bg-gradient-to-b from-gray-100 via-amber-100/70 via-yellow-50/60 to-gray-300/80">
            <Services />
            <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
              <FareEstimator />
            </Suspense>
            <Features />
            <HowItWorks />
            <Testimonials />
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
        <ChatbotBooking ref={chatbotRef} />
      </div>
    </ChatbotContext.Provider>
  );
}

export default App;