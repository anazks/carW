import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: any) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSendOtp = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.some(d => !d)) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Login successful!');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Google login successful!');
    }, 1500);
  };

  const resetForm = () => {
    setStep(1);
    setEmail('');
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <>
      {/* PAGE WRAPPER — prevents scroll */}
      <div
        className="flex items-center justify-center bg-gradient-to-br from-white via-[#FEF9F2] to-white overflow-hidden"
        style={{
          height: 'calc(100vh - 112px)', // 64px navbar + 48px footer
          fontFamily: "'Bodoni Moda', serif",
        }}
      >
        {/* LOGIN CARD */}
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            {/* Heading */}
            <div className="p-5 text-center">
              <h1 className="text-3xl font-bold text-gray-800">Login</h1>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 1 ? (
                <div className="space-y-6">

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      style={{ backgroundColor: '#FFF4D6', color: '#333' }}
                    />
                  </div>

                  {/* Send OTP */}
                  <button
                    onClick={handleSendOtp}
                    disabled={loading || !email}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-2.5 rounded-lg font-semibold hover:from-[#b69530] hover:to-[#D4AF37] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>

                  {/* Divider */}
                  <div className="relative text-center">
                    <span className="px-4 bg-white text-sm text-gray-500">
                      Or continue with
                    </span>
                  </div>

                  {/* Google Login */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">

                  {/* Back */}
                  <button
                    onClick={resetForm}
                    className="flex items-center gap-2 text-[#D4AF37] font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  {/* OTP Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Verify OTP
                    </h2>
                    <p className="text-sm text-gray-600">
                      Code sent to <span className="font-semibold">{email}</span>
                    </p>
                  </div>

                  {/* OTP Inputs */}
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        value={digit}
                        maxLength={1}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-11 h-12 text-center text-xl font-bold rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        style={{ backgroundColor: '#FFF4D6', color: '#333' }}
                      />
                    ))}
                  </div>

                  {/* Verify */}
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.some(d => !d)}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                    Verify & Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
