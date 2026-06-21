import type { UserProfile } from "@/types/auth";
import type { Exam } from "@/types/exam";

export const mockUsers: UserProfile[] = [
  {
    id: "EMP1001",
    fullName: "Aarav Sharma",
    department: "Information Security",
    role: "EMPLOYEE",
    currentLevel: 1
  },
  {
    id: "ADM2001",
    fullName: "Maya Nair",
    department: "Assessment Operations",
    role: "ADMIN",
    currentLevel: 2
  },
  {
    id: "SUP3001",
    fullName: "Ravi Menon",
    department: "Governance",
    role: "SUPER_ADMIN",
    currentLevel: 2
  }
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
