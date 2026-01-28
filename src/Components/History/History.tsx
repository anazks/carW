import { useState, useEffect, useMemo } from 'react';
import { MapPin, Clock, Check, X, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { getBookingHistory } from '../../Api/Booking';
import { useNavigate } from 'react-router-dom';

interface Booking {
  _id: string;
  shopId: string;
  barberName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  services: Array<{
    name: string;
    price: number;
    duration: number;
  }>;
  totalPrice: number;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'paid' | 'partial' | 'refunded';
  amountPaid: number;
  timeSlotName?: string;
  timeSlotStart?: string;
  timeSlotEnd?: string;
  bookingTimestamp?: string;
  createdAt?: string;
  remainingAmount?: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'confirmed':
      return 'bg-green-100 text-green-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    case 'pending':
    case 'upcoming':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
    case 'confirmed':
      return <Check className="w-4 h-4" />;
    case 'cancelled':
      return <X className="w-4 h-4" />;
    case 'pending':
    case 'upcoming':
      return <Clock className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const formatTimeSlot = (startTime: string, endTime: string) => {
  const start = formatTime(startTime);
  const end = formatTime(endTime);
  return `${start} - ${end}`;
};

export default function History() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getBookingHistory();
      console.log('Fetched booking history response:', response);
      if (response.status === 200 && response.data?.success) {
        setBookings(response.data.bookings || []);
      } else {
        setError('Failed to fetch booking history');
      }
    } catch (err: any) {
      console.error('Error fetching booking history:', err);
      setError(err.message || 'An error occurred while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  // Sort bookings by date (newest first)
  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      // Use bookingTimestamp if available, otherwise use createdAt, otherwise use startTime
      const dateA = a.bookingTimestamp || a.createdAt || a.startTime;
      const dateB = b.bookingTimestamp || b.createdAt || b.startTime;
      
      // Sort in descending order (newest first)
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }, [bookings]);

  const handleBookNow = () => {
    navigate('/shops'); // Navigate to shops page
  };

  const handleViewReceipt = (bookingId: string) => {
    // Navigate to receipt page or show receipt modal
    console.log('View receipt for booking:', bookingId);
    // You can implement receipt viewing logic here
  };

  const handleReschedule = (bookingId: string) => {
    // Navigate to reschedule page or show reschedule modal
    console.log('Reschedule booking:', bookingId);
    // You can implement rescheduling logic here
  };

  const getDisplayStatus = (booking: Booking) => {
    if (booking.bookingStatus === 'pending' && new Date(booking.startTime) > new Date()) {
      return 'upcoming';
    }
    return booking.bookingStatus;
  };

  const getServiceNames = (services: Booking['services']) => {
    return services.map(service => service.name).join(', ');
  };

  const getTotalDuration = (services: Booking['services']) => {
    return services.reduce((total, service) => total + service.duration, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF8DC] to-[#FFF1B5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF8DC] to-[#FFF1B5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "'Bodoni Moda', serif" }}
          >
            Booking History
          </h1>
          <button 
            onClick={handleBookNow}
            className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#b69530] transition-all"
          >
            Book Now
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-center">{error}</p>
            <div className="text-center mt-2">
              <button 
                onClick={fetchBookingHistory}
                className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Booking Count */}
        {sortedBookings.length > 0 && (
          <div className="mb-6 text-gray-600 text-sm">
            Showing {sortedBookings.length} booking{sortedBookings.length > 1 ? 's' : ''} (sorted by most recent)
          </div>
        )}

        {/* Booking Cards */}
        <div className="space-y-6">
          {sortedBookings.map((booking) => {
            const displayStatus = getDisplayStatus(booking);
            const serviceNames = getServiceNames(booking.services);
            const totalDuration = getTotalDuration(booking.services);
            const formattedDate = formatDate(booking.bookingDate);
            const timeSlot = formatTimeSlot(booking.startTime, booking.endTime);
            
            // Format booking timestamp
            const bookingTime = booking.bookingTimestamp || booking.createdAt;
            const formattedBookingTime = bookingTime ? formatTime(bookingTime) : null;
            const formattedBookingDate = bookingTime ? formatDate(bookingTime) : null;
            
            return (
              <div key={booking._id} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8 space-y-4">
                  {/* Header: Shop & Status */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2
                        className="text-xl font-bold text-gray-900"
                        style={{ fontFamily: "'Bodoni Moda', serif" }}
                      >
                        {booking.barberName || 'Barber Shop'}
                      </h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600 mt-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#D4AF37]" />
                          <span className="text-sm">Booking ID: {booking._id.slice(-8)}</span>
                        </div>
                        {bookingTime && (
                          <div className="text-xs text-gray-500">
                            Booked on {formattedBookingDate} at {formattedBookingTime}
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(displayStatus)}`}
                    >
                      {getStatusIcon(displayStatus)}
                      <span className="capitalize">{displayStatus}</span>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="flex flex-wrap gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-700'
                        : booking.paymentStatus === 'partial'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </div>
                    {booking.amountPaid > 0 && (
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Paid: ₹{booking.amountPaid}
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      <div>
                        <div className="font-medium text-sm text-gray-500">Appointment Date</div>
                        <div>{formattedDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <div>
                        <div className="font-medium text-sm text-gray-500">Time Slot</div>
                        <div>{timeSlot}</div>
                        {booking.timeSlotName && (
                          <div className="text-xs text-gray-500">{booking.timeSlotName}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <div>
                        <div className="font-medium text-sm text-gray-500">Duration</div>
                        <div>{totalDuration} minutes</div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="font-medium text-sm text-gray-500 mb-1">Services</div>
                      <div>{serviceNames}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {booking.services.length} service{booking.services.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                      <div>
                        <div className="font-medium text-sm text-gray-500">Total Amount</div>
                        <div className="font-bold text-lg text-gray-900">₹{booking.totalPrice}</div>
                        {booking.remainingAmount && booking.remainingAmount > 0 && (
                          <div className="text-sm text-gray-500">Remaining: ₹{booking.remainingAmount}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-100 flex gap-3">
                    {displayStatus === 'upcoming' || displayStatus === 'pending' ? (
                      <>
                        <button 
                          onClick={() => handleReschedule(booking._id)}
                          className="px-4 py-2 bg-white border border-[#D4AF37] text-[#D4AF37] font-semibold rounded-xl hover:bg-[#FFF8DC] transition-all text-sm"
                        >
                          Reschedule
                        </button>
                        <button 
                          onClick={() => handleViewReceipt(booking._id)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleViewReceipt(booking._id)}
                        className="px-4 py-2 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#b69530] transition-all text-sm"
                      >
                        View Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && bookings.length === 0 && !error && (
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
            <button 
              onClick={handleBookNow}
              className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#b69530]"
            >
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}