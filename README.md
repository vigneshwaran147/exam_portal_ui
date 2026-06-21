# Employee Examination Portal (React)

React 18 + TypeScript starter application for an employee exam portal with level-based assessments (Level 0 -> Level 2), basic routing, UI shell, and API service placeholders.

## Stack

- React 18
- TypeScript
- Vite
- MUI
- Redux Toolkit
- React Router
- Axios
- Socket.IO client

## Getting Started

Dependency installation is intentionally not run by this scaffold.

1. Install dependencies manually:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Start dev server:

```bash
npm run dev
```

## Current Routes

- /login
- /dashboard
- /exam/instructions
- /exam/session
- /result
- /certificate
- /history
- /admin/dashboard

## Folder Layout

- src/api
- src/components/common
- src/components/layout
- src/hooks
- src/pages
- src/redux
- src/routes
- src/services
- src/styles
- src/types

## Notes

- API endpoints map to your Spring Boot backend placeholders.
- Proctoring socket connection scaffolding is included in `src/services/proctoringService.ts`.
- Replace static dashboard/exam data with backend integration as needed.

## Proctoring Config

- `VITE_REQUIRE_SCREEN_SHARE=true|false`: Enforce screen share during exam.
- `VITE_REQUIRE_ENTIRE_SCREEN=true|false`: When screen share is enabled, require selecting the entire display (monitor).

Important browser constraint:

- Browsers do not allow bypassing screen share permission prompts. Users must explicitly grant permission.
