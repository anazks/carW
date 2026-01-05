import { useState, useEffect } from "react";
import { ArrowLeft, Check } from "lucide-react";

export default function LoginPage() {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);

  // NEW: role selector
  const [role, setRole] = useState<"user" | "owner">("user");

  // 🔒 Disable scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSendOtp = () => {
    if (!email) return;
    setLoading(true);

    // 🔑 Later: call different APIs based on role
    // role === "owner" ? /owner/send-otp : /user/send-otp

    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otp.some((d) => !d)) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (role === "owner") {
        alert("Owner login successful");
        // navigate("/owner/dashboard")
      } else {
        alert("User login successful");
        // navigate("/")
      }
    }, 1200);
  };

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <div className="min-h-screen w-full bg-white font-[Bodoni_Moda] relative">

      <div className="flex justify-center pt-5 pb-24">
        <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg px-4 py-4">

          {/* ROLE SWITCH */}
          <div className="flex mb-4 border rounded-lg overflow-hidden">
            <button
              onClick={() => setRole("user")}
              className={`w-1/2 py-2 text-sm font-semibold ${
                role === "user"
                  ? "bg-[#D4AF37] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setRole("owner")}
              className={`w-1/2 py-2 text-sm font-semibold ${
                role === "owner"
                  ? "bg-[#D4AF37] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Carwash Owner
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            {role === "owner" ? "Owner Login" : "Login"}
          </h2>

          {step === 1 ? (
            <div className="space-y-4">
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {role === "owner" ? "Business Email" : "Email Address"}
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

              {/* SEND OTP */}
              <button
                onClick={handleSendOtp}
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

              {role === "user" && (
                <>
                  <div className="text-center text-sm text-gray-500">or</div>

                  <button
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Continue with Google
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={resetForm}
                className="flex items-center gap-2 text-[#D4AF37] font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <p className="text-sm text-gray-600">
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold">{email}</span>
              </p>

              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-9 h-10 text-center text-lg font-bold rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    style={{ backgroundColor: "#FFF4D6" }}
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.some((d) => !d)}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
                Verify & Continue
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 w-full text-center text-sm text-gray-600 py-3 bg-gray-100">
        © {new Date().getFullYear()} MyCarWash. All rights reserved.
      </footer>
    </div>
  );
}
