import type { Capability, Role } from "./auth";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  capabilities: Capability[];
  custom_capabilities: Capability[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const ADMIN_USER_ORDERING_FIELDS = ["created_at", "email", "full_name"] as const;
export type AdminUserOrderingField = (typeof ADMIN_USER_ORDERING_FIELDS)[number];

export interface AdminUserListParams {
  role?: Role;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface CreateAdminUserRequest {
  email: string;
  full_name: string;
  role: Role;
  password: string;
  capabilities?: Capability[];
}

export interface UpdateAdminUserRequest {
  email?: string;
  full_name?: string;
}

export interface UpdateRoleRequest {
  role: Role;
}

export interface UpdateCapabilitiesRequest {
  capabilities: Capability[];
}

export interface RoleDefinition {
  key: Role;
  name: string;
  capabilities: Capability[];
}

export interface CapabilityDefinition {
  key: Capability;
  name: string;
}
