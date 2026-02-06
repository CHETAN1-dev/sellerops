// import type { JSX } from "react";
// import { Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// export default function PublicLandingRoute({
//   children,
// }: {
//   children: JSX.Element;
// }) {
//   const [token, setToken] = useState(localStorage.getItem("access_token"));

//   useEffect(() => {
//     // Check token on mount and when storage changes
//     const checkAuth = () => {
//       setToken(localStorage.getItem("access_token"));
//     };

//     checkAuth();
//     window.addEventListener("storage", checkAuth);
    
//     // Also set up an interval to check periodically (handles back button)
//     const interval = setInterval(checkAuth, 100);

//     return () => {
//       window.removeEventListener("storage", checkAuth);
//       clearInterval(interval);
//     };
//   }, []);

//   if (token) {
//     return <Navigate to="/home" replace />;
//   }

//   return children;
// }

import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PublicLandingRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  useEffect(() => {
    // Check token on mount and when storage changes
    const checkAuth = () => {
      setToken(localStorage.getItem("access_token"));
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    
    // Also set up an interval to check periodically (handles back button)
    const interval = setInterval(checkAuth, 100);

    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, []);

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children;
}