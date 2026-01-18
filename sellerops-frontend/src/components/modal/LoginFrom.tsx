import { motion } from "framer-motion";
import { screenVariants } from "./auth.animations";

export default function LoginForm({
  onRegister,
}: {
  onRegister: () => void;
}) {
  return (
    <motion.div
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h2 className="text-xl font-semibold mb-6">Welcome back</h2>

      <form className="space-y-4">
        <input placeholder="Email" className="input" />
        <input placeholder="Password" type="password" className="input" />

        <button className="btn-primary w-full">Login</button>
      </form>

      <p className="mt-4 text-sm text-center">
        New here?{" "}
        <button onClick={onRegister} className="text-indigo-600 font-medium">
          Create account
        </button>
      </p>
    </motion.div>
  );
}
