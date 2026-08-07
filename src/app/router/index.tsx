import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import LoginPage from "@/pages/auth/LoginPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

import AdminDashboardPage from "@/pages/admin/DashboardPage";
import ClubDashboardPage from "@/pages/club/DashboardPage";
import EventsPage from "@/pages/events/EventsPage";
import CreateEventPage from "@/pages/events/CreateEventPage";
import ClubsPage from "@/pages/clubs/ClubsPage";
import CreateClubPage from "@/pages/clubs/CreateClubPage";
import ClubProfilePage from "@/pages/clubs/ClubProfilePage";
import ClubViewPage from "@/pages/clubs/ClubViewPage";

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

      {
        path: "/club/profile",
        element: <ClubViewPage />,
      },

      {
        path: "/club/profile/edit",
        element: <ClubProfilePage />,
      },

      {
        path: "/admin/clubs",
        element: <ClubsPage />,
      },

      {
        path: "/admin/clubs/create",
        element: <CreateClubPage />,
      },
    ],
  },
]);

export default router;
