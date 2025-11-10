import { MapPin, Clock, Star, Phone, Users, Clock as ClockIcon, DollarSign } from 'lucide-react';

interface CarWashCenter {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  hours: string;
  phone: string;
  distance: string;
  services: string[];
  price: string;
  image: string;
  capacity: number; // New: how many cars at a time
  totalTime: string; // New: total wash time
  selectedSlot?: string; // New: selected time slot
}

const dummyCenter: CarWashCenter = {
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
  image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  capacity: 5,
  totalTime: "30-45 minutes",
  selectedSlot: "2:00 PM - 2:30 PM"
};

interface DetailedProps {
  center?: CarWashCenter;
}

export default function Detailed({ center = dummyCenter }: DetailedProps) {
  // Mock selected slot if not provided
  const selectedSlot = center.selectedSlot || '2:00 PM - 2:30 PM';

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
          {/* Left: Shop Image */}
          <div className="lg:w-1/2 lg:h-auto">
            <div 
              className="h-96 lg:h-full w-full relative"
              style={{ background: center.image }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              
              {/* Rating Overlay */}
              <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1.5 rounded-full flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-gray-900">{center.rating}</span>
                <span className="text-xs text-gray-600">({center.reviews})</span>
              </div>

              {/* Distance Badge */}
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full flex items-center space-x-1">
                <div className="w-4 h-4 text-blue-600">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">{center.distance}</span>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:w-1/2 p-6 lg:p-8 space-y-6">
            {/* Shop Name */}
            <h1 className="text-3xl font-bold text-gray-900">{center.name}</h1>

            {/* Location */}
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-lg">{center.location}</span>
            </div>

            {/* Contact Info */}
            <div className="flex justify-between text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">{center.hours}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">{center.phone}</span>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
              <div className="flex flex-wrap gap-2">
                {center.services.map((service, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Capacity, Total Time, Rates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-gray-500">Capacity</p>
                  <p className="font-semibold text-gray-900">{center.capacity} cars at a time</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-gray-500">Total Time</p>
                  <p className="font-semibold text-gray-900">{center.totalTime}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-gray-500">Rates</p>
                  <p className="font-semibold text-gray-900">{center.price}</p>
                </div>
              </div>
            </div>

            {/* Selected Slot */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Selected Slot</h3>
              <p className="text-xl font-bold text-blue-600">{selectedSlot}</p>
            </div>

            {/* Book Now Button */}
            <button className="w-full py-4 bg-blue-600 text-white font-semibold text-lg rounded-xl hover:bg-blue-700 transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}