import React from 'react';
import { User, Mail, Phone, Calendar, DollarSign, Settings, LogOut, Edit } from 'lucide-react';

const dummyUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 987-654-3210",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  totalBookings: 12,
  totalSpent: "₹4,250",
  memberSince: "2024-03-15"
};

const dummyRecentBookings = [
  { id: 1, shop: "CleanRide Downtown", date: "2025-11-05", service: "Express Wash", price: "₹150" },
  { id: 2, shop: "CleanRide Uptown", date: "2025-11-03", service: "Full Detail", price: "₹450" }
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            Profile
          </h1>
          <p className="text-lg text-gray-600">
            Manage your account and view your activity
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={dummyUser.avatar}
                  alt={dummyUser.name}
                  className="w-24 h-24 rounded-full object-cover shadow-lg"
                />
              </div>
              {/* User Details */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{dummyUser.name}</h2>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 mt-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{dummyUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{dummyUser.phone}</span>
                  </div>
                </div>
              </div>
              {/* Edit Button */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium">Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 lg:p-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Your Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{dummyUser.totalBookings}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{dummyUser.totalSpent}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <User className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-2xl font-bold text-gray-900">{new Date(dummyUser.memberSince).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View All History
              </button>
            </div>
            <div className="space-y-4">
              {dummyRecentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{booking.shop}</h4>
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 lg:p-8 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
                <span>Privacy & Security</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <DollarSign className="w-5 h-5" />
                <span>Payment Methods</span>
              </button>
            </div>
            <button className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}