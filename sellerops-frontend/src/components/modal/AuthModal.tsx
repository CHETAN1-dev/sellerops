import { motion } from "framer-motion";
import { useI18n } from "../../i18n";

export default function AuthModal() {
  const { auth } = useI18n();

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
    >
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">{auth.title}</h2>
        <p className="mt-1 text-sm text-text-secondary">
          {auth.subtitle}
        </p>

        <div className="mt-6 space-y-4">
          <input
            placeholder={auth.email}
            className="w-full rounded-lg border px-4 py-3"
          />
          <input
            type="password"
            placeholder={auth.password}
            className="w-full rounded-lg border px-4 py-3"
          />
          <button className="w-full rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary py-3 text-white">
            {auth.login}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
