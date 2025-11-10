import React, { useState } from 'react';
import { MapPin, Clock, Star, Phone, Users, DollarSign, Truck, Home, Check, X } from 'lucide-react';

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
  services: ["Express Wash", "Full Detail", "Interior Clean", "Wax & Polish"],
  price: "₹150 - ₹500",
  image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  capacity: 5,
  totalTime: "30-45 minutes",
  selectedSlot: "2:00 PM - 2:30 PM",
  pickAndDrop: true,
  washAtHome: true,
  pickDropPrice: "+ ₹50",
  homeServicePrice: "+ ₹100"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group">
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to locations</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left: Shop Image */}
            <div className="relative h-96 lg:h-auto min-h-[500px]">
              <div 
                className="absolute inset-0"
                style={{ background: center.image }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Info Cards */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  {/* Rating Badge */}
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-bold text-gray-900">{center.rating}</span>
                    <span className="text-sm text-gray-600">({center.reviews} reviews)</span>
                  </div>

                  {/* Distance Badge */}
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-900">{center.distance}</span>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="space-y-3">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 font-medium">Available Now</span>
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-900 font-semibold">{center.capacity} slots free</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-900 font-semibold">{center.totalTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="p-8 lg:p-10 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">{center.name}</h1>
                
                <div className="flex items-start space-x-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-base">{center.location}</span>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Hours</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{center.hours}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{center.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Type Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Choose Service Type</h3>
                <div className="grid grid-cols-3 gap-3">
                  {serviceOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = serviceType === option.id;
                    const isAvailable = option.available;
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => isAvailable && setServiceType(option.id as any)}
                        disabled={!isAvailable}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : isAvailable
                            ? 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className={`p-2 rounded-lg ${
                            isSelected ? 'bg-blue-600' : 'bg-gray-200'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isSelected ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="text-center">
                            <p className={`text-sm font-semibold ${
                              isSelected ? 'text-blue-600' : 'text-gray-900'
                            }`}>
                              {option.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                            {option.extraCharge && (
                              <p className="text-xs font-semibold text-green-600 mt-1">
                                {option.extraCharge}
                              </p>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-1">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {!isAvailable && (
                          <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                            <X className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Available Services</h3>
                <div className="flex flex-wrap gap-2">
                  {center.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200 hover:shadow-md transition-shadow"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Price Range</p>
                    <p className="text-2xl font-bold text-gray-900">{center.price}</p>
                  </div>
                  <div className="bg-white p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Selected Slot */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Selected Slot</p>
                    <p className="text-xl font-bold text-blue-600">{selectedSlot}</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium underline">
                    Change
                  </button>
                </div>
              </div>

              {/* Book Now Button */}
              <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl relative overflow-hidden group">
                <span className="relative z-10">Confirm Booking</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>

              <p className="text-center text-sm text-gray-500">
                Free cancellation up to 1 hour before your slot
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}