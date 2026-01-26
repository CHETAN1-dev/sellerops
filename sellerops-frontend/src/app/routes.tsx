import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import Dashboard from "../pages/Landing/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Analytics from "../pages/Analytics/Analytics";
import Home from "../pages/Home/HomeScreen";
import ChatLayout from "../pages/Chat/ChatLayout";
import AppLayout from "../components/layout/AppLayout";


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
  // {
  //   path: "/home",
  //   element:(
  //     <ProtectedRoute>
  //     <Home/>
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path : "/chat/new",
  //   element :(
  //     <ProtectedRoute>
  //       <ChatLayout/>
  //     </ProtectedRoute>
  //   )
  // }

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
        path: "/chat/:id",
        element: <ChatLayout />,
      },
    ],
  },
]);
