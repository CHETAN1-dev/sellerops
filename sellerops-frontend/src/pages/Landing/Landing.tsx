/* eslint-disable react-hooks/rules-of-hooks */
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { useI18n } from "../../i18n";
// import AuthModal from "../../components/modal/AuthModal";

// const SLIDE_DURATION = [2500, 2200, 2200, 2600];

// export default function Landing() {
//   const { landing } = useI18n();
//   const slides = landing.slides;
//   const navigate = useNavigate();

//   const [isAuthenticated, setIsAuthenticated] = useState(
//     !!localStorage.getItem("access_token")
//   );
//   const [slidesDone, setSlidesDone] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);

//   // Immediate redirect if already authenticated
//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       navigate("/home", { replace: true });
//       return;
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const syncAuth = () => {
//       const token = localStorage.getItem("access_token");
//       setIsAuthenticated(!!token);
      
//       // If user logs in, redirect immediately
//       if (token) {
//         navigate("/home", { replace: true });
//       }
//     };

//     syncAuth();
//     window.addEventListener("storage", syncAuth);
    
//     // Poll for auth changes (handles edge cases)
//     const interval = setInterval(syncAuth, 500);
    
//     return () => {
//       window.removeEventListener("storage", syncAuth);
//       clearInterval(interval);
//     };
//   }, [navigate]);

//   useEffect(() => {
//     // Don't run slide animation if authenticated
//     if (isAuthenticated) return;
    
//     if (activeIndex < slides.length - 1) {
//       const timer = setTimeout(() => {
//         setActiveIndex((prev) => prev + 1);
//       }, SLIDE_DURATION[activeIndex] ?? 2200);
//       return () => clearTimeout(timer);
//     } else {
//       const endTimer = setTimeout(() => {
//         setSlidesDone(true);
//       }, 600);
//       return () => clearTimeout(endTimer);
//     }
//   }, [activeIndex, slides.length, isAuthenticated]);

//   // Don't render anything if authenticated (PublicLandingRoute will redirect)
//   if (isAuthenticated) {
//     return null;
//   }

//   return (
//     <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
//       <AnimatePresence mode="wait">
//         <motion.div key={activeIndex} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl">
//           <h1 className="text-4xl md:text-6xl font-bold">{slides[activeIndex].title}</h1>
//           <p className="mt-4 text-lg text-text-secondary">{slides[activeIndex].subtitle}</p>
//         </motion.div>
//       </AnimatePresence>
//       <AnimatePresence>
//         {slidesDone && !isAuthenticated && <AuthModal onClose={() => { }} />}
//       </AnimatePresence>
//     </div>
//   );
// }
console.log("🔥🔥🔥 LANDING.TSX FILE LOADED - NEW VERSION 🔥🔥🔥");

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n";
import AuthModal from "../../components/modal/AuthModal";

const SLIDE_DURATION = [2500, 2200, 2200, 2600];

export default function Landing() {
  console.log("🚨🚨🚨 LANDING COMPONENT RENDERING 🚨🚨🚨");
  
  const { landing } = useI18n();
  const slides = landing.slides;
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  console.log("TOKEN CHECK:", token ? "EXISTS ✅" : "NOT FOUND ❌");

  // If token exists, redirect IMMEDIATELY
  if (token) {
    console.log("🚀🚀🚀 REDIRECTING TO HOME 🚀🚀🚀");
    navigate("/home", { replace: true });
    return null;
  }

  const [slidesDone, setSlidesDone] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    console.log("⚡ Slide effect running, activeIndex:", activeIndex);
    
    if (activeIndex < slides.length - 1) {
      const timer = setTimeout(() => {
        setActiveIndex((prev) => prev + 1);
      }, SLIDE_DURATION[activeIndex] ?? 2200);
      return () => clearTimeout(timer);
    } else {
      const endTimer = setTimeout(() => {
        console.log("✅ Slides done, showing AuthModal");
        setSlidesDone(true);
      }, 600);
      return () => clearTimeout(endTimer);
    }
  }, [activeIndex, slides.length]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeIndex} 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -40 }} 
          transition={{ duration: 0.6 }} 
          className="text-center max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold">{slides[activeIndex].title}</h1>
          <p className="mt-4 text-lg text-text-secondary">{slides[activeIndex].subtitle}</p>
        </motion.div>
      </AnimatePresence>
      
      <AnimatePresence>
        {slidesDone && <AuthModal onClose={() => {}} />}
      </AnimatePresence>
    </div>
  );
}