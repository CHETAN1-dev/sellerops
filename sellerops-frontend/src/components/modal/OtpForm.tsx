import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  onSuccess: () => void;
};

export default function OtpForm({ onSuccess }: Props) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  // ⏱ Countdown timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 🔢 Handle OTP typing
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  // 🔙 Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && inputsRef.current[index - 1]) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ✅ Submit OTP
  const handleVerify = () => {
    const code = otp.join("");
    if (code.length === 6) {
      // later → API call
      onSuccess();
    }
  };

  // 🔁 Resend OTP
  const resendOtp = () => {
    setOtp(Array(6).fill(""));
    setTimer(30);
    inputsRef.current[0]?.focus();
  };

  return (
    <motion.div
      key="otp"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-center">
        Verify OTP
      </h2>

      <p className="text-center text-sm text-gray-500">
        Enter the 6-digit code sent to your email
      </p>

      {/* OTP boxes */}
      <div className="flex justify-center gap-2">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => {
              if (el) inputsRef.current[i] = el;
            }}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            maxLength={1}
            className="h-12 w-10 rounded border text-center text-lg focus:border-indigo-600 focus:outline-none"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="w-full rounded bg-indigo-600 py-2 text-white"
      >
        Verify
      </button>

      <div className="text-center text-sm">
        {timer > 0 ? (
          <span className="text-gray-400">
            Resend OTP in {timer}s
          </span>
        ) : (
          <button
            onClick={resendOtp}
            className="text-indigo-600 hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </motion.div>
  );
}
