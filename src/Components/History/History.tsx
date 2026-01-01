import { MapPin, Clock, Check, X } from 'lucide-react';

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
    shopName: "Mycarwash Downtown",
    location: "123 Main Street, Downtown",
    date: "2025-11-05",
    time: "2:00 PM - 2:30 PM",
    service: "Express Wash",
    price: "₹150",
    status: "completed"
  },
  {
    id: 2,
    shopName: "Mycarwash Uptown",
    location: "456 Oak Avenue, Uptown",
    date: "2025-11-07",
    time: "4:00 PM - 4:45 PM",
    service: "Full Detail",
    price: "₹450",
    status: "completed"
  },
  {
    id: 3,
    shopName: "Mycarwash Westside",
    location: "789 Pine Road, Westside",
    date: "2025-11-10",
    time: "10:00 AM - 10:30 AM",
    service: "Basic Wash",
    price: "₹120",
    status: "upcoming"
  },
  {
    id: 4,
    shopName: "Mycarwash Eastside",
    location: "101 Elm Boulevard, Eastside",
    date: "2025-11-03",
    time: "3:00 PM - 3:30 PM",
    service: "Interior Clean",
    price: "₹300",
    status: "cancelled"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    case 'upcoming':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <Check className="w-4 h-4" />;
    case 'cancelled':
      return <X className="w-4 h-4" />;
    case 'upcoming':
      return <Clock className="w-4 h-4" />;
    default:
      return null;
  }
};

export default function History() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF8DC] to-[#FFF1B5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h1
          className="text-3xl font-bold mb-8 text-gray-900"
          style={{ fontFamily: "'Bodoni Moda', serif" }}
        >
          Booking History
        </h1>

        {/* Booking Cards */}
        <div className="space-y-6">
          {dummyBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8 space-y-4">
                {/* Header: Shop & Status */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2
                      className="text-xl font-bold text-gray-900"
                      style={{ fontFamily: "'Bodoni Moda', serif" }}
                    >
                      {booking.shopName}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-sm">{booking.location}</span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                  >
                    {getStatusIcon(booking.status)}
                    <span className="capitalize">{booking.status}</span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Service:</span>
                    <span>{booking.service}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{booking.price}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-100">
                  <button className="px-4 py-2 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#b69530] transition-all text-sm">
                    {booking.status === 'upcoming' ? 'Reschedule' : 'View Receipt'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {dummyBookings.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
            <h3
              className="text-xl font-semibold text-gray-900 mb-2"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              No bookings yet
            </h3>
            <p className="text-gray-600 mb-6">
              Your booking history will appear here once you make a reservation.
            </p>
            <button className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#b69530]">
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
