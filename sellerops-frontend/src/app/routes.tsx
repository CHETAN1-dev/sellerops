import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import Dashboard from "../pages/Landing/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";

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
]);
