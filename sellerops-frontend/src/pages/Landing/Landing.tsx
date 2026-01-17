import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "../../i18n";
import AuthModal from "../../components/modal/AuthModal";

const SLIDE_DURATION = [2500, 2200, 2200, 2600]; // ms

export default function Landing() {
  const { landing } = useI18n();
  const slides = landing.slides;

  const [activeIndex, setActiveIndex] = useState(0);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (activeIndex < slides.length - 1) {
        const currentDuration = SLIDE_DURATION[activeIndex] ?? 2200;
      const timer = setTimeout(() => {
  setActiveIndex((prev) => prev + 1);
}, currentDuration);
      return () => clearTimeout(timer);
    } else {
      const modalTimer = setTimeout(() => {
        setShowAuth(true);
      }, 600);
      return () => clearTimeout(modalTimer);
    }
  }, [activeIndex, slides.length]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Text Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {slides[activeIndex].title}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-text-secondary">
            {slides[activeIndex].subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && <AuthModal />}
      </AnimatePresence>
    </div>
  );
}
