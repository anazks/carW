import React from 'react';
import { MapPin, Clock, Star, Phone, CheckCircle, XCircle, Clock as ClockIcon, Calendar } from 'lucide-react';

interface Booking {
  id: number;
  shopName: string;
  location: string;
  date: string;
  time: string;
  service: string;
  price: string;
  status: 'completed' | 'cancelled' | 'upcoming';
}

const dummyBookings: Booking[] = [
  {
    id: 1,
    shopName: "CleanRide Downtown",
    location: "123 Main Street, Downtown",
    date: "2025-11-05",
    time: "2:00 PM - 2:30 PM",
    service: "Express Wash",
    price: "₹150",
    status: "completed"
  },
  {
    id: 2,
    shopName: "CleanRide Uptown",
    location: "456 Oak Avenue, Uptown",
    date: "2025-11-07",
    time: "4:00 PM - 4:45 PM",
    service: "Full Detail",
    price: "₹450",
    price: "₹450",
    status: "completed"
  },
  {
    id: 3,
    shopName: "CleanRide Westside",
    location: "789 Pine Road, Westside",
    date: "2025-11-10",
    time: "10:00 AM - 10:30 AM",
    service: "Basic Wash",
    price: "₹120",
    status: "upcoming"
  },
  {
    id: 4,
    shopName: "CleanRide Eastside",
    location: "101 Elm Boulevard, Eastside",
    date: "2025-11-03",
    time: "3:00 PM - 3:30 PM",
    service: "Interior Clean",
    price: "₹300",
    status: "cancelled"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'cancelled':
      return <XCircle className="w-5 h-5 text-red-600" />;
    case 'upcoming':
      return <ClockIcon className="w-5 h-5 text-blue-600" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'upcoming':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function History() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        

        {/* Bookings List */}
        <div className="space-y-6">
          {dummyBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 space-y-4">
                {/* Header: Shop Name and Location */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{booking.shopName}</h3>
                    <div className="flex items-center space-x-2 text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{booking.location}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1 capitalize">{booking.status}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">Service:</span>
                    <span>{booking.service}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-blue-600">{booking.price}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-100">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    {booking.status === 'upcoming' ? 'Reschedule' : 'View Receipt'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State if no bookings */}
        {dummyBookings.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Your booking history will appear here once you make a reservation.</p>
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}