import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { userLogin } from '../../Api/Auth';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/UserContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { token, setToken } = useAuth();

  // 🔒 Disable scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await userLogin({ email, password });
      console.log("Login successful:", response);
      setToken(response.result.token);
      navigate("/");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen w-full bg-white font-[Bodoni_Moda] relative">
      <div className="flex justify-center pt-5 pb-24">
        <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg px-4 py-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Login
          </h2>
          <div className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
                placeholder="Enter your password"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>
            {/* ERROR MESSAGE */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Logging in..." : (
                <>
                  <Check className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
            <div className="text-center text-sm text-gray-500">or</div>
            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg font-semibold hover:bg-gray-50"
            >
              Continue with Google
            </button>
            {/* RESET LINK */}
            <button
              onClick={resetForm}
              className="w-full text-[#D4AF37] font-medium text-xs text-center underline"
            >
              Reset Form
            </button>
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 w-full text-center text-sm text-gray-600 py-3 bg-gray-100">
        © {new Date().getFullYear()} MyCarWash. All rights reserved.
      </footer>
    </div>
  );
}