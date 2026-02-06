import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginFrom";
import OtpForm from "./OtpForm";

type AuthStep = "login" | "register" | "otp";

const API_BASE_URL = "http://localhost:8000";

export default function AuthModal({ onClose }: { onClose: () => void }) {
   
  const [step, setStep] = useState<AuthStep>("register");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailForOtp, setEmailForOtp] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  if (token) return null;
  console.log("🔥 AuthModal rendered, token =", localStorage.getItem("access_token"));

  // 🔑 THIS IS THE IMPORTANT FUNCTION
  const handleRegisterSubmit = async (formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setErrors({});

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      // ✅ SUCCESS → move to OTP
      setEmailForOtp(formData.email);
      setStep("otp");
    } catch (err) {
      console.error("Register failed:", err);
      setErrors({
        email: "Registration failed. Try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div className="w-full max-w-md bg-white p-6 rounded-xl">
        <AnimatePresence mode="wait">
          {step === "register" && (
            <RegisterForm
              key="register"
              errors={errors}
              onSubmit={handleRegisterSubmit}
              onLogin={() => setStep("login")}
            />
          )}

          {step === "login" && (
            <LoginForm
              key="login"
              onRegister={() => setStep("register")}
            />
          )}

          {step === "otp" && (
            <OtpForm
              key="otp"
              email={emailForOtp}
              onSuccess={()=> {
               navigate("/home")
                onClose();
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
