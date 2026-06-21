# Employee Examination Portal – Admin Portal Requirements (Enterprise Version)

## Objective

The **Admin Portal** is a centralized web application that allows administrators to configure, manage, monitor, and report on all aspects of the Employee Examination Portal. It supports multiple companies (tenants), multiple exam levels, employee onboarding, question bank management, exam scheduling, proctoring, and analytics.

---

# User Roles

| Role             | Responsibilities                                                           |
| ---------------- | -------------------------------------------------------------------------- |
| Super Admin      | Manage the entire platform, companies, global settings, users, and reports |
| Company Admin    | Manage employees, exams, questions, and reports for their assigned company |
| Question Manager | Create, upload, and manage question banks                                  |
| Evaluator        | Evaluate descriptive/coding questions and publish results                  |
| Proctor          | Monitor live exams and violations                                          |
| Auditor          | View reports and audit logs (read-only)                                    |

---

# Phase 1 – Company Management

## Module: Company Onboarding

### Objective

Allow Super Admin to onboard multiple companies into the platform.

### Features

* Create Company
* Update Company
* Activate/Deactivate Company
* Delete Company (Soft Delete)
* Upload Company Logo
* Configure Company Branding

### Company Details

* Company Code
* Company Name
* Industry
* Contact Person
* Email
* Phone Number
* Website
* Country
* State
* City
* Address
* Time Zone
* Company Logo
* Status
* Created Date

---

## Company Configuration

Configure company-specific settings.

Examples

* Maximum Exam Levels
* Pass Percentage
* Negative Marking
* Recording Enabled
* Camera Mandatory
* Microphone Mandatory
* Screen Share Mandatory
* Fullscreen Mandatory
* Number of Attempts
* Result Visibility
* Certificate Enabled
* Proctoring Enabled
* AI Monitoring Enabled
* Warning Threshold
* Auto Submit Policy
* Session Timeout

---

# Phase 2 – Employee Management

## Employee Onboarding

Support

* Single Employee Creation
* Bulk Employee Upload (Excel/CSV)
* API Integration (Future)

### Employee Details

* Employee ID
* Employee Name
* Email
* Mobile Number
* Company
* Department
* Designation
* Location
* Manager
* Date of Joining
* Employee Status
* Assigned Exam Level
* Profile Photo

### Operations

* Create
* Edit
* Delete
* Activate
* Deactivate
* Reset Password
* Unlock Account
* Resend Welcome Email

---

## Bulk Upload

Admin should be able to

* Download Template
* Upload Excel
* Validate Data
* Detect Duplicate Employee IDs
* Detect Duplicate Email IDs
* Display Error Report
* Import Valid Records
* Export Failed Records

---

# Phase 3 – Exam Level Management

Configure

* Level 0
* Level 1
* Level 2

Each level contains

* Duration
* Passing Percentage
* Number of Questions
* Negative Marking
* Question Pool
* Proctoring Rules
* Certificate Eligibility

Admin can

* Enable/Disable Level
* Clone Level
* Copy Questions Between Levels

---

# Phase 4 – Question Bank Management

## Question Categories

Examples

* Java
* React
* Python
* SQL
* Security
* Cloud
* HR
* Banking
* Compliance

---

## Difficulty

* Easy
* Medium
* Hard

---

## Supported Question Types

* Single Choice
* Multiple Choice
* True/False
* Fill in the Blank
* Match the Following
* Descriptive
* Coding
* Image Based
* Audio Based
* Video Based

---

## Upload Questions

Support

### Manual Entry

Admin can create one question at a time.

---

### Bulk Upload

Upload Excel template.

Each row should include:

* Question
* Level
* Company
* Category
* Difficulty
* Option A
* Option B
* Option C
* Option D
* Correct Answer
* Marks
* Negative Marks
* Explanation
* Tags
* Status

---

### Validation

System validates

* Duplicate Questions
* Missing Options
* Missing Answers
* Invalid Level
* Invalid Category
* Invalid Company
* Empty Question
* Invalid Marks

---

### Question Versioning

Maintain

* Version
* Modified By
* Modified Date
* Approval Status

---

## Question Approval Workflow

Draft

↓

Reviewer

↓

Approver

↓

Published

---

# Phase 5 – Exam Creation

Create Exam

### General

* Exam Name
* Company
* Level
* Description

### Timing

* Start Date
* End Date
* Duration
* Time Zone

### Rules

* Pass Percentage
* Negative Marking
* Random Questions
* Random Options
* Number of Questions
* Question Categories
* Shuffle Questions

### Proctoring

* Camera
* Microphone
* Screen Share
* Recording
* Face Detection
* AI Monitoring

---

# Phase 6 – Exam Assignment

Assign Exam

To

* Single Employee
* Multiple Employees
* Department
* Entire Company

Schedule

* Immediate
* Future Date

Retry Policy

* One Attempt
* Multiple Attempts

---

# Phase 7 – Live Exam Dashboard

Dashboard should display

## Overall

* Total Companies
* Total Employees
* Active Exams
* Completed Exams
* Running Exams
* Scheduled Exams
* Cancelled Exams

---

## Company-wise Dashboard

Display

* Company Name
* Employees Assigned
* Employees Completed
* Pass %
* Fail %
* Average Score
* Active Exams

---

## Level-wise Dashboard

Display

| Company | Level 0 | Level 1 | Level 2 |
| ------- | ------- | ------- | ------- |
| ABC Ltd | 120     | 90      | 60      |
| XYZ Ltd | 85      | 50      | 20      |

---

## Real-time Monitoring

Show

* Live Candidates
* Recording Status
* Camera Status
* Screen Share Status
* Violations
* Remaining Time

---

# Phase 8 – Results

Dashboard

Display

* Company
* Employee
* Level
* Score
* Percentage
* Status
* Rank
* Result Date

---

Filters

* Company
* Department
* Date
* Level
* Status

---

# Phase 9 – Certificates

Generate

* Company Logo
* Employee Name
* Exam Name
* Level
* Marks
* QR Code
* Certificate Number

---

# Phase 10 – Reports

Generate

## Company Reports

* Employee Count
* Exam Count
* Completion Rate

---

## Employee Reports

* Exam History
* Score History
* Level Progression

---

## Level Reports

* Pass %
* Fail %
* Average Marks

---

## Question Reports

* Frequently Wrong Questions
* Difficulty Analysis
* Question Usage

---

## Violation Reports

* Camera Violations
* Audio Violations
* Screen Violations
* Tab Switching
* Face Detection

---

Export

* Excel
* CSV
* PDF

---

# Phase 11 – Notifications

Send

* Exam Assigned
* Reminder
* Exam Started
* Result Published
* Certificate Ready

Via

* Email
* In-App

---

# Phase 12 – Audit Logs

Track

* Login
* Logout
* Company Created
* Employee Added
* Question Uploaded
* Question Modified
* Exam Created
* Exam Assigned
* Result Published
* Settings Changed

---

# Phase 13 – Settings

## Global Settings

* Password Policy
* Session Timeout
* Recording Storage
* Upload Size
* Allowed Browsers
* Supported File Types

---

## Company Settings

Each company can configure

* Branding
* Exam Rules
* Proctoring Rules
* Certificate Template
* Email Template

---

# Phase 14 – Security

* RBAC (Role-Based Access Control)
* JWT Authentication
* Multi-Factor Authentication (Optional)
* IP Whitelisting (Optional)
* HTTPS Only
* Audit Logging
* API Rate Limiting

---

# Phase 15 – Analytics Dashboard

Charts

* Exams Conducted by Month
* Company-wise Pass Percentage
* Level-wise Completion
* Top Performing Companies
* Top Performing Employees
* Department Performance
* Average Time Taken
* Question Difficulty Distribution
* Violation Trends
* AI Risk Score Distribution

---

# Phase 16 – Master Data Management

Maintain master data for:

* Companies
* Departments
* Designations
* Locations
* Skills
* Categories
* Difficulty Levels
* Question Types
* Exam Levels
* Roles
* Permissions
* Notification Templates
* Email Templates
* Certificate Templates
* Languages

---

# Phase 17 – APIs & Integrations (Future Ready)

Provide REST APIs for:

* Company Management
* Employee Sync
* Question Upload
* Exam Assignment
* Result Retrieval
* Certificate Download
* Live Proctoring Status

Support future integrations with:

* HRMS
* Active Directory / LDAP
* SSO (Azure AD, Okta, Google)
* Learning Management Systems (LMS)
* Email Services (SMTP, Microsoft 365)
* Object Storage (AWS S3, Azure Blob)

---

# Recommended Additional Features (Often Missed)

## Question Blueprint

* Define mandatory distribution of questions by category and difficulty for each level (e.g., 40% Easy, 40% Medium, 20% Hard).

## Question Pool Management

* Maintain reusable pools and automatically generate exams from them.

## Company-Specific Question Banks

* Allow:

  * Global questions (shared across all companies)
  * Company-specific questions
  * Company-specific overrides of global questions

## Exam Templates

* Save reusable templates such as:

  * React Level 0
  * Java Level 1
  * Cyber Security Level 2

## Candidate Eligibility Rules

* Minimum tenure
* Department restrictions
* Previous level passed
* Valid certification expiry

## Reassessment Workflow

* Automatic reassignment after failure
* Configurable waiting period
* Maximum retry attempts

## Manual Review Queue

* Queue descriptive answers and flagged proctoring incidents for evaluator review before publishing results.

## Data Retention & Compliance

* Configure retention periods for recordings, screenshots, logs, and exam data to meet organizational policies.

## Backup & Disaster Recovery

* Scheduled backups
* Restore functionality
* Audit of backup jobs

## Health & Monitoring Dashboard

* Server health
* API status
* Storage utilization
* Recording upload success rate
* Background job monitoring

These additions make the admin portal suitable for a **multi-tenant enterprise examination platform** capable of supporting multiple companies, configurable exam levels, scalable question management, secure proctoring, and comprehensive reporting.


Yes, absolutely. Since you already have an **Employee Examination Portal**, the **Admin Portal should be integrated into the same application**, not developed as a separate application.

## Recommended Architecture

```
Employee Examination Portal
│
├── Authentication
│
├── Employee Portal
│   ├── Dashboard
│   ├── Instructions
│   ├── Proctoring
│   ├── Exam
│   ├── Result
│   ├── Certificate
│   └── Profile
│
├── Admin Portal
│   ├── Dashboard
│   ├── Company Management
│   ├── Employee Management
│   ├── Question Bank
│   ├── Exam Management
│   ├── Exam Assignment
│   ├── Live Monitoring
│   ├── Results
│   ├── Reports
│   ├── Certificates
│   ├── Settings
│   └── Audit Logs
│
└── Super Admin Portal
    ├── Global Dashboard
    ├── Company Onboarding
    ├── Master Configuration
    ├── Role & Permission Management
    ├── Global Reports
    └── System Settings
```

---

# Multi-Tenant Structure

Since you're planning to support **multiple companies**, the system should be designed as a **multi-tenant application**.

Example:

```
Employee Examination Portal

Company A
    ├── Employees
    ├── Questions
    ├── Exams
    ├── Results
    └── Reports

Company B
    ├── Employees
    ├── Questions
    ├── Exams
    ├── Results
    └── Reports

Company C
    ├── Employees
    ├── Questions
    ├── Exams
    ├── Results
    └── Reports
```

Each company only sees its own data.

---

# Login Flow

```
https://portal.company.com

↓

Login

↓

Check Role

↓

Super Admin
        ↓
 Global Dashboard

Company Admin
        ↓
 Company Dashboard

Employee
        ↓
 Employee Dashboard

Proctor
        ↓
 Live Monitoring Dashboard

Evaluator
        ↓
 Evaluation Dashboard
```

---

# React Routing

```
/

login

/dashboard

/profile

/exam

/result

/certificate

/admin

/admin/dashboard

/admin/company

/admin/employees

/admin/questions

/admin/exams

/admin/exam-levels

/admin/exam-assignment

/admin/results

/admin/reports

/admin/live-monitor

/admin/settings

/admin/audit

/super-admin

/super-admin/company

/super-admin/roles

/super-admin/master-data

/super-admin/system-settings
```

---

# Sidebar Based on Role

## Employee

```
Dashboard

My Exams

Results

Certificates

Profile
```

---

## Company Admin

```
Dashboard

Employees

Questions

Exam Levels

Exams

Exam Assignment

Results

Reports

Live Monitoring

Certificates

Settings
```

---

## Super Admin

```
Dashboard

Companies

Global Questions

Roles

Permissions

Master Data

Reports

Audit Logs

System Configuration

License

Storage Management
```

---

# Company-Specific Data Isolation

Each company will have its own:

* Employees
* Departments
* Question Bank
* Exam Levels
* Exams
* Results
* Certificates
* Reports
* Settings
* Proctoring Logs

The application should automatically filter data based on the logged-in user's company.

---

# Shared Components

The following components should be reused across both Employee and Admin portals:

* Header
* Sidebar
* Authentication
* Notification Center
* Profile Management
* File Upload
* Data Tables
* Dialogs/Modals
* Charts
* Loading Indicators
* Error Handling
* Role-Based Route Guards

---

# Single Database Design

Instead of maintaining separate databases for each company, use a shared database with a `CompanyId` (Tenant ID) on all company-specific tables.

Example:

```
Company

Employee

Department

QuestionBank

Exam

ExamLevel

ExamAssignment

ExamSession

EmployeeAnswer

Result

Certificate

Violation

ProctorSession

AuditLog
```

Each table should include:

```
CompanyId

CreatedBy

CreatedDate

UpdatedBy

UpdatedDate

IsDeleted
```

This enables:

* Strong data isolation.
* Easier reporting.
* Simpler maintenance.
* Scalability to hundreds of companies.

---

# Dashboard Examples

## Company Admin Dashboard

```
Employees               850

Active Exams             12

Completed Exams        1,250

Pass Rate               82%

Fail Rate               18%

Today's Live Exams       45

Certificates Issued     610

Violations Today         32
```

---

## Super Admin Dashboard

```
Total Companies          120

Total Employees      48,500

Running Exams           280

Today's Exams           520

Questions            125,000

Certificates         32,000

Storage Used          1.8 TB

AI Violations         2,450
```

---

## Recommendation

Based on all the features you've described (proctoring, AI monitoring, multi-level exams, multiple companies, and enterprise reporting), I recommend building **one unified React application** with **role-based access control** rather than separate applications.

This approach provides:

* A single codebase for easier maintenance.
* Shared components and consistent UI.
* Centralized authentication and authorization.
* Simpler deployment and updates.
* Scalability for future features such as SSO, HRMS integration, and Learning Management System (LMS) integration without duplicating functionality.
