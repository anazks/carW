import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { userRegister } from '../../Api/Auth';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/UserContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    city: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const { token } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Required fields check
    if (!formData.firstName || !formData.lastName || !formData.mobileNo || !formData.password) {
      setError("Please fill in all required fields (marked with *).");
      return false;
    }

    // First name validation
    if (formData.firstName.length > 40) {
      setError("First name must be less than 40 characters.");
      return false;
    }

    // Last name validation
    if (formData.lastName.length > 100) {
      setError("Last name must be less than 100 characters.");
      return false;
    }

    // Mobile number validation (basic)
    if (!/^[0-9+\-\s()]{10,15}$/.test(formData.mobileNo)) {
      setError("Please enter a valid mobile number (10-15 digits).");
      return false;
    }

    // Email validation (if provided)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (formData.email && formData.email.length > 100) {
      setError("Email must be less than 100 characters.");
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data for API call (remove confirmPassword)
      const { confirmPassword, ...registerData } = formData;
      
      // Add role if not provided (default to 'user' as per schema)
      const dataToSend = {
        ...registerData,
        role: 'user' // Default role as per your schema
      };

      const response = await userRegister(dataToSend);
      console.log("Registration successful:", response);
      
      // Check response structure
      if (response.success) {
        setSuccess("Registration successful! Redirecting to login...");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
      
    } catch (err: any) {
      // Handle different error formats
      if (err.response) {
        // Server responded with error status
        setError(err.response.data?.message || err.response.data?.error || "Registration failed. Please try again.");
      } else if (err.request) {
        // No response received
        setError("Network error. Please check your connection.");
      } else {
        // Other errors
        setError(err.message || "Registration failed. Please try again.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      mobileNo: "",
      city: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-white font-[Bodoni_Moda] relative flex flex-col">
      <div className="flex-1 flex justify-center px-4 pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 md:pb-8">
        <div className="w-full max-w-sm md:max-w-md bg-white rounded-2xl shadow-lg px-4 py-6 sm:px-6 sm:py-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-4 sm:mb-6">
            Create Account
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {/* NAME FIELDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  maxLength={40}
                  className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
                  style={{ backgroundColor: "#FFF4D6" }}
                />
                <p className="text-xs text-gray-500 mt-1">Max 40 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  maxLength={100}
                  className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
                  style={{ backgroundColor: "#FFF4D6" }}
                />
                <p className="text-xs text-gray-500 mt-1">Max 100 characters</p>
              </div>
            </div>

            {/* MOBILE NUMBER */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="+1234567890"
                maxLength={15}
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
                style={{ backgroundColor: "#FFF4D6" }}
              />
              <p className="text-xs text-gray-500 mt-1">10-15 digits</p>
            </div>

            {/* CITY (OPTIONAL) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* EMAIL (OPTIONAL) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                maxLength={100}
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
                style={{ backgroundColor: "#FFF4D6" }}
              />
              <p className="text-xs text-gray-500 mt-1">Optional, max 100 characters</p>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="text-red-500 text-sm text-center pt-1">{error}</div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="text-green-600 text-sm text-center pt-1">{success}</div>
            )}

            {/* REGISTER BUTTON */}
            <button
              onClick={handleRegister}
              disabled={loading || !formData.firstName || !formData.lastName || !formData.mobileNo || !formData.password || !formData.confirmPassword}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 mt-2 text-sm"
            >
              {loading ? "Creating Account..." : (
                <>
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Create Account
                </>
              )}
            </button>

            {/* DIVIDER */}
            <div className="text-center text-sm text-gray-500">or</div>

            {/* GOOGLE SIGNUP */}
            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border py-2.5 rounded-lg font-semibold hover:bg-gray-50 text-sm"
            >
              Continue with Google
            </button>

            {/* FORM ACTIONS */}
            <div className="flex flex-col sm:flex-row sm:justify-between pt-2 gap-2 sm:gap-0">
              <button
                onClick={resetForm}
                className="text-[#D4AF37] font-medium text-xs underline text-center sm:text-left"
              >
                Reset Form
              </button>
              <button
                onClick={goToLogin}
                className="text-gray-600 font-medium text-xs hover:text-[#D4AF37] text-center sm:text-right"
              >
                Already have an account? Login
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full text-center text-xs sm:text-sm text-gray-600 py-2 sm:py-3 bg-gray-100 shrink-0">
        © {new Date().getFullYear()} MyCarWash. All rights reserved.
      </footer>
    </div>
  );
}