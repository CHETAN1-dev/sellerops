import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import Dashboard from "../pages/Landing/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Analytics from "../pages/Analytics/Analytics";
import Home from "../pages/Home/HomeScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>

    ),
  },
  {
    path: "/home",
    element:(
      <ProtectedRoute>
      <Home/>
      </ProtectedRoute>
    ),
  }
]);
