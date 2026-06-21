export type UserRole = "EMPLOYEE" | "ADMIN" | "SUPER_ADMIN";

export type LoginPayload = {
  employeeId: string;
  password: string;
  selectedRole?: UserRole;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
};

export type UserProfile = {
  id: string;
  fullName: string;
  department: string;
  role: UserRole;
  currentLevel: 0 | 1 | 2;
};
