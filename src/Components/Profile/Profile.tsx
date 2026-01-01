import { User, Mail, Phone, Calendar, Settings, LogOut, Edit } from 'lucide-react';
import booking1Img from '../../assets/images/car1.jpg';
import booking2Img from '../../assets/images/car2.jpg';

const dummyUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 987-654-3210",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  totalBookings: 12,
  totalSpent: "₹4,250",
  memberSince: "2024-03-15"
};

// Local images for recent bookings
const dummyRecentBookings = [
  { 
    id: 1, 
    shop: "Mycarwash Downtown", 
    date: "2025-11-05", 
    service: "Express Wash", 
    price: "₹150",
    image: booking1Img
  },
  { 
    id: 2, 
    shop: "Mycarwash Uptown", 
    date: "2025-11-03", 
    service: "Full Detail", 
    price: "₹450",
    image: booking2Img
  }
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#b69530] bg-clip-text text-transparent mb-2"
            style={{ fontFamily: "'Bodoni Moda', serif" }}
          >
            Profile
          </h1>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl overflow-hidden mb-8">
          <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={dummyUser.avatar}
                  alt={dummyUser.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
              {/* User Details */}
              <div className="flex-1 text-center lg:text-left">
                <h2
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: "'Bodoni Moda', serif" }}
                >
                  {dummyUser.name}
                </h2>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 mt-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-sm">{dummyUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-sm">{dummyUser.phone}</span>
                  </div>
                </div>
              </div>
              {/* Edit Button */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b69530] transition-colors">
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                  Edit Profile
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl overflow-hidden mb-8">
          <div className="p-6 lg:p-8">
            <h3
              className="text-lg font-semibold mb-4 text-gray-900"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Your Stats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{dummyUser.totalBookings}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <span className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 flex items-center justify-center text-2xl font-bold">₹</span>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{dummyUser.totalSpent}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <User className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-2xl font-bold text-gray-900">{new Date(dummyUser.memberSince).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl overflow-hidden mb-8">
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-semibold text-gray-900"
                style={{ fontFamily: "'Bodoni Moda', serif" }}
              >
                Recent Bookings
              </h3>
              <button className="text-[#D4AF37] hover:text-[#b69530] font-medium text-sm">
                View All History
              </button>
            </div>
            <div className="space-y-4">
              {dummyRecentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={booking.image}
                      alt={booking.shop}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className="font-medium text-gray-900"
                      style={{ fontFamily: "'Bodoni Moda', serif" }}
                    >
                      {booking.shop}
                    </h4>
                    <p className="text-sm text-gray-600">{booking.date} • {booking.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{booking.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings & Logout */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="p-6 lg:p-8 space-y-4">
            <h3
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Account Settings
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-[#D4AF37]" />
                <span style={{ fontFamily: "'Bodoni Moda', serif" }}>Privacy & Security</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="w-5 h-5 text-[#D4AF37] flex items-center justify-center text-sm font-bold">₹</span>
                <span style={{ fontFamily: "'Bodoni Moda', serif" }}>Payment Methods</span>
              </button>
            </div>
            <button className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium" style={{ fontFamily: "'Bodoni Moda', serif" }}>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
