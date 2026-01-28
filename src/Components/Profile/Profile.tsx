import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Settings, LogOut, Edit, Loader2 } from 'lucide-react';
import { getProfile } from '../../Api/Auth';
import {getProfileShop} from '../../Api/Service';
interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  city: string;
  email: string;
  role: string;
  totalBookings?: number;
  totalSpent?: string;
  memberSince?: string;
  avatar?: string;
}

const defaultUser: UserProfile = {
  _id: '',
  firstName: '',
  lastName: '',
  mobileNo: '',
  city: '',
  email: '',
  role: 'user',
  totalBookings: 0,
  totalSpent: '₹0',
  memberSince: new Date().toISOString().split('T')[0],
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
};

export default function Profile() {
  const [userData, setUserData] = useState<UserProfile>(defaultUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    mobileNo?: string;
  }>({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getProfile();
      console.log('Profile API response:', response);
      
      if (!response.success) {
        const userProfile = response.data.user;
        console.log('User Profile Data:', userProfile);
        // Transform API response to match our interface
        setUserData({
          _id: userProfile._id,
          firstName: userProfile.firstName || '',
          lastName: userProfile.lastName || '',
          mobileNo: userProfile.mobileNo || '',
          city: userProfile.city || '',
          email: userProfile.email || '',
          role: userProfile.role || 'user',
          totalBookings: 0, // You might need to fetch this from another API
          totalSpent: '₹0', // You might need to fetch this from another API
          memberSince: userProfile.createdAt || new Date().toISOString().split('T')[0],
          avatar: defaultUser.avatar // Keep default avatar or implement avatar API
        });
      } else {
        setError('Failed to fetch profile');
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'An error occurred while fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const validateProfile = () => {
    const newErrors: typeof errors = {};

    // First Name
    if (!userData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[A-Za-z\s]+$/.test(userData.firstName)) {
      newErrors.firstName = "First name cannot contain numbers or symbols";
    } else if (userData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name
    if (!userData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[A-Za-z\s]+$/.test(userData.lastName)) {
      newErrors.lastName = "Last name cannot contain numbers or symbols";
    }

    // Email
    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Mobile Number
    const phoneValue = userData.mobileNo.replace(/\s/g, "");
    if (!phoneValue) {
      newErrors.mobileNo = "Phone number is required";
    } else if (!/^(\+91|91)?[6-9]\d{9}$/.test(phoneValue)) {
      newErrors.mobileNo = "Enter a valid Indian mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateProfile()) return;

    // Here you would typically call an updateProfile API
    console.log("Updated User Data:", userData);
    alert("Profile updated successfully!");
    setIsEditing(false);
    setErrors({});
  };

  const handleLogout = () => {
    // Clear local storage/auth tokens
    localStorage.clear();
    // Redirect to login page
    window.location.href = '/login';
  };

  const getFullName = () => {
    return `${userData.firstName} ${userData.lastName}`.trim();
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display
    if (phone.length === 10) {
      return `+91 ${phone.slice(0,5)} ${phone.slice(5)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b69530]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <h1
          className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#D4AF37] to-[#b69530] bg-clip-text text-transparent"
          style={{ fontFamily: "'Bodoni Moda', serif" }}
        >
          Profile
        </h1>

        {/* User Info */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <img
              src={userData.avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#FFF8DC]"
            />

            <div className="flex-1 w-full space-y-3">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        value={userData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        placeholder="First Name"
                        className={`w-full px-3 py-2 border rounded-lg ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <input
                        value={userData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        placeholder="Last Name"
                        className={`w-full px-3 py-2 border rounded-lg ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <input
                      value={userData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="Email"
                      type="email"
                      className={`w-full px-3 py-2 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <input
                      value={userData.mobileNo}
                      onChange={(e) => handleChange("mobileNo", e.target.value)}
                      placeholder="Mobile Number"
                      className={`w-full px-3 py-2 border rounded-lg ${errors.mobileNo ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.mobileNo && <p className="text-red-500 text-xs mt-1">{errors.mobileNo}</p>}
                  </div>

                  <div>
                    <input
                      value={userData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="City"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800">{getFullName()}</h2>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} className="text-[#D4AF37]" /> {userData.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} className="text-[#D4AF37]" /> {formatPhoneNumber(userData.mobileNo)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">City:</span> {userData.city || 'Not specified'}
                  </p>
                  <p className="text-sm text-gray-500">
                    User ID: {userData._id.slice(-8)}
                  </p>
                </>
              )}
            </div>

            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                    fetchUserProfile(); // Reload original data
                  }}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b69530] transition-colors"
              >
                <Edit size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#FFF8DC] rounded-xl">
            <Calendar className="mx-auto text-[#D4AF37] mb-2" size={24} />
            <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-800">{userData.totalBookings}</p>
          </div>
          <div className="text-center p-4 bg-[#FFF8DC] rounded-xl">
            <div className="text-2xl font-bold text-[#D4AF37] mb-2">₹</div>
            <p className="text-sm text-gray-500 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-gray-800">{userData.totalSpent}</p>
          </div>
          <div className="text-center p-4 bg-[#FFF8DC] rounded-xl">
            <User className="mx-auto text-[#D4AF37] mb-2" size={24} />
            <p className="text-sm text-gray-500 mb-1">Member Since</p>
            <p className="text-xl font-bold text-gray-800">
              {userData.memberSince ? new Date(userData.memberSince).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Recent Bookings Section (Optional - You can integrate with booking history API) */}
        {/* <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Bookings</h3>
          <div className="space-y-4">
            {dummyRecentBookings.map((b) => (
              <div key={b.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg items-center">
                <img src={b.image} className="w-16 h-16 rounded-lg object-cover" alt={b.shop} />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{b.shop}</p>
                  <p className="text-sm text-gray-500">
                    {b.date} • {b.service}
                  </p>
                </div>
                <p className="font-semibold text-[#D4AF37]">{b.price}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Account Settings */}
        <div className="bg-white rounded-2xl p-6 space-y-3 shadow-sm">
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <Settings className="text-[#D4AF37]" size={18} />
              <span className="text-gray-700">Account Settings</span>
            </div>
            <span className="text-gray-400 group-hover:text-[#D4AF37]">→</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Development Note */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This profile component now fetches real user data from the API.
              The edit functionality currently only updates local state. To persist changes, you'll need to 
              implement an updateProfile API endpoint.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}