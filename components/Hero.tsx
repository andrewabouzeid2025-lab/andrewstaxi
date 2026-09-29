import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { CloudSun, MessageCircle, Star } from 'lucide-react';
import { useChatbot } from '../App';
import { SupportChat } from './SupportChat';

// Hero slides that alternate
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop',
    title: 'Reliable Rides,',
    titleHighlight: 'Every Time.',
    description: 'Reliable airport transfers, comfortable city rides, and professional drivers 24/7. Skip the stress and book instantly on WhatsApp.'
  },
  {
    image: '/featured.jpeg',
    title: 'Your Trusted',
    titleHighlight: 'Taxi Partner.',
    description: 'Experience professional transportation across Lebanon with fixed transparent pricing and experienced local drivers who know every route.'
  },
  {
    image: '/andrew-vehicle.jpeg',
    title: 'Clean Cars,',
    titleHighlight: 'Professional Service.',
    description: 'Spotless vehicles, courteous drivers, and on-time pickups guaranteed. We take pride in delivering the best taxi experience in Lebanon.'
  }
];

export const Hero: React.FC = () => {
  const { openChatbot } = useChatbot();
  const [weather, setWeather] = useState<{ temp: number; description: string } | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=33.8938&longitude=35.5018&current_weather=true'
        );
        if (!response.ok) throw new Error('Weather request failed');
        const data = await response.json();
        if (!isMounted) return;
        const temp = Math.round(data.current_weather?.temperature ?? 0);
        const weatherCode = data.current_weather?.weathercode ?? 0;
        const description = weatherCode === 0 ? 'Clear' : weatherCode < 3 ? 'Partly Cloudy' : weatherCode < 50 ? 'Cloudy' : weatherCode < 70 ? 'Rainy' : 'Stormy';
        setWeather({ temp, description });
        setWeatherError(false);
      } catch (error) {
        if (!isMounted) return;
        setWeatherError(true);
      }
    };

    fetchWeather();
    const intervalId = window.setInterval(fetchWeather, 10 * 60 * 1000);
    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const slideInterval = window.setInterval(() => {
      setSlideIndex(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => window.clearInterval(slideInterval);
  }, []);

  const currentSlide = HERO_SLIDES[slideIndex];

  return (
    <div className="relative bg-gray-900 h-[90vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Images with Overlay */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === slideIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ pointerEvents: 'none' }}
          >
            <img
              src={slide.image}
              alt="Hero background"
              className="w-full h-full object-cover opacity-40"
              style={{ pointerEvents: 'none' }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" style={{ pointerEvents: 'none' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center md:text-left pt-16">
        <div className="md:max-w-2xl">
          {/* Badges - Stack on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-center gap-2 mb-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-taxi-yellow text-gray-900 rounded-full font-bold text-xs tracking-wider uppercase">
              <Star className="w-3 h-3 fill-gray-900" />
              5-Star Rated on Google
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gray-100 text-xs font-semibold uppercase tracking-wider">
              <CloudSun className="w-3.5 h-3.5 text-taxi-yellow" />
              {weather && !weatherError
                ? `Beirut ${weather.temp}°C · ${weather.description}`
                : 'Beirut Weather'}
            </div>
            <button
              onClick={() => setIsSupportChatOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-taxi-yellow hover:bg-taxi-yellow/90 text-gray-900 text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg w-auto"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Live Support
            </button>
          </div>
          <h1 key={`title-${slideIndex}`} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {currentSlide.title} <br className="hidden md:block" />
            <span className="text-taxi-yellow">{currentSlide.titleHighlight}</span>
          </h1>
          <p key={`desc-${slideIndex}`} className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            {currentSlide.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => setIsSupportChatOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-taxi-yellow hover:bg-taxi-yellow/90 text-gray-900 text-base font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              Live Support
            </button>
            <Button href="#fare-estimator" variant="hero">
              Fare Estimator
            </Button>
          </div>

          <div className="mt-10 flex items-center justify-center md:justify-start gap-6 text-gray-300 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Available Now
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-taxi-yellow"></div>
              Fixed Rates
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Clean Cars
            </div>
          </div>
        </div>
      </div>

      <SupportChat 
        isOpen={isSupportChatOpen} 
        onClose={() => setIsSupportChatOpen(false)}
        onOpenBooking={openChatbot}
      />
    </div>
  );
};