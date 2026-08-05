import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import LoginPage from "@/pages/auth/LoginPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

import AdminDashboardPage from "@/pages/admin/DashboardPage";
import ClubDashboardPage from "@/pages/club/DashboardPage";
import EventsPage from "@/pages/events/EventsPage";
import CreateEventPage from "@/pages/events/CreateEventPage";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
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

      {
        path: "/club/events",
        element: <EventsPage />,
      },

      {
        path: "/club/events/create",
        element: <CreateEventPage />,
      },
    ],
  },
]);

export default router;
