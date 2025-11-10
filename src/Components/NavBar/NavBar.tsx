import React, { useState, useEffect } from 'react';
import { Droplet, Menu, X, Phone, Clock } from 'lucide-react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 backdrop-blur-sm py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-sm group-hover:blur-md transition-all duration-300 opacity-50"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-full">
                <Droplet className="w-6 h-6 text-white" fill="white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                CleanRide
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Premium Car Wash</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Right Section - Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 border-r pr-4">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-medium">8AM - 8PM</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="font-medium">+1 234-567-890</span>
            </div>
            <a
              href="#book"
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-xl"
            >
              Book Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pt-2 pb-4 bg-gradient-to-b from-white to-blue-50/30 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-sm font-medium transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 space-y-3 border-t border-blue-100 mt-2">
            <div className="flex items-center space-x-2 px-4 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Open: 8AM - 8PM Daily</span>
            </div>
            <div className="flex items-center space-x-2 px-4 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>+1 234-567-890</span>
            </div>
            <a
              href="#book"
              onClick={() => setIsOpen(false)}
              className="block mx-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg text-center hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>

      {/* Demo Content Spacer */}
      
    </nav>
  );
}