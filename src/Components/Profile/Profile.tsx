import { useState } from 'react';
import { User, Mail, Phone, Calendar, Settings, LogOut, Edit } from 'lucide-react';
import booking1Img from '../../assets/images/car1.jpg';
import booking2Img from '../../assets/images/car2.jpg';

const dummyUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 9876543210",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  totalBookings: 12,
  totalSpent: "₹4,250",
  memberSince: "2024-03-15",
};

const dummyRecentBookings = [
  {
    id: 1,
    shop: "Mycarwash Downtown",
    date: "2025-11-05",
    service: "Express Wash",
    price: "₹150",
    image: booking1Img,
  },
  {
    id: 2,
    shop: "Mycarwash Uptown",
    date: "2025-11-03",
    service: "Full Detail",
    price: "₹450",
    image: booking2Img,
  },
];

export default function Profile() {
  const [userData, setUserData] = useState(dummyUser);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const handleChange = (field: keyof typeof userData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ ONLY LOGIC CHANGED (NO UI CHANGE)
  const validateProfile = () => {
    const newErrors: typeof errors = {};

    // NAME: only letters & spaces
    if (!userData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(userData.name)) {
      newErrors.name = "Name cannot contain numbers or symbols";
    } else if (userData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // EMAIL
    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // PHONE: supports +91 / 91 / 10 digits
    const phoneValue = userData.phone.replace(/\s/g, "");
    if (!phoneValue) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+91|91)?[6-9]\d{9}$/.test(phoneValue)) {
      newErrors.phone = "Enter a valid Indian mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateProfile()) return;

    console.log("Updated User Data:", userData);
    alert("Profile updated successfully!");
    setIsEditing(false);
    setErrors({});
  };

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
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <img
              src={userData.avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover"
            />

            <div className="flex-1 w-full space-y-2">
              {isEditing ? (
                <>
                  <input
                    value={userData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.name && "border-red-500"}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                  <input
                    value={userData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.email && "border-red-500"}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

                  <input
                    value={userData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.phone && "border-red-500"}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} /> {userData.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} /> {userData.phone}
                  </p>
                </>
              )}
            </div>

            {isEditing ? (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-green-600 text-white rounded-lg"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-white rounded-lg"
              >
                <Edit size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <Calendar className="mx-auto text-[#D4AF37]" />
            <p className="text-sm text-gray-500">Bookings</p>
            <p className="text-xl font-bold">{userData.totalBookings}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#D4AF37]">₹</p>
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-xl font-bold">{userData.totalSpent}</p>
          </div>
          <div className="text-center">
            <User className="mx-auto text-[#D4AF37]" />
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="text-xl font-bold">
              {new Date(userData.memberSince).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {dummyRecentBookings.map((b) => (
              <div key={b.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                <img src={b.image} className="w-16 h-16 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{b.shop}</p>
                  <p className="text-sm text-gray-500">
                    {b.date} • {b.service}
                  </p>
                </div>
                <p className="font-semibold">{b.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl p-6 space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg">
            <Settings className="text-[#D4AF37]" /> Account Settings
          </button>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
            <LogOut /> Logout
          </button>
        </div>

      </div>
    </div>
  );
}
