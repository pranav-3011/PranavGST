import React, { useState, useRef } from "react";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    // TODO: Integrate with backend to send OTP
    setStep(2);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: "admin",
          password: "admin"
        })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Store the entire response data in localStorage
      localStorage.setItem("userData", JSON.stringify(data));
      
      // Redirect to home/dashboard
      window.location.href = "/";
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMobile(value);
  };

  const handleOtpChange = (index, value) => {
    value = value.replace(/[^0-9]/g, '');
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, '').slice(0, 4);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      if (pastedData.length < 4) {
        inputRefs.current[pastedData.length].focus();
      }
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0a2342] mb-2">
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {step === 1 ? "Enter your mobile number to continue" : "Enter the OTP sent to your mobile"}
          </p>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">+91</span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={handleMobileChange}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a2342] focus:border-transparent text-center text-base sm:text-lg transition-all duration-200"
                  placeholder="Enter your mobile number"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  dir="ltr"
                  style={{ textAlign: 'center' }}
                  inputMode="numeric"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 sm:py-3 px-4 bg-[#0a2342] text-white rounded-xl font-semibold hover:bg-[#112d4e] transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#0a2342] focus:ring-offset-2 text-sm sm:text-base"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="block text-center text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <div className="flex gap-2 sm:gap-3 justify-center">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a2342] focus:border-transparent transition-all duration-200"
                    maxLength={1}
                    pattern="[0-9]"
                    inputMode="numeric"
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
                Didn't receive OTP? <button type="button" className="text-[#0a2342] font-medium hover:underline">Resend</button>
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-2 sm:py-3 px-4 bg-[#0a2342] text-white rounded-xl font-semibold hover:bg-[#112d4e] transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#0a2342] focus:ring-offset-2 text-sm sm:text-base"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
