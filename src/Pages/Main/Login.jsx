import React, { useState } from "react";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const handleSendOtp = (e) => {
    e.preventDefault();
    // TODO: Integrate with backend to send OTP
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    // Set dummy token for testing private routing
    localStorage.setItem("token", "dummy_token");
    // Redirect to home/dashboard
    window.location.href = "/";
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#0a2342]">
          Login with OTP
        </h2>
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2342]"
                placeholder="Enter your mobile number"
                required
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#0a2342] text-white rounded-lg font-semibold hover:bg-[#112d4e] transition cursor-pointer"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2342]"
                placeholder="Enter the OTP"
                required
                pattern="[0-9]{4}"
                maxLength={4}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#0a2342] text-white rounded-lg font-semibold hover:bg-[#112d4e] transition cursor-pointer"
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
