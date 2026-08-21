import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import RequireAuth from "./RequireAuth";
import RequireGuest from "./RequireGuest";
import RequireRole from "./RequireRole";

import LoginPage from "@/pages/auth/LoginPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

import AdminDashboardPage from "@/pages/admin/DashboardPage";
import ClubDashboardPage from "@/pages/club/DashboardPage";
import EventsPage from "@/pages/events/EventsPage";
import CreateEventPage from "@/pages/events/CreateEventPage";
import EditEventPage from "@/pages/events/EditEventPage";
import EventViewPage from "@/pages/events/EventViewPage";
import ClubsPage from "@/pages/clubs/ClubsPage";
import CreateClubPage from "@/pages/clubs/CreateClubPage";
import EditClubPage from "@/pages/clubs/EditClubPage";
import AdminClubViewPage from "@/pages/clubs/AdminClubViewPage";
import ClubProfilePage from "@/pages/clubs/ClubProfilePage";
import ClubViewPage from "@/pages/clubs/ClubViewPage";
import TeamPage from "@/pages/team/TeamPage";
import CreateTeamMemberPage from "@/pages/team/CreateTeamMemberPage";
import EditTeamMemberPage from "@/pages/team/EditTeamMemberPage";
import TeamMemberViewPage from "@/pages/team/TeamMemberViewPage";
import UsersPage from "@/pages/admin/users/UsersPage";
import CreateUserPage from "@/pages/admin/users/CreateUserPage";
import EditUserPage from "@/pages/admin/users/EditUserPage";
import UserViewPage from "@/pages/admin/users/UserViewPage";
import RolesPage from "@/pages/admin/roles/RolesPage";
import ProfilePage from "@/pages/profile/ProfilePage";

const router = createBrowserRouter([
  {
    element: <RequireGuest />,
    children: [
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
    ],
  },

  {
    element: <RequireAuth />,
    children: [
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
            path: "/profile",
            element: <ProfilePage />,
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
            path: "/club/events/:id/edit",
            element: <EditEventPage />,
          },

          {
            path: "/club/events/:id",
            element: <EventViewPage />,
          },

          {
            path: "/club/team",
            element: <TeamPage />,
          },

          {
            path: "/club/team/create",
            element: <CreateTeamMemberPage />,
          },

          {
            path: "/club/team/:id/edit",
            element: <EditTeamMemberPage />,
          },

          {
            path: "/club/team/:id",
            element: <TeamMemberViewPage />,
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

          {
            path: "/admin/clubs/:id/edit",
            element: <EditClubPage />,
          },

          {
            path: "/admin/clubs/:id",
            element: <AdminClubViewPage />,
          },

          {
            element: <RequireRole allow={["platform_admin"]} />,
            children: [
              {
                path: "/admin/users",
                element: <UsersPage />,
              },

              {
                path: "/admin/users/create",
                element: <CreateUserPage />,
              },

              {
                path: "/admin/users/:id/edit",
                element: <EditUserPage />,
              },

              {
                path: "/admin/users/:id",
                element: <UserViewPage />,
              },

              {
                path: "/admin/roles",
                element: <RolesPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
