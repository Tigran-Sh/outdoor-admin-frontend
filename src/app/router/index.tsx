import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import LoginPage from "@/pages/auth/LoginPage";

import AdminDashboardPage from "@/pages/admin/DashboardPage";
import ClubDashboardPage from "@/pages/club/DashboardPage";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
    ],
  },

  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboardPage />,
      },

      {
        path: "/club/dashboard",
        element: <ClubDashboardPage />,
      },
    ],
  },
]);

export default router;
