import React, { useState, useEffect } from 'react';
import { Droplet, Menu, X, Phone, Clock, Home, History, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/Details', label: 'Services', icon: Droplet },
    { path: '/History', label: 'History', icon: History },
    { path: '/Profile', label: 'Profile', icon: User }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 backdrop-blur-sm py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => navigate('/')}
          >
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
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 relative group ${
                    active 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-500'} group-hover:text-blue-600 transition-colors`} />
                  <span>{link.label}</span>
                  <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-600 transition-all duration-300 ${
                    active ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                  }`}></span>
                </button>
              );
            })}
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
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-xl relative overflow-hidden group"
            >
              <span className="relative z-10">Book Now</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
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
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pt-2 pb-4 bg-gradient-to-b from-white to-blue-50/30 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  active 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-sm'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`} />
                <span>{link.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
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
              className="block mx-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg text-center hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md relative overflow-hidden group"
            >
              <span className="relative z-10">Book Now</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}