import React from 'react';
import { SERVICES } from '../constants';

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-12 md:py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-base font-semibold text-taxi-dark tracking-wide uppercase">Our Services</h2>
          <p className="mt-2 text-2xl md:text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Where do you need to go?
          </p>
          <p className="mt-3 md:mt-4 max-w-2xl text-lg md:text-xl text-gray-500 mx-auto">
            We provide safe, comfortable, and professional transport solutions for every need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 md:p-8 border border-gray-100 flex flex-col items-center text-center">
                <div className="h-12 w-12 md:h-14 md:w-14 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <Icon className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{service.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};