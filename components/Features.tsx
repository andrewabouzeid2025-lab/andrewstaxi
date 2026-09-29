import React, { useEffect, useState } from 'react';
import { FEATURES, TESTIMONIALS } from '../constants';

// Feature images that alternate
const FEATURE_IMAGES = [
  {
    src: '/featured.jpeg',
    alt: 'Professional taxi service in Lebanon'
  },
  {
    src: '/andrew-vehicle.jpeg',
    alt: 'Andrew\'s Taxi vehicle'
  }
];

export const Features: React.FC = () => {
  const [highlightMode, setHighlightMode] = useState<'quote' | 'value'>('quote');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHighlightMode(prev => (prev === 'quote' ? 'value' : 'quote'));
      setHighlightIndex(prev => prev + 1);
      setImageIndex(prev => (prev + 1) % FEATURE_IMAGES.length);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, []);

  const quote = TESTIMONIALS.length ? TESTIMONIALS[highlightIndex % TESTIMONIALS.length] : null;
  const value = FEATURES.length ? FEATURES[highlightIndex % FEATURES.length] : null;

  const highlightTitle = highlightMode === 'quote' ? 'Customer Quote' : 'Core Value';
  const highlightHeading = highlightMode === 'quote' ? quote?.name : value?.title;
  const highlightText = highlightMode === 'quote' ? quote?.content : value?.description;
  const highlightMeta = highlightMode === 'quote' ? quote?.location : undefined;

  return (
    <section id="features" className="py-12 md:py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          
          <div className="mb-12 lg:mb-0">
             <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px] group">
               {FEATURE_IMAGES.map((image, idx) => (
                 <img 
                   key={idx}
                   src={image.src} 
                   alt={image.alt}
                   loading="lazy"
                   className={`absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-1000 ${
                     idx === imageIndex ? 'opacity-100' : 'opacity-0'
                   }`}
                 />
               ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-6 sm:p-8">
                <div key={`${highlightMode}-${highlightIndex}`} className="text-white bg-black/60 backdrop-blur-sm rounded-xl p-4 sm:p-5 max-w-xl">
                  <p className="text-xs uppercase tracking-widest text-taxi-yellow font-bold mb-2">{highlightTitle}</p>
                  <p className="font-bold text-xl mb-2 text-white">{highlightHeading || 'Ride with Confidence'}</p>
                  <p className="font-medium text-gray-100 text-lg">{highlightText || 'Experience the comfort, punctuality, and safety you deserve on every journey.'}</p>
                  {highlightMeta && (
                    <p className="text-xs text-gray-300 mt-3">{highlightMeta}</p>
                  )}
                </div>
              </div>
             </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-taxi-dark tracking-wide uppercase mb-2">Why Choose Us</h2>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-6">
              More than just a ride.
            </h3>
            <p className="text-lg text-gray-500 mb-10">
              We understand that transportation in Lebanon can be stressful. We are here to change that with a reliable, professional, and transparent service.
            </p>

            <div className="space-y-8">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.id} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-taxi-dark text-white">
                        <Icon className="h-6 w-6 text-taxi-yellow" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-bold text-gray-900">{feature.title}</h4>
                      <p className="mt-2 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};