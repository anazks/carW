import React, { useState, useEffect } from 'react';

function Banner() {
  const [selectedVehicle, setSelectedVehicle] = useState<'car' | 'bike' | 'heavy'>('car');
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      title: "Summer Shine Special",
      subtitle: "20% Off All Services",
      bg: "linear-gradient(135deg, #86efac 0%, #dcfce7 100%)"
    },
    {
      title: "Eco-Friendly Wash",
      subtitle: "Water-Saving Technology",
      bg: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
    },
    {
      title: "Premium Detailing",
      subtitle: "Interior & Exterior Care",
      bg: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000); // Auto scroll every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const vehicleTypes = [
    { type: 'car' as const, label: 'Car', icon: <CarImage className="w-20 h-14 sm:w-24 sm:h-16" /> },
    { type: 'bike' as const, label: 'Bike', icon: <BikeImage className="w-20 h-14 sm:w-24 sm:h-16" /> },
    { type: 'heavy' as const, label: 'Heavy', icon: <HeavyImage className="w-20 h-14 sm:w-24 sm:h-16" /> },
  ];

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 to-white"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-32">
        <div className="flex flex-col items-center space-y-8">
          {/* Auto-Scrolling Banner Carousel */}
          <div className="w-full max-w-2xl relative overflow-hidden rounded-2xl shadow-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <div
                  key={index}
                  className="min-w-full h-32 flex items-center justify-center text-center p-6 relative"
                  style={{ background: banner.bg }}
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{banner.title}</h2>
                    <p className="text-white/90 font-medium">{banner.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Dots Indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentSlide === index ? 'bg-white scale-110' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Vehicle Type Selector Below Carousel */}
          <div className="text-center space-y-4 w-full max-w-md">
            <p className="text-sm font-medium text-gray-600">Select Vehicle Type</p>
            <div className="flex flex-row flex-wrap justify-center gap-4">
              {vehicleTypes.map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => setSelectedVehicle(type)}
                  className={`p-3 sm:p-4 rounded-xl transition-all duration-200 flex flex-col items-center space-y-2 flex-1 min-w-[100px] sm:min-w-0 ${
                    selectedVehicle === type
                      ? 'bg-green-50 border-2 border-green-600 shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      selectedVehicle === type ? 'bg-green-100' : 'bg-white'
                    }`}
                  >
                    {icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Vehicle Images
function CarImage({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 250" fill="none">
      {/* Simple Car Body */}
      <path
        d="M 80 140 Q 80 125 95 122 L 140 122 L 155 105 L 225 105 L 240 122 L 305 122 Q 320 125 320 140 L 320 175 Q 320 182 313 182 L 87 182 Q 80 182 80 175 Z"
        fill="#16a34a"
      />
      
      {/* Windows */}
      <path
        d="M 160 110 L 172 122 L 218 122 L 230 110 Z"
        fill="#4ade80"
      />
      
      {/* Front Wheel */}
      <circle cx="120" cy="182" r="22" fill="#065f46" />
      <circle cx="120" cy="182" r="12" fill="#f0fdf4" />
      
      {/* Back Wheel */}
      <circle cx="280" cy="182" r="22" fill="#065f46" />
      <circle cx="280" cy="182" r="12" fill="#f0fdf4" />
      
      {/* Shine */}
      <ellipse cx="200" cy="135" rx="30" ry="12" fill="white" opacity="0.4" />
    </svg>
  );
}

function BikeImage({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 250" fill="none">
      {/* Motorcycle Body */}
      <path
        d="M 100 140 Q 100 130 110 128 L 150 128 L 160 110 L 200 110 L 210 128 L 250 128 Q 260 130 260 140 L 260 160 Q 260 165 255 165 L 145 165 Q 140 165 140 160 Z"
        fill="#16a34a"
      />
      
      {/* Handlebar */}
      <path d="M 180 105 L 190 95 L 200 105" stroke="#065f46" strokeWidth="4" fill="none" />
      
      {/* Front Wheel */}
      <circle cx="130" cy="165" r="25" fill="#065f46" />
      <circle cx="130" cy="165" r="15" fill="#f0fdf4" />
      
      {/* Back Wheel */}
      <circle cx="230" cy="165" r="25" fill="#065f46" />
      <circle cx="230" cy="165" r="15" fill="#f0fdf4" />
      
      {/* Exhaust */}
      <path d="M 260 150 L 280 155 L 260 160" fill="#374151" />
      
      {/* Shine */}
      <ellipse cx="175" cy="120" rx="25" ry="10" fill="white" opacity="0.4" />
    </svg>
  );
}

function HeavyImage({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 250" fill="none">
      {/* Truck Cabin */}
      <path
        d="M 80 120 Q 80 110 90 108 L 130 108 L 140 95 L 180 95 L 190 108 L 220 108 Q 230 110 230 120 L 230 150 Q 230 155 225 155 L 95 155 Q 90 155 90 150 Z"
        fill="#16a34a"
      />
      
      {/* Truck Bed */}
      <rect x="230" y="95" width="150" height="60" rx="5" fill="#15803d" />
      <rect x="240" y="105" width="130" height="40" rx="3" fill="#4ade80" />
      
      {/* Windows */}
      <path
        d="M 150 100 L 160 108 L 170 108 L 180 100 Z"
        fill="#4ade80"
      />
      
      {/* Front Wheel */}
      <circle cx="120" cy="155" r="20" fill="#065f46" />
      <circle cx="120" cy="155" r="10" fill="#f0fdf4" />
      
      {/* Middle Wheel */}
      <circle cx="180" cy="155" r="20" fill="#065f46" />
      <circle cx="180" cy="155" r="10" fill="#f0fdf4" />
      
      {/* Back Wheel */}
      <circle cx="320" cy="155" r="20" fill="#065f46" />
      <circle cx="320" cy="155" r="10" fill="#f0fdf4" />
      
      {/* Shine */}
      <ellipse cx="155" cy="112" rx="20" ry="8" fill="white" opacity="0.4" />
    </svg>
  );
}

export default Banner;