import type { UserProfile } from "@/types/auth";
import type { Company } from "@/types/auth";
import type { Exam } from "@/types/exam";

export const mockCompanies: Company[] = [
  {
    id: "COMP001",
    code: "ACME",
    name: "Acme Technologies",
    industry: "Information Technology",
    contactPerson: "Ravi Menon",
    email: "ravi@acme.com",
    phone: "+91-9876543210",
    country: "India",
    city: "Bangalore",
    status: "ACTIVE",
    createdAt: "2024-01-15",
    maxExamLevels: 3,
    passPercentage: 70,
    cameraRequired: true,
    micRequired: true,
    screenShareRequired: true,
    aiMonitoringEnabled: true,
  },
  {
    id: "COMP002",
    code: "ZETA",
    name: "Zeta Financial Services",
    industry: "Banking & Finance",
    contactPerson: "Priya Iyer",
    email: "priya@zeta.com",
    phone: "+91-9123456789",
    country: "India",
    city: "Mumbai",
    status: "ACTIVE",
    createdAt: "2024-03-20",
    maxExamLevels: 2,
    passPercentage: 75,
    cameraRequired: true,
    micRequired: false,
    screenShareRequired: true,
    aiMonitoringEnabled: false,
  },
  {
    id: "COMP003",
    code: "NOVA",
    name: "Nova Healthcare",
    industry: "Healthcare",
    contactPerson: "Dr. Arjun Rao",
    email: "arjun@novahc.com",
    phone: "+91-9012345678",
    country: "India",
    city: "Hyderabad",
    status: "INACTIVE",
    createdAt: "2024-06-01",
    maxExamLevels: 3,
    passPercentage: 60,
    cameraRequired: true,
    micRequired: true,
    screenShareRequired: false,
    aiMonitoringEnabled: true,
  },
];

export const mockUsers: UserProfile[] = [
  {
    id: "EMP1001",
    fullName: "Aarav Sharma",
    department: "Information Security",
    designation: "Security Analyst",
    email: "aarav@acme.com",
    mobile: "+91-9876001001",
    companyId: "COMP001",
    role: "EMPLOYEE",
    currentLevel: 1,
    status: "ACTIVE",
  },
  {
    id: "ADM2001",
    fullName: "Maya Nair",
    department: "Assessment Operations",
    designation: "Assessment Manager",
    email: "maya@acme.com",
    mobile: "+91-9876002001",
    companyId: "COMP001",
    role: "ADMIN",
    currentLevel: 2,
    status: "ACTIVE",
  },
  {
    id: "SUP3001",
    fullName: "Ravi Menon",
    department: "Governance",
    designation: "Super Administrator",
    email: "ravi@acme.com",
    mobile: "+91-9876003001",
    companyId: "COMP001",
    role: "SUPER_ADMIN",
    currentLevel: 2,
    status: "ACTIVE",
  },
  {
    id: "EMP2001",
    fullName: "Sneha Kulkarni",
    department: "Compliance",
    designation: "Compliance Officer",
    email: "sneha@zeta.com",
    mobile: "+91-9123001001",
    companyId: "COMP002",
    role: "EMPLOYEE",
    currentLevel: 0,
    status: "ACTIVE",
  },
  {
    id: "EMP2002",
    fullName: "Vikram Desai",
    department: "Risk Management",
    designation: "Risk Analyst",
    email: "vikram@zeta.com",
    mobile: "+91-9123001002",
    companyId: "COMP002",
    role: "EMPLOYEE",
    currentLevel: 1,
    status: "ACTIVE",
  },
  {
    id: "ADM2002",
    fullName: "Priya Iyer",
    department: "HR",
    designation: "HR Manager",
    email: "priya@zeta.com",
    mobile: "+91-9123002001",
    companyId: "COMP002",
    role: "ADMIN",
    currentLevel: 2,
    status: "ACTIVE",
  },
];

export const mockExams: Exam[] = [
  {
    id: "L0-SEC-001",
    title: "Level 0 Security Basics",
    level: 0,
    durationMinutes: 20,
    totalMarks: 20,
    passPercentage: 60,
    assignedTo: ["EMP1001"],
    questions: [
      {
        id: "q1",
        type: "MCQ",
        marks: 2,
        questionText: "Which principle means giving users minimum required permissions?",
        options: ["Least Privilege", "Data Retention", "Fail Open", "Obfuscation"],
        correctAnswer: "Least Privilege"
      },
      {
        id: "q2",
        type: "TRUE_FALSE",
        marks: 2,
        questionText: "HTTPS helps protect data in transit.",
        options: ["True", "False"],
        correctAnswer: "True"
      },
      {
        id: "q3",
        type: "FILL_BLANK",
        marks: 2,
        questionText: "The process of proving identity is called ____.",
        correctAnswer: "authentication"
      },
      {
        id: "q4",
        type: "MULTI_SELECT",
        marks: 2,
        questionText: "Select strong password practices.",
        options: [
          "Use 12+ characters",
          "Reuse the same password",
          "Enable MFA",
          "Share password via chat"
        ],
        correctAnswer: ["Use 12+ characters", "Enable MFA"]
      }
    ]
  },
  {
    id: "L1-RBAC-002",
    title: "Level 1 Access Control",
    level: 1,
    durationMinutes: 30,
    totalMarks: 40,
    passPercentage: 70,
    assignedTo: ["EMP1001"],
    questions: [
      {
        id: "q5",
        type: "MCQ",
        marks: 4,
        questionText: "In RBAC, users gain permissions through:",
        options: ["Device IDs", "Roles", "Firewall rules", "MAC addresses"],
        correctAnswer: "Roles"
      },
      {
        id: "q6",
        type: "MULTI_SELECT",
        marks: 4,
        questionText: "Choose valid audit controls.",
        options: [
          "Log failed login attempts",
          "Disable all logs",
          "Enable immutable log storage",
          "Allow anonymous admin actions"
        ],
        correctAnswer: ["Log failed login attempts", "Enable immutable log storage"]
      },
      {
        id: "q7",
        type: "TRUE_FALSE",
        marks: 4,
        questionText: "Role explosion can increase maintenance overhead.",
        options: ["True", "False"],
        correctAnswer: "True"
      },
      {
        id: "q8",
        type: "DESCRIPTIVE",
        marks: 8,
        questionText: "Describe two controls to prevent privilege escalation.",
        correctAnswer: "manual-review"
      }
    ]
  },
  {
    id: "L2-ADV-003",
    title: "Level 2 Advanced Compliance",
    level: 2,
    durationMinutes: 45,
    totalMarks: 60,
    passPercentage: 75,
    assignedTo: ["EMP1001"],
    questions: [
      {
        id: "q9",
        type: "CASE_STUDY",
        marks: 10,
        questionText: "Analyze a data exposure incident and draft containment steps.",
        correctAnswer: "manual-review"
      }
    ]
  }
];
