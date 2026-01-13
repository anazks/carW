import { useState, useEffect } from 'react';
import { Droplet, Menu, X, Home, History, User, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/services', label: 'Services', icon: Droplet },
    { path: '/History', label: 'History', icon: History },
    { path: '/Profile', label: 'Profile', icon: User }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg py-2' : 'bg-white py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <div
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-[#D4AF37] to-[#FFD700] p-2 rounded-full">
                <Droplet className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1
                  style={{ fontFamily: "'Bodoni Moda', serif" }}
                  className="text-2xl font-bold text-[#D4AF37]"
                >
                  Mycarwash
                </h1>
                <p className="text-xs text-gray-500 -mt-1">
                  Premium Car Wash
                </p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      active
                        ? 'text-[#D4AF37] bg-[#FFF8DC]'
                        : 'text-gray-700 hover:bg-[#FFF8DC]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Right */}
            <div className="hidden lg:flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-[#D4AF37]"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>

              <a
                href="#book"
                className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white rounded-lg font-semibold"
              >
                Book Now
              </a>
            </div>

            {/* Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white px-4 pb-4">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-[#FFF8DC]"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Correct offset ONLY */}
      <div className="pt-20" />
    </>
  );
}
