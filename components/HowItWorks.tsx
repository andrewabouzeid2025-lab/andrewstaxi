import React from 'react';
import { Button } from './Button';
import { MessageSquare, CalendarCheck, MapPin } from 'lucide-react';
import { WHATSAPP_LINK } from '../constants';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 md:py-20 bg-taxi-dark text-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 md:mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">Booking a taxi shouldn't be complicated. We've made it simple.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-700 z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-taxi-yellow rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg border-4 border-gray-800">
              <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-gray-900" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">1. Message Us</h3>
            <p className="text-sm md:text-base text-gray-400">Send us a WhatsApp message with your pickup location and destination.</p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg border-4 border-gray-700">
              <CalendarCheck className="w-8 h-8 md:w-10 md:h-10 text-taxi-yellow" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">2. Confirm Booking</h3>
            <p className="text-sm md:text-base text-gray-400">We'll instantly confirm the price and driver details. No hidden fees.</p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg border-4 border-gray-700">
              <MapPin className="w-8 h-8 md:w-10 md:h-10 text-taxi-yellow" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">3. Get Picked Up</h3>
            <p className="text-sm md:text-base text-gray-400">Our professional driver will arrive on time in a clean, safe vehicle.</p>
          </div>
        </div>

        <div className="mt-8 md:mt-16 text-center">
          <Button 
            href={WHATSAPP_LINK} 
            external 
            variant="whatsapp" 
            className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg"
          >
            Start Your Booking Now
          </Button>
        </div>
      </div>
    </section>
  );
};