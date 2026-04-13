import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { userLogin, shopLogin } from "../../Api/Auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/UserContext";


export default function LoginPage() {
  const navigate = useNavigate();
  const { token, login, loading: authLoading, user: currentUser } = useAuth();
  const [loginType, setLoginType] = useState<"user" | "owner">("user");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Redirect if already logged in (only after context has finished loading)
  useEffect(() => {
    if (!authLoading && token && currentUser) {
      if (currentUser.role === "owner") {
        navigate("/owner", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [token, authLoading, currentUser, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const loginFn = loginType === "owner" ? shopLogin : userLogin;
      const response = await loginFn({ email, password });
      console.log("Login Response:", response);

      login(response.token, response.user);
      
      setSuccess("Login successful! Redirecting...");
      
      // Role-based redirection
      if (response.user.role === "owner") {
        navigate("/owner");
      } else {
        navigate("/home");
      }

    } catch (err: any) {
      console.error("Login Error:", err);
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="h-screen flex flex-col items-center bg-white font-[Bodoni_Moda] overflow-hidden pt-16">

      {/* Login Card */}
      <div className="w-full max-w-xs bg-white rounded-xl shadow-md p-5 border border-gray-100">

        <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
          Welcome Back
        </h2>

        {/* User / Owner Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6 sticky">
          <button
            onClick={() => setLoginType("user")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
              loginType === "user"
                ? "bg-white shadow text-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            User Login
          </button>
          <button
            onClick={() => setLoginType("owner")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
              loginType === "owner"
                ? "bg-white shadow text-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Owner Login
          </button>
        </div>

        <div className="space-y-3">

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-1.5 text-sm rounded-md outline-none focus:ring-2 focus:ring-[#D4AF37] bg-[#FFF4D6]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-1.5 text-sm rounded-md outline-none focus:ring-2 focus:ring-[#D4AF37] bg-[#FFF4D6]"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-500 text-xs text-center">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="text-green-600 text-xs text-center">
              {success}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-1.5 text-sm rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition"
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                <Check className="w-4 h-4" />
                Login
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={resetForm}
            className="w-full text-[#D4AF37] text-xs text-center underline"
          >
            Reset
          </button>
          <div className="text-center text-xs mt-3">
  Don't have an account?{" "}
  <span
    onClick={() => navigate("/register", { state: { role: loginType } })}
    className="text-[#D4AF37] cursor-pointer underline"
  >
    Register
  </span>
</div>

        </div>
      </div>

    </div>
  );
}