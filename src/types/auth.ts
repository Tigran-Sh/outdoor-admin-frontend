export const ROLES = [
  "participant",
  "club_owner",
  "guide",
  "internal_admin",
  "platform_admin",
] as const;

export type Role = (typeof ROLES)[number];

export const CAPABILITIES = [
  "edit_club_profile",
  "create_event",
  "edit_event",
  "publish_event",
  "view_participants",
  "export_participants",
  "qr_check_in",
  "confirm_completion",
  "view_finances",
  "manage_team_members",
  "cancel_event",
  "request_refund",
  "verify_club",
  "suspend_club",
  "issue_refund",
] as const;

export type Capability = (typeof CAPABILITIES)[number];

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  capabilities: Capability[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshRequest {
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  refresh: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  status: "password_changed";
}
