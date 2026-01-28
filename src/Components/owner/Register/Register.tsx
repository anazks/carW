import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { shopRegister } from "../../../Api/Auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleRegister = async () => {
    // Basic validation matching schema
    if (!firstName || !lastName || !mobileNo || !email || !city || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    // Mobile number validation (basic, assuming 10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobileNo)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await shopRegister({
        firstName,
        lastName,
        mobileNo,
        email,
        city,
        password,
      });
      console.log("Registration successful:", response); // For debugging

      // Assuming success response; adjust based on API
      if (response.success) { // Or check response.status === 201, etc.
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/owner/login"); // Redirect to owner login page
        }, 2000);
      } else {
        throw new Error(response.message || "Registration failed.");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setMobileNo("");
    setEmail("");
    setCity("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF9E8] font-[Bodoni_Moda] relative flex flex-col">
      {/* MAIN CONTENT */}
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-[#F1E3B3] p-6">
          {/* BRAND */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center text-white text-lg font-bold shadow">
              SC
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-3">
              Owner Registration
            </h2>
            <p className="text-xs text-gray-500">
              Create your Sparkle Car Wash account
            </p>
          </div>

          <div className="space-y-4">
            {/* FIRST NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                maxLength={40}
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* LAST NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                maxLength={100}
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* MOBILE NO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, ''))} // Only digits
                placeholder="1234567890"
                maxLength={10}
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@sparklewash.com"
                maxLength={100}
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* CITY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kochi"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="text-red-500 text-sm text-center flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="text-green-600 text-sm text-center flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                {success}
              </div>
            )}

            {/* REGISTER BUTTON */}
            <button
              onClick={handleRegister}
              disabled={loading || !firstName || !lastName || !mobileNo || !email || !city || !password}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Registering..." : (
                <>
                  <Check className="w-5 h-5" />
                  Register
                </>
              )}
            </button>

            {/* LINK TO LOGIN */}
            <div className="text-center">
              <button
                onClick={() => navigate("/owner-login")}
                className="text-[#D4AF37] font-medium text-xs underline hover:opacity-80"
              >
                Already have an account? Login
              </button>
            </div>

            {/* RESET BUTTON */}
            <button
              onClick={resetForm}
              className="w-full text-gray-500 font-medium text-xs text-center underline hover:opacity-80"
            >
              Reset Form
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full text-center text-sm text-gray-600 py-3 bg-gray-100">
        © {new Date().getFullYear()} Sparkle Car Wash. All rights reserved.
      </footer>
    </div>
  );
}