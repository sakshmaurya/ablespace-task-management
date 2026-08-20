# AbleSpace Task Management

A full-stack task management system built as part of the **Full Stack Developer (Fresher) Technical Assessment**.

The application demonstrates frontend and backend development using **Next.js, TypeScript, Tailwind CSS, NestJS, and MongoDB**, with a focus on responsive design, reusable components, authentication, CRUD workflows, theme support, API architecture, validation, authorization, and maintainability.

---

## Live Demo

> **Frontend:** `https://YOUR-FRONTEND-URL`

> **Backend API:** `https://YOUR-BACKEND-URL`

> Replace the placeholders above with the deployed URLs before submission.

The deployed application should remain accessible for the required assessment review period.

---

# Assessment Overview

This project was developed according to the provided technical assessment, which consists of two parts.

### Part 1 — Task Management System

Implementation of a responsive task management application based on the provided Figma design, including:

* Task and project management
* Authentication and guest login
* Theme switching and persistence
* Reusable UI components
* Responsive layouts
* Backend REST APIs
* MongoDB persistence
* Validation and authorization
* Interactive task workflows

### Part 2 — Product Understanding

Exploration and documentation of the **AbleSpace Caseload → Take Data** workflow.

The documentation explains the observed workflow, screenshots, UX/UI observations, and suggested improvements.

See:

`PART_2_DOCUMENTATION.md`

---

# Part 1 — Task Management System

## Core Features

### Task Management

* Kanban board with task columns
* List/table view
* Create, read, update, and delete tasks
* Task status management
* Task priority management
* Task assignment
* Task search
* Task filtering
* Task details
* Subtasks
* Comments
* Activity history
* Drag-and-drop task management

### Project Management

* Create projects
* View projects
* Update projects
* Delete projects
* Project details
* Project lead assignment
* Project priority management
* Related task management

### Authentication

* JWT-based authentication
* Regular user login
* Guest login
* Protected API routes
* Authenticated frontend flows
* User-specific data access

### Profile Management

* Edit profile information
* Avatar upload
* Avatar preview
* Avatar removal
* Persistent avatar data
* Avatar updates across application components

### Theme System

The application supports persistent theme customization.

* Light mode
* Dark mode
* Persistent theme selection
* Persistent accent color selection
* CSS-variable-based theming
* Theme applied consistently across pages

Available accent colors:

* Amber
* Blue
* Pink
* Rose
* Emerald
* Black

### Responsive Design

The application is designed to work across:

* Mobile devices
* Tablets
* Laptops
* Desktop screens

Responsive behavior includes:

* Mobile navigation drawer
* Overlay navigation
* Responsive forms
* Responsive modals
* Touch-friendly controls
* Responsive task layouts
* Responsive tables
* Adaptive spacing and typography

---

# Design & UI Implementation

The frontend was implemented with the provided assessment design as the primary visual reference.

Attention was given to:

* Layout structure
* Typography
* Spacing
* Component hierarchy
* Colors
* Borders
* Buttons
* Form controls
* Cards
* Navigation
* Theme behavior
* Responsive behavior
* Interactive states
* Loading states
* Empty states
* Error states
* Micro-interactions

Where implementation details required adaptation for a web-based responsive application, the behavior was adjusted while preserving the overall design intent and user experience.

Any intentional visual or functional deviations should be documented here before final submission.

---

# Reusable Component System

The frontend contains reusable UI components to reduce duplication and maintain consistency.

Examples include:

```text
frontend/components/ui/
├── Button.tsx
├── Input.tsx
├── Select.tsx
└── Textarea.tsx
```

Reusable application components include:

```text
frontend/components/
├── layout/
├── projects/
├── providers/
├── tasks/
└── ui/
```

This structure allows common interaction patterns and styles to be maintained centrally.

---

# Frontend Architecture

```text
frontend/
├── app/
│   ├── login/
│   ├── tasks/
│   ├── projects/
│   ├── profile/
│   ├── settings/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── layout/
│   ├── projects/
│   ├── providers/
│   ├── tasks/
│   └── ui/
│
├── hooks/
│   └── useAuth.tsx
│
├── services/
│   ├── authService.ts
│   ├── commentService.ts
│   ├── projectService.ts
│   ├── settingsService.ts
│   ├── taskService.ts
│   └── userService.ts
│
├── types/
├── lib/
└── public/
```

The frontend uses the Next.js App Router and separates pages, reusable components, service/API logic, hooks, and shared types.

---

# Backend Architecture

The backend is implemented using NestJS with a modular architecture.

```text
backend/src/
├── auth/
├── users/
├── tasks/
├── projects/
├── comments/
├── settings/
├── database/
├── common/
├── app.module.ts
├── main.ts
└── seed.ts
```

Each major domain is organized into its own NestJS module containing controllers, services, DTOs, and schemas where appropriate.

---

# Technology Stack

## Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* next-themes
* @dnd-kit
* date-fns
* lucide-react

## Backend

* NestJS 11
* TypeScript
* Mongoose
* MongoDB
* JWT
* bcrypt
* class-validator
* Swagger

## Development Tools

* Git
* GitHub
* npm
* ESLint

---

# API Endpoints

## Authentication

```text
POST /auth/guest
POST /auth/login
GET  /auth/me
```

## Users

```text
GET   /users/me
PATCH /users/me
POST  /users/me/avatar
```

## Tasks

```text
GET    /tasks
POST   /tasks
GET    /tasks/:id
PATCH  /tasks/:id
DELETE /tasks/:id

PATCH /tasks/:id/status
PATCH /tasks/:id/priority

GET    /tasks/:taskId/subtasks
POST   /tasks/:taskId/subtasks
PATCH  /tasks/subtasks/:id
DELETE /tasks/subtasks/:id

GET /tasks/:taskId/activity
```

## Projects

```text
GET    /projects
POST   /projects
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id
```

## Comments

```text
GET    /comments/tasks/:taskId
POST   /comments/tasks/:taskId
DELETE /comments/:id
```

## Settings

```text
GET   /settings
PATCH /settings
```

If Swagger is enabled in the deployed backend, the API documentation is available through the configured Swagger endpoint.

---

# Validation & Authorization

The backend uses DTO-based validation and authenticated API access.

Authorization checks are applied to protected resources so that users cannot freely access or modify another user's data.

Examples include:

* Task access based on the user's relationship to the task
* Project access based on ownership or project lead assignment
* Comment deletion restricted to the comment author
* Protected task operations
* Protected project operations
* JWT authentication for protected routes

The application also uses environment variables for sensitive configuration such as database credentials and JWT secrets.

---

# Database

MongoDB is used as the application's primary database.

Main data models include:

```text
users
tasks
projects
subtasks
comments
activities
settings
```

## Seed Data

The backend includes seed data for development and assessment demonstration.

The seed data includes:

* Users
* Projects
* Tasks
* Subtasks
* Comments
* Activity records

Run:

```bash
cd backend
npm run seed
```

The seed operation is designed to be safe to run repeatedly.

---

# Environment Variables

## Backend

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/TaskManager
JWT_SECRET=your_secure_secret
FRONTEND_URL=http://localhost:3000
```

## Frontend

Create:

```text
frontend/.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Never commit real credentials, database URLs, JWT secrets, or other sensitive values.

---

# Local Development

## Prerequisites

* Node.js 18+
* npm
* MongoDB Atlas account or local MongoDB instance

---

## Backend Setup

```bash
cd backend
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Update the environment variables and start the development server:

```bash
npm run start:dev
```

For a production build:

```bash
npm run build
npm run start:prod
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create the local environment file:

```bash
cp env.example .env.local
```

Update the API URL and start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

# Authentication

## Guest Login

The application provides a guest login flow so the task management interface can be explored without creating a separate account.

Guest access is intended for assessment/demo purposes.

## Regular Authentication

Regular authentication uses:

* JWT
* Password hashing
* Protected backend routes
* Authenticated frontend requests

---

# Profile & Avatar

The profile section provides:

* Profile editing
* Avatar upload
* Avatar preview
* Avatar removal
* Persistent avatar data

For the assessment implementation, avatar data is stored as a base64 representation in MongoDB.

For a production application at larger scale, object storage such as S3 or another dedicated media-storage service would be more appropriate.

---

# Theme Settings

Theme preferences are persisted across sessions.

The settings system supports:

```text
Theme
├── Light
└── Dark

Accent
├── Amber
├── Blue
├── Pink
├── Rose
├── Emerald
└── Black
```

The selected preferences are applied consistently throughout the application.

---

# Responsive Design

The application was tested across multiple viewport sizes, including:

```text
320px
375px
414px
768px
1024px
1280px
1440px
```

Responsive behavior includes:

* Collapsible mobile sidebar
* Navigation overlay
* Stacked forms
* Responsive modals
* Adaptive task layouts
* Touch-friendly controls
* Responsive tables
* Mobile-friendly spacing

---

# Part 2 — AbleSpace Product Understanding

Part 2 of the assessment required exploration of the **AbleSpace → Caseload → Take Data** workflow.

The exploration covered:

```text
Caseload
   ↓
Select Student
   ↓
Take Data
   ↓
Select IEP Goal
   ↓
Capture Data
   ↓
Review Data
   ├── Graph
   ├── Stats
   └── Info
```

The submitted documentation explains:

* Product context
* Navigation flow
* Take Data screen
* Data capture interaction
* Trial navigation
* Graph view
* Stats view
* Info view
* UX/UI strengths
* UX/UI improvement opportunities
* Functional improvements
* Accessibility considerations
* Responsive design considerations

Supporting screenshots were captured during the product exploration.

See:

```text
PART_2_DOCUMENTATION.md
```

Screenshots:

```text
docs/part2/
├── 01-caseload.png
├── 02-take-data-initial.png
├── 03-take-data-capture.png
├── 04-graph.png
├── 05-stats.png
└── 06-info.png
```

---

# Git & Development Practices

The repository uses multiple small, meaningful commits to document development progress.

Examples include:

```text
feat: improve project management workflows
feat: add profile editing and avatar management
feat: add persistent theme and accent settings
feat: add reusable form input components
fix: resolve AppLayout authentication hook order
feat: polish responsive UI and micro-interactions
docs: add assessment documentation and setup guide
docs: complete AbleSpace Take Data analysis
```

This commit structure makes the development history easier to review and understand.

---

# Security Considerations

The application includes several security-oriented practices:

* JWT authentication
* Password hashing
* Protected API routes
* User-level authorization checks
* User data isolation
* Environment-based secrets
* MongoDB credentials excluded from source control
* DTO validation
* Ownership checks for protected resources

### Assessment Limitations

The following are intentionally outside the scope of this assessment implementation:

* Production-grade rate limiting
* Full role-based access control
* External object storage for avatars
* Real-time collaboration
* Enterprise-scale monitoring

These would be considered for a production deployment depending on application requirements.

---

# Known Limitations

* Guest login intentionally provides simplified access for assessment/demo purposes.
* Avatar images are stored as base64 data for the assessment implementation.
* Real-time collaborative updates are not implemented.
* Production-grade rate limiting is not included.
* Google OAuth is not required for this assessment and is not implemented.
* The application uses MongoDB as the selected database implementation.

---

# Testing & Verification

Manual testing was performed across the major application workflows, including:

* Guest login
* Authentication
* Task creation
* Task editing
* Task deletion
* Task status changes
* Task priority changes
* Drag-and-drop
* Subtasks
* Comments
* Activity history
* Project management
* Profile editing
* Avatar upload
* Theme switching
* Accent color switching
* Responsive navigation
* Mobile layouts
* Empty states
* Loading states
* Error handling

Before final submission, the deployed frontend and backend should also be tested using production URLs.

---

# Build Commands

## Frontend

```bash
cd frontend
npm run build
npm run start
```

## Backend

```bash
cd backend
npm run build
npm run start:prod
```

---

# Assessment Submission Checklist

Before submitting the repository, verify:

* [ ] GitHub repository is public
* [ ] Frontend is deployed and accessible
* [ ] Backend is deployed and accessible
* [ ] Frontend can communicate with the production backend
* [ ] MongoDB production connection works
* [ ] Guest login works
* [ ] Authentication works
* [ ] Task CRUD works
* [ ] Project CRUD works
* [ ] Comments work
* [ ] Subtasks work
* [ ] Theme persistence works
* [ ] Accent color persistence works
* [ ] Responsive layouts work
* [ ] README is complete
* [ ] Part 2 documentation is included
* [ ] Part 2 screenshots are included
* [ ] No secrets are committed
* [ ] Git history contains meaningful commits
* [ ] Production build succeeds

---

# Project Structure

```text
ablespace-task-manager/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── tasks/
│   │   ├── projects/
│   │   ├── comments/
│   │   ├── settings/
│   │   ├── database/
│   │   ├── common/
│   │   ├── main.ts
│   │   └── seed.ts
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── docs/
│   └── part2/
│
├── PART_2_DOCUMENTATION.md
├── RUN_COMMANDS.md
├── README.md
└── .gitignore
```

---

# Conclusion

This project demonstrates a complete full-stack task management workflow with a modern Next.js frontend and modular NestJS backend.

The implementation focuses on the assessment's primary evaluation areas:

* Attention to detail
* Frontend engineering
* Backend engineering
* Component reusability
* Architecture
* Code quality
* Responsiveness
* Authentication
* Validation
* Authorization
* Product thinking
* Maintainability
* Technical communication

Part 2 additionally demonstrates the ability to explore an existing product, understand a user workflow, identify UX/UI opportunities, and communicate those findings through structured documentation and screenshots.

---

## Assessment

**Assessment:** Full Stack Developer (Fresher) – Technical Assessment

**Part 1:** Task Management System

**Part 2:** AbleSpace Take Data Product Understanding

**Status:** Ready for final verification and deployment

---

## License

This project was created for technical assessment purposes.
