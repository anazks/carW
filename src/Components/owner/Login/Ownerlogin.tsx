import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { shopLogin } from "../../../Api/Auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/UserContext"; // Assuming shared auth context; adjust path if separate

export default function OwnerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const { token, login } = useAuth(); // Use shared context; assumes it handles owner logins

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/owner"); // Adjust redirect path as needed (e.g., owner-specific route)
    }
  }, [token, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await shopLogin({ email, password });
      console.log("Owner Login successful:", response); // For debugging

      const { token: newToken, user: loginUser } = response.result; // Assuming similar structure
      if (!newToken) {
        throw new Error("No token received from server.");
      }

      // Set token + user in context
      login(newToken, loginUser);

      // Personalized success message
      let fullName = "Owner"; // Fallback
      if (loginUser && loginUser.firstName && loginUser.lastName) {
        fullName = `${loginUser.firstName} ${loginUser.lastName}`;
      } else if (loginUser?.name) {
        fullName = loginUser.name;
      }
      setSuccess(`Welcome, ${fullName}! Logging in...`);

      // Redirect after delay
      setTimeout(() => {
        navigate("/owner"); // Adjust to your owner dashboard route
      }, 2000);
    } catch (err: any) {
      console.error("Owner Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      {/* <OwnerNavBar /> */}

      {/* PAGE WRAPPER */}
      <div className="h-screen bg-[#FFF9E8] overflow-hidden flex flex-col">
        {/* MAIN CONTENT */}
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-xs bg-white rounded-xl shadow border border-[#F1E3B3] p-5 mt-6">
            {/* BRAND */}
            <div className="text-center mb-6"> {/* Adjusted mb- for spacing */}
              <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-lg font-bold shadow">
                SC
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-3">
                Owner Login
              </h2>
              <p className="text-xs text-gray-500">
                Wash center access
              </p>
            </div>

            {/* EMAIL */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@sparklewash.com"
                className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="text-red-500 text-xs text-center mb-3">{error}</div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="text-green-600 text-xs text-center mb-3">{success}</div>
            )}

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full bg-[#D4AF37] text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Logging in..." : (
                <>
                  <Check className="w-4 h-4" />
                  Login
                </>
              )}
            </button>

            {/* SUB TEXT */}
            <p className="text-[11px] text-center text-gray-500 mt-3">
              Authorized owners only
            </p>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="w-full text-center text-sm text-gray-600 py-3 bg-gray-100">
          © {new Date().getFullYear()} Sparkle Car Wash
        </footer>
      </div>
    </>
  );
}