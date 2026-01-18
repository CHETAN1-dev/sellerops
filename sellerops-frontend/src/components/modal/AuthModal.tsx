import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import LoginForm from "./LoginFrom";
import RegisterForm from "./RegisterForm";
import OtpForm from "./OtpForm";

import { modalVariants } from "./auth.animations";
import { shakeVariants } from "../../animations/shake";
import { validateRegister } from "../../utils/validators";

type AuthStep = "login" | "register" | "otp";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<AuthStep>("register");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shouldShake, setShouldShake] = useState(false);

  /**
   * 🔐 Called ONLY by RegisterForm
   */
  const handleRegisterSubmit = (formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const result = validateRegister(formData);

    if (!result.valid) {
      setErrors(result.errors);
      setShouldShake(true);

      // reset shake animation
      setTimeout(() => setShouldShake(false), 400);
      return;
    }

    setErrors({});
    setStep("otp");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl"
      >
        <motion.div
          variants={shakeVariants}
          animate={shouldShake ? "shake" : "idle"}
        >
          <AnimatePresence mode="wait">
            {step === "login" && (
              <LoginForm
                key="login"
                onRegister={() => setStep("register")}
              />
            )}

            {step === "register" && (
              <RegisterForm
                key="register"
                errors={errors}
                onSubmit={handleRegisterSubmit}
                onLogin={() => setStep("login")}
              />
            )}

            {step === "otp" && (
              <OtpForm
                key="otp"
                onSuccess={onClose}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
