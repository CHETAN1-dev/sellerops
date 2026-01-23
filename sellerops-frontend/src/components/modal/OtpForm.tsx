import { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  email: string;
  onSuccess: () => void;
};

export default function OtpForm({ email, onSuccess }: Props) {
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    const res = await fetch("http://localhost:8000/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (!res.ok) {
      alert("Invalid OTP");
      return;
    }

    const data = await res.json();

    // ✅ SAVE TOKEN
    localStorage.setItem("access_token", data.access_token);

    // ✅ GO TO DASHBOARD
    onSuccess();
  };

  return (
    <motion.div className="space-y-4">
      <h2 className="text-xl font-semibold">Verify OTP</h2>

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="Enter OTP"
      />

      <button
        onClick={handleVerify}
        className="w-full bg-indigo-600 text-white py-2 rounded"
      >
        Verify
      </button>
    </motion.div>
  );
}
