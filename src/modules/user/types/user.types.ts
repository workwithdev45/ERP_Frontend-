export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface UserSummary {
  id: number;
  tenantId: string;
  tenantName: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  status: UserStatus;
  roles: string[];
  roleIds: number[];
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roleIds: number[];
}

export interface InviteUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  /** Omit to give the member the default All org users role. */
  roleIds?: number[];
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  status?: UserStatus;
  roleIds?: number[];
}

export interface AcceptUserInviteRequest {
  email: string;
  inviteToken: string;
  password: string;
}
