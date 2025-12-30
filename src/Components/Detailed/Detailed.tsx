import { useState } from 'react';
import { MapPin, Clock, Star, Phone, DollarSign, Truck, Home, Check, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
  capacity: number;
  totalTime: string;
  selectedSlot?: string;
  pickAndDrop: boolean;
  washAtHome: boolean;
  pickDropPrice?: string;
  homeServicePrice?: string;
  lat?: number;
  lng?: number;
}

const dummyCenter: CarWashCenter = {
  id: 1,
  name: "Mycarwash Downtown",
  location: "123 Main Street, Downtown",
  rating: 4.8,
  reviews: 245,
  hours: "8:00 AM - 8:00 PM",
  phone: "+91 234-567-8901",
  distance: "2.3 km",
  services: ["Express Wash", "Full Detail", "Interior Clean", "Wax & Polish"],
  price: "₹150 - ₹500",
  image: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
  capacity: 5,
  totalTime: "30-45 minutes",
  selectedSlot: "2:00 PM - 2:30 PM",
  pickAndDrop: true,
  washAtHome: true,
  pickDropPrice: "+ ₹50",
  homeServicePrice: "+ ₹100",
  lat: 40.7128,
  lng: -74.0060
};

interface DetailedProps {
  center?: CarWashCenter;
}

export default function Detailed({ center = dummyCenter }: DetailedProps) {
  const [serviceType, setServiceType] = useState<'center' | 'pickDrop' | 'home'>('center');
  const selectedSlot = center.selectedSlot || '2:00 PM - 2:30 PM';

  const serviceOptions = [
    {
      id: 'center',
      label: 'At Center',
      icon: MapPin,
      description: 'Visit our center',
      available: true,
      extraCharge: null
    },
    {
      id: 'pickDrop',
      label: 'Pick & Drop',
      icon: Truck,
      description: 'We pick & deliver',
      available: center.pickAndDrop,
      extraCharge: center.pickDropPrice
    },
    {
      id: 'home',
      label: 'Wash at Home',
      icon: Home,
      description: 'We come to you',
      available: center.washAtHome,
      extraCharge: center.homeServicePrice
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 p-3 sm:p-4 lg:p-6">
      {/* Back Button */}
      <button className="mb-3 sm:mb-4 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm sm:text-base">
        ← Back to locations
      </button>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left: Simplified Leaflet Map */}
        <div className="relative h-[300px] sm:h-[400px] lg:h-[650px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg z-10">
          <MapContainer
            center={[center.lat || 40.7128, center.lng || -74.0060]}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full"
            style={{ zIndex: 1 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[center.lat || 40.7128, center.lng || -74.0060]}>
              <Popup>
                <strong>{center.name}</strong><br />
                {center.location}
              </Popup>
            </Marker>
          </MapContainer>

          {/* Simplified Floating Info (only rating and distance) */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900 text-sm sm:text-base">{center.rating}</span>
                <span className="text-xs sm:text-sm text-gray-600">({center.reviews})</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">{center.distance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{center.name}</h1>
            <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {center.location}
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Hours</p>
                  <p className="text-sm font-semibold text-gray-900">{center.hours}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">{center.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Type Selection */}
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Choose Service Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {serviceOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = serviceType === option.id;
                const isAvailable = option.available;

                return (
                  isAvailable && (
                    <button
                      key={option.id}
                      onClick={() => isAvailable && setServiceType(option.id as any)}
                      disabled={!isAvailable}
                      className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-green-600 bg-green-50'
                          : isAvailable
                          ? 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                          : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${isSelected ? 'text-green-600' : 'text-gray-600'}`} />
                        <div>
                          <div className={`font-semibold text-sm sm:text-base ${isSelected ? 'text-green-600' : 'text-gray-900'}`}>
                            {option.label}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">{option.description}</div>
                        </div>
                        {option.extraCharge && (
                          <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full mt-1">
                            {option.extraCharge}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                      )}
                      {!isAvailable && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                      )}
                    </button>
                  )
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Available Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {center.services.map((service, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Price Range</h2>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{center.price}</p>
              </div>
              <div className="p-3 sm:p-4 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Selected Slot */}
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Selected Slot</h2>
              <button className="text-sm sm:text-base text-green-600 hover:text-green-700 font-medium">
                Change
              </button>
            </div>
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-xl border-2 border-green-600">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              <span className="text-base sm:text-lg font-semibold text-gray-900">{selectedSlot}</span>
            </div>
          </div>

          {/* Book Now Button */}
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200">
            <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl">
              Confirm Booking
            </button>
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-3">
              Free cancellation up to 1 hour before your slot
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}