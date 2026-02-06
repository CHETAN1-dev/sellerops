import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import Dashboard from "../pages/Landing/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Analytics from "../pages/Analytics/Analytics";
import Home from "../pages/Home/HomeScreen";
import ChatLayout from "../pages/Chat/ChatLayout";
import AppLayout from "../components/layout/AppLayout";
import PublicLandingRoute from "../pages/Landing/PublicLandingRoute";


export const router = createBrowserRouter([
{
  path: "/",
  element: (
    <PublicLandingRoute>
      <Landing />
    </PublicLandingRoute>
  ),
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
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/chat/new",
        element: <ChatLayout />,
      },
      {
    path: "/chat/:chatId",
        element: <ChatLayout />,
      },
    ],
  },
]);
