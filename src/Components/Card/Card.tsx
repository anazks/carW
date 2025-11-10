import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Star, Phone, Navigation, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Card() {
  const [isMobile, setIsMobile] = useState(false);
  const nearRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const sugRef = useRef<HTMLDivElement>(null);

  const carWashCenters = [
    {
      id: 1,
      name: "CleanRide Downtown",
      location: "123 Main Street, Downtown",
      rating: 4.8,
      reviews: 245,
      hours: "8:00 AM - 8:00 PM",
      phone: "+91 234-567-8901",
      distance: "2.3 km",
      services: ["Express Wash", "Full Detail", "Interior Clean"],
      price: "₹150 - ₹500",
      image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 2,
      name: "CleanRide Uptown",
      location: "456 Oak Avenue, Uptown",
      rating: 4.9,
      reviews: 312,
      hours: "7:00 AM - 9:00 PM",
      phone: "+91 234-567-8902",
      distance: "3.7 km",
      services: ["Premium Wash", "Wax & Polish", "Engine Clean"],
      price: "₹200 - ₹750",
      image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: 3,
      name: "CleanRide Westside",
      location: "789 Pine Road, Westside",
      rating: 4.7,
      reviews: 189,
      hours: "8:00 AM - 7:00 PM",
      phone: "+91 234-567-8903",
      distance: "5.1 km",
      services: ["Basic Wash", "Vacuum", "Tire Shine"],
      price: "₹120 - ₹400",
      image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      id: 4,
      name: "CleanRide Eastside",
      location: "101 Elm Boulevard, Eastside",
      rating: 4.6,
      reviews: 156,
      hours: "9:00 AM - 6:00 PM",
      phone: "+91 234-567-8904",
      distance: "1.8 km",
      services: ["Quick Rinse", "Exterior Polish", "Wheel Clean"],
      price: "₹100 - ₹350",
      image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    },
    {
      id: 5,
      name: "CleanRide North End",
      location: "202 Cedar Lane, North End",
      rating: 4.9,
      reviews: 401,
      hours: "6:30 AM - 10:00 PM",
      phone: "+91 234-567-8905",
      distance: "4.2 km",
      services: ["Deluxe Package", "UV Protection", "Leather Care"],
      price: "₹250 - ₹800",
      image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    }
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const refs = [nearRef, popRef, sugRef];
    const intervals: NodeJS.Timeout[] = [];

    refs.forEach((ref) => {
      if (!ref.current) return;
      const interval = setInterval(() => {
        if (ref.current) {
          const scrollAmount = ref.current.offsetWidth + 24;
          ref.current.scrollLeft += scrollAmount;
          if (ref.current.scrollLeft >= ref.current.scrollWidth - ref.current.offsetWidth) {
            ref.current.scrollLeft = 0;
          }
        }
      }, 4000);
      intervals.push(interval);
    });

    return () => intervals.forEach(clearInterval);
  }, [isMobile]);

  const nearYou = carWashCenters
    .sort((a, b) => parseFloat(a.distance.split(' ')[0]) - parseFloat(b.distance.split(' ')[0]))
    .slice(0, 2);

  const nearIds = new Set(nearYou.map((c) => c.id));

  const mostPopular = carWashCenters
    .filter((c) => !nearIds.has(c.id))
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 2);

  const popIds = new Set(mostPopular.map((c) => c.id));

  const suggested = carWashCenters.filter(
    (c) => !nearIds.has(c.id) && !popIds.has(c.id)
  );

  const renderSection = (title: string, centers: typeof carWashCenters, sectionRef: React.RefObject<HTMLDivElement>) => {
    const scrollLeft = () => {
      if (sectionRef.current) {
        const scrollAmount = sectionRef.current.offsetWidth + 24;
        sectionRef.current.scrollLeft -= scrollAmount;
      }
    };

    const scrollRight = () => {
      if (sectionRef.current) {
        const scrollAmount = sectionRef.current.offsetWidth + 24;
        sectionRef.current.scrollLeft += scrollAmount;
        if (sectionRef.current.scrollLeft >= sectionRef.current.scrollWidth - sectionRef.current.offsetWidth) {
          sectionRef.current.scrollLeft = 0;
        }
      }
    };

    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">{title}</h2>
        <div className="relative hidden md:block">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => (
              <div key={center.id} className="w-full md:w-auto">
                <div className="bg-white shadow-lg overflow-hidden">
                  {/* Image/Gradient Header */}
                  <div 
                    className="h-40 relative"
                    style={{ background: center.image }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    {/* Distance Badge */}
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex items-center space-x-1">
                      <Navigation className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-semibold text-gray-900">{center.distance}</span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-full flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-gray-900">{center.rating}</span>
                      <span className="text-xs text-gray-600">({center.reviews})</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 space-y-2">
                    
                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900">
                      {center.name}
                    </h3>

                    {/* Opening Time */}
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-3 h-3 text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-medium">{center.hours}</span>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
                        <p className="text-base font-bold text-blue-600">{center.price}</p>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-600 text-white font-semibold text-xs rounded hover:bg-blue-700">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative md:hidden">
          <div ref={sectionRef} className="flex flex-nowrap overflow-x-auto gap-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {centers.map((center) => (
              <div key={center.id} className="flex-shrink-0 w-full snap-start">
                <div className="bg-white shadow-lg overflow-hidden">
                  {/* Image/Gradient Header */}
                  <div 
                    className="h-40 relative"
                    style={{ background: center.image }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    {/* Distance Badge */}
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex items-center space-x-1">
                      <Navigation className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-semibold text-gray-900">{center.distance}</span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-full flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-gray-900">{center.rating}</span>
                      <span className="text-xs text-gray-600">({center.reviews})</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 space-y-2">
                    
                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900">
                      {center.name}
                    </h3>

                    {/* Opening Time */}
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-3 h-3 text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-medium">{center.hours}</span>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
                        <p className="text-base font-bold text-blue-600">{center.price}</p>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-600 text-white font-semibold text-xs rounded hover:bg-blue-700">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-3 shadow-lg flex items-center justify-center w-12 h-12 hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-3 shadow-lg flex items-center justify-center w-12 h-12 hover:bg-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-indigo-100 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderSection('Near You', nearYou, nearRef)}
        {renderSection('Most Popular', mostPopular, popRef)}
        {renderSection('Suggested', suggested, sugRef)}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">
            View All Locations
          </button>
        </div>
      </div>
    </div>
  );
}