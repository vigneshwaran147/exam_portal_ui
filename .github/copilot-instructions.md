# GitHub Copilot Instructions

## Project Overview


# Employee Examination Portal (Level 0 → Level 2)

**Technology Stack:** React 18 + TypeScript + MUI + Java Spring Boot + PostgreSQL + WebSocket/Socket.IO

---

# 1. Overview

The Employee Examination Portal is a secure online assessment platform that enables employees to take certification or compliance exams under AI-assisted proctoring. The portal consists of **three sequential examination levels**:

* **Level 0** – Basic Assessment
* **Level 1** – Intermediate Assessment
* **Level 2** – Advanced Assessment

Employees must pass each level before accessing the next.

---

# 2. User Roles

## Employee

* Login
* View assigned exams
* Take exams
* View results
* Download certificate (after final level)
* View exam history

---

## Administrator

* Create exams
* Manage question banks
* Assign exams
* Monitor live exams
* View violations
* Publish results
* Generate reports
* Manage users

---

## Super Administrator

* Manage departments
* Manage roles
* Configure exam rules
* Configure proctoring rules
* Configure passing criteria
* Dashboard analytics

---

# 3. Exam Flow

```text
Login

↓

Dashboard

↓

Level 0

↓

Pass?

├── No → Retry Level 0
└── Yes

↓

Level 1

↓

Pass?

├── No → Retry Level 1
└── Yes

↓

Level 2

↓

Pass?

├── No → Retry Level 2
└── Yes

↓

Certificate
```

---

# 4. Dashboard

Employee Dashboard

* Welcome Screen
* Upcoming Exams
* Current Level
* Previous Scores
* Certificates
* Notifications
* Exam History
* Recent Violations
* Profile

---

Admin Dashboard

* Total Employees
* Active Exams
* Completed Exams
* Live Exams
* Violations
* Average Score
* Pass Percentage
* Fail Percentage
* AI Alerts
* Reports

---

# 5. Exam Types

* Multiple Choice Questions (MCQ)
* Multiple Select
* True/False
* Fill in the Blank
* Match the Following
* Descriptive
* Coding Questions
* Case Study
* Image-based Questions
* Audio Questions
* Video Questions
* File Upload

---

# 6. Question Bank

Question Categories

* Technical
* Security
* Compliance
* HR
* Banking
* Programming
* Networking
* Cloud
* Database
* AI

Question Difficulty

* Easy
* Medium
* Hard

Question Tags

* React
* Java
* Python
* AWS
* Azure
* SAP
* Identity
* NIST
* ISO
* Cyber Security

---

# 7. Exam Rules

* Fixed duration
* Negative marking (optional)
* Random question order
* Random option order
* Shuffle questions
* Auto save
* Auto submit
* Resume after reconnect (optional)
* Time extension (admin only)
* One attempt or multiple attempts
* Scheduled exam window

---

# 8. Proctoring Features

## Camera

* Webcam mandatory
* Face visible
* Face detection
* Multiple face detection
* No face detection
* Camera disconnected detection
* Low light detection
* Looking away detection

---

## Audio

* Microphone mandatory
* Voice detection
* Multiple voices detection
* Background noise detection
* Microphone disconnected
* Audio recording

---

## Screen

* Screen sharing mandatory
* Screen recording
* Screen disconnected
* External monitor detection (best effort)
* Resolution monitoring

---

## Browser Monitoring

* Fullscreen enforcement
* Exit fullscreen detection
* Tab switching
* Window switching
* Multiple browser detection (best effort)
* Developer tools detection (limited)
* Copy disabled
* Paste disabled
* Print disabled
* Right-click disabled
* Keyboard shortcut restrictions

---

## Network Monitoring

* Internet disconnected
* Slow network
* IP address logging
* Browser information
* Operating system
* Device information

---

## AI Monitoring

* Face Recognition
* Eye Tracking
* Looking Away
* Sleeping Detection
* Multiple Person Detection
* Phone Detection (advanced AI)
* Object Detection
* Mouth Movement
* Head Movement

---

# 9. Proctoring by Level

| Feature                 | Level 0 | Level 1 | Level 2 |
| ----------------------- | ------- | ------- | ------- |
| Webcam                  | ✔       | ✔       | ✔       |
| Microphone              | ✔       | ✔       | ✔       |
| Fullscreen              | ✔       | ✔       | ✔       |
| Tab Switch              | ✔       | ✔       | ✔       |
| Copy/Paste Restriction  | ✔       | ✔       | ✔       |
| Screen Share            | ✔       | ✔       | ✔       |
| Screen Recording        | ✔       | ✔       | ✔       |
| Audio Recording         | ✔       | ✔       | ✔       |
| Video Recording         | ✔       | ✔       | ✔       |
| Face Detection          | ✔       | ✔       | ✔       |
| Multiple Face Detection | ✔       | ✔       | ✔       |
| Looking Away            | ✔       | ✔       | ✔       |
| AI Monitoring           | ✔       | ✔       | ✔       |
| Live Admin Monitoring   | ✔       | ✔       | ✔       |

---

# 10. Employee Pages

* Login
* Dashboard
* Profile
* Instructions
* System Compatibility Check
* Camera & Microphone Check
* Exam Rules
* Exam Page
* Review Answers
* Submit Confirmation
* Results
* Certificates
* History

---

# 11. Administrator Pages

* Dashboard
* User Management
* Department Management
* Question Bank
* Category Management
* Exam Management
* Exam Assignment
* Live Monitoring
* Violations
* Results
* Reports
* Certificate Management
* Settings

---

# 12. React Project Structure

```text
src/
│
├── api/
├── assets/
├── components/
│      Camera/
│      Audio/
│      Screen/
│      Timer/
│      Header/
│      Sidebar/
│      Question/
│      Loader/
│
├── hooks/
├── pages/
│      Login/
│      Dashboard/
│      Exam/
│      Result/
│      Certificate/
│      Admin/
│
├── routes/
├── redux/
├── services/
├── utils/
├── types/
└── App.tsx
```

---

# 13. Backend APIs

## Authentication

* POST /login
* POST /logout
* POST /refresh-token

---

## Employee

* GET /employee/profile
* GET /employee/dashboard
* GET /employee/history

---

## Exam

* GET /exam/list
* GET /exam/{id}
* GET /exam/{id}/questions
* POST /exam/start
* POST /exam/save-answer
* POST /exam/review
* POST /exam/submit

---

## Proctoring

* POST /camera/status
* POST /audio/status
* POST /screen/status
* POST /fullscreen/status
* POST /tab/status
* POST /violation
* POST /heartbeat

---

## Recording

* POST /upload/image
* POST /upload/video
* POST /upload/audio
* POST /upload/screen

---

## Admin

* GET /admin/dashboard
* GET /admin/live-exams
* GET /admin/violations
* GET /admin/reports
* POST /admin/publish-results

---

# 14. Database Tables

## Master Tables

* Users
* Roles
* Departments
* Designations
* Categories
* Tags

## Exam Tables

* Exams
* ExamLevels
* QuestionBank
* QuestionOptions
* ExamAssignments
* ExamSessions
* EmployeeAnswers
* Results
* Certificates

## Proctoring Tables

* ProctorEvents
* CameraLogs
* AudioLogs
* ScreenLogs
* FaceDetectionLogs
* ViolationLogs
* DeviceInformation
* BrowserInformation
* NetworkLogs

## Audit Tables

* AuditLogs
* LoginHistory
* ActivityHistory

---

# 15. Reports

* Employee Report
* Department Report
* Level-wise Report
* Pass/Fail Report
* Average Score Report
* Question Analysis
* Difficulty Analysis
* Violation Report
* AI Detection Report
* Attendance Report
* Certificate Report

---

# 16. Notifications

* Exam Assigned
* Exam Reminder
* Exam Started
* Time Remaining Alerts
* Violation Warning
* Exam Submitted
* Result Published
* Certificate Available

---

# 17. Security Features

* JWT Authentication
* Role-Based Access Control (RBAC)
* Password Encryption
* HTTPS/TLS
* API Authorization
* Session Timeout
* CSRF Protection
* XSS Protection
* SQL Injection Prevention
* Secure File Upload
* Audit Logging

---

# 18. Suggested Development Phases

## Phase 1 – Foundation

* Authentication and authorization
* User and role management
* Employee and admin dashboards
* Basic exam creation and assignment
* Question bank management

## Phase 2 – Exam Engine

* Timed exams
* Multiple question types
* Autosave
* Review and submit
* Result calculation
* Level progression (0 → 1 → 2)

## Phase 3 – Proctoring

* Webcam and microphone access
* Fullscreen enforcement
* Tab switching detection
* Screen sharing
* Violation logging
* Live monitoring dashboard

## Phase 4 – Advanced Monitoring

* Video and audio recording
* Face detection
* AI-based behavior analysis
* Screen recording
* Device and network monitoring

## Phase 5 – Reporting & Analytics

* Reports and dashboards
* Certificates
* Notifications
* Audit logs
* Export to PDF/Excel
* Performance analytics

This structure provides a complete roadmap for developing an enterprise-grade employee examination portal, with clear separation of features into phases, support for three exam levels, and scalable architecture for future enhancements.
