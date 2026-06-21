export type UserRole = "EMPLOYEE" | "ADMIN" | "SUPER_ADMIN";

export type CompanyStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type Company = {
  id: string;
  code: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  status: CompanyStatus;
  logoUrl?: string;
  createdAt: string;
  maxExamLevels: number;
  passPercentage: number;
  cameraRequired: boolean;
  micRequired: boolean;
  screenShareRequired: boolean;
  aiMonitoringEnabled: boolean;
};

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
  designation?: string;
  email?: string;
  mobile?: string;
  companyId: string;
  role: UserRole;
  currentLevel: 0 | 1 | 2;
  status?: "ACTIVE" | "INACTIVE";
};
