import { useState } from 'react';
import { Droplet, Mail, ArrowLeft, Check } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: email, 2: otp
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSendOtp = () => {
    if (!email || (!isLogin && !name)) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.some(d => !d)) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Login successful!');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate Google OAuth
    setTimeout(() => {
      setLoading(false);
      alert('Google login successful!');
    }, 1500);
  };

  const resetForm = () => {
    setStep(1);
    setEmail('');
    setName('');
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative flex items-center justify-center space-x-3 mb-2">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <Droplet className="w-8 h-8" fill="white" />
              </div>
              <h1 className="text-3xl font-bold">Mycarwash</h1>
            </div>
            <p className="text-center text-green-50 text-sm">Premium Car Wash Service</p>
          </div>

          {/* Toggle Login/Register */}
          <div className="flex">
            <button
              onClick={() => { setIsLogin(true); resetForm(); }}
              className={`flex-1 py-4 font-semibold transition-all duration-200 relative ${
                isLogin ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
              {isLogin && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
              )}
            </button>
            <button
              onClick={() => { setIsLogin(false); resetForm(); }}
              className={`flex-1 py-4 font-semibold transition-all duration-200 relative ${
                !isLogin ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
              {!isLogin && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
              )}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {step === 1 ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLogin ? 'Welcome Back!' : 'Create Account'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {isLogin 
                      ? 'Enter your email to receive a login code' 
                      : 'Join us for the best car wash experience'}
                  </p>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading || !email || (!isLogin && !name)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-3 bg-white py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  onClick={resetForm}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Verify OTP
                  </h2>
                  <p className="text-gray-600 text-sm">
                    We've sent a 6-digit code to <span className="font-semibold text-gray-800">{email}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Enter OTP Code
                  </label>
                  <div className="flex justify-between space-x-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.some(d => !d)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => { resetForm(); setTimeout(handleSendOtp, 100); }}
                    className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-600 text-sm mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-green-600 hover:text-green-700 font-medium">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-green-600 hover:text-green-700 font-medium">
            Privacy Policy
          </a>
        </p>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}