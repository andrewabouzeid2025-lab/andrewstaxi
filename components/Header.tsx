import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { Logo } from './Logo';
import { useChatbot } from '../App';
import { SupportChat } from './SupportChat';

export const Header: React.FC = () => {
  const { openChatbot } = useChatbot();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled || isOpen ? 'bg-gradient-to-r from-gray-50 via-amber-50 to-gray-100 shadow-lg py-1.5' : 'bg-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="flex items-center">
               <Logo className="h-16 md:h-24" variant={isScrolled || isOpen ? 'dark' : 'light'} />
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-xs font-bold uppercase tracking-wide hover:text-taxi-yellow transition-colors ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => setIsSupportChatOpen(true)}
              className="bg-taxi-yellow hover:bg-taxi-yellow/90 text-gray-900 px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors shadow-sm flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Support
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${
                isScrolled || isOpen ? 'text-gray-700 hover:text-gray-900 hover:bg-amber-100' : 'text-white hover:text-yellow-200'
              }`}
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-gradient-to-b from-amber-50 to-gray-100 border-t border-amber-200`}>
        <div className="px-4 pt-2 pb-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide text-gray-700 hover:text-gray-900 hover:bg-amber-100"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-3">
            <button
              onClick={() => {
                setIsSupportChatOpen(true);
                setIsOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full bg-taxi-yellow text-gray-900 px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-taxi-yellow/90 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Support
            </button>
          </div>
        </div>
      </div>

      {/* Support Chat Modal */}
      <SupportChat
        isOpen={isSupportChatOpen}
        onClose={() => setIsSupportChatOpen(false)}
        onOpenBooking={openChatbot}
      />
    </header>
  );
};