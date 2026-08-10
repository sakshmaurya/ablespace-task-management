# AbleSpace Task Management

## Overview
A full-stack task management system built with Next.js, NestJS, and MongoDB for assessment submission.

## Assessment Requirements
This project demonstrates proficiency in:
- Full-stack development with modern frameworks
- MongoDB persistence with real data operations
- Responsive design across all screen sizes
- Theme management (Light/Dark + accent colors)
- Profile image/avatar functionality
- Comprehensive CRUD operations
- Authentication and authorization
- Production-ready code quality

## Features

### Task Management
- **Kanban Board**: Drag-and-drop task management with 4 columns (To Do, Doing, Completed, On Hold)
- **List View**: Table-based task view with full functionality
- **Task CRUD**: Create, read, update, delete tasks with real MongoDB persistence
- **Task Details**: Comprehensive task detail page with subtasks, comments, and activity tracking
- **Search**: Real-time search across task titles, descriptions, and labels
- **Filters**: Filter by status, priority, assignee, and project
- **Subtasks**: Complete subtask management with completion tracking
- **Comments**: Threaded comment system for task discussions
- **Activity**: Activity log tracking all task changes

### Project Management
- **Project CRUD**: Create, read, update, delete projects
- **Project Details**: View project information and related tasks
- **Lead Assignment**: Assign project leads with user selection
- **Priority Management**: Project priority levels

### User Management
- **Authentication**: JWT-based authentication with guest login
- **Profile Management**: Edit user profile information
- **Avatar Upload**: Functional profile image upload with base64 storage
- **Theme Settings**: Light/Dark theme switching with persistence
- **Accent Colors**: 6 customizable accent colors (Amber, Blue, Pink, Rose, Emerald, Black)

### User Experience
- **Responsive Design**: Mobile-first design with drawer navigation
- **Loading States**: Skeleton loaders and loading indicators
- **Error States**: User-friendly error messages and error boundaries
- **Empty States**: Guiding empty states for no data scenarios
- **Transitions**: Subtle animations for better UX

## Tech Stack

### Frontend
- **Next.js 16.3.0**: React framework with App Router
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **next-themes**: Theme management
- **@dnd-kit**: Drag and drop functionality
- **date-fns**: Date manipulation
- **lucide-react**: Icon library

### Backend
- **NestJS 11**: Node.js framework
- **TypeScript 5**: Type-safe development
- **Mongoose 9**: MongoDB ODM
- **MongoDB Atlas**: Cloud NoSQL database
- **@nestjs/jwt**: JWT authentication
- **bcrypt**: Password hashing
- **class-validator**: Input validation
- **Swagger**: API documentation

## Architecture

### Frontend Structure
```
frontend/
├── app/                    # Next.js App Router
│   ├── login/             # Authentication page
│   ├── tasks/             # Task management pages
│   ├── projects/          # Project management pages
│   ├── profile/           # User profile with avatar upload
│   ├── settings/          # Theme and accent color settings
│   └── layout.tsx         # Root layout with providers
├── components/
│   ├── layout/            # Sidebar, Header, AppLayout
│   ├── tasks/             # TaskBoard, TaskCard, TaskList, CreateTaskModal
│   ├── projects/          # Project components
│   ├── ui/                # Button, Input components
│   └── providers/         # ThemeProvider
├── hooks/                 # useAuth custom hook
├── services/              # API service layer
├── types/                 # TypeScript interfaces
└── lib/                   # Utilities
```

### Backend Structure
```
backend/src/
├── auth/                  # Authentication module
├── users/                 # User management
├── tasks/                 # Task management
├── projects/              # Project management
├── comments/              # Comment system
├── settings/              # Settings management
├── common/                # Guards, enums
├── database/              # MongoDB configuration
└── seed.ts                # Database seeding
```

## API Endpoints

### Authentication
- `POST /auth/guest` - Guest login
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Users
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update user profile
- `POST /users/me/avatar` - Update user avatar

### Tasks
- `GET /tasks` - Get all tasks with optional filters
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get task by ID
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PATCH /tasks/:id/status` - Update task status
- `PATCH /tasks/:id/priority` - Update task priority
- `GET /tasks/:taskId/subtasks` - Get task subtasks
- `POST /tasks/:taskId/subtasks` - Create subtask
- `PATCH /tasks/subtasks/:id` - Update subtask
- `DELETE /tasks/subtasks/:id` - Delete subtask
- `GET /tasks/:taskId/activity` - Get task activity log

### Projects
- `GET /projects` - Get all projects
- `POST /projects` - Create project
- `GET /projects/:id` - Get project by ID
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Comments
- `GET /comments/tasks/:taskId` - Get task comments
- `POST /comments/tasks/:taskId` - Create comment
- `DELETE /comments/:id` - Delete comment

### Settings
- `GET /settings` - Get user settings
- `PATCH /settings` - Update user settings

## MongoDB

### Database Collections
- **users**: User profiles with avatar storage
- **tasks**: Tasks with status, priority, members, labels
- **projects**: Projects with leads and due dates
- **subtasks**: Subtasks with completion tracking
- **comments**: Comments for task discussions
- **activities**: Activity log for task changes

### Seed Data
The application includes comprehensive seed data:
- 3 users with different roles
- 3 projects with various priorities
- 8 tasks across different statuses
- 5 subtasks
- 5 comments
- Full activity tracking

Run seed: `npm run seed` (idempotent - safe to run multiple times)

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/TaskManager
JWT_SECRET=your_secure_random_string
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB account (Atlas or local)
- npm

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run build
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp env.example .env.local
# Update .env.local with your API URL
npm run dev
```

### Database Seeding
```bash
cd backend
npm run seed
```

## Authentication

### Guest Login
Users can access the application without credentials using guest login. Guest users have full functionality for assessment purposes.

### Google OAuth
Google OAuth is not implemented in this assessment. The application uses guest login and regular user authentication with JWT tokens.

## Security Notes

### Authentication & Authorization
- **JWT-based Authentication**: All protected routes require valid JWT tokens
- **User Data Isolation**: Critical security feature implemented
  - Users can only access tasks where they are creator, member, or reporter
  - Users can only access projects where they are creator or lead
  - Users can only delete their own comments
  - All CRUD operations verify user authorization before execution
- **API Protection**: All API endpoints require authentication via JwtAuthGuard
- **MongoDB Security**: Connection uses MongoDB Atlas with secure connection strings

### Environment Security
- **.env files ignored**: All environment files are in .gitignore
- **No secrets committed**: No passwords, API keys, or secrets in source code
- **.env.example**: Contains only variable names, no actual values
- **JWT Secret**: Must be changed in production (uses development secret for assessment)

### Security Implementation Details
- Backend services verify user ownership before data access
- MongoDB queries scoped to authenticated user's data
- 404/403 errors returned for unauthorized access (no data leakage)
- Comment deletion restricted to comment author only
- Task status changes require authorization
- Project modifications require authorization

### Known Security Limitations
- Guest login provides full access (acceptable for assessment purposes)
- No role-based access control beyond basic ownership
- No rate limiting implemented
- No input sanitization beyond DTO validation

## Profile Image Upload

### Implementation
- Avatar images are stored as base64 strings in MongoDB
- File validation: Image files only, max 2MB
- Preview before saving
- Remove avatar functionality
- Avatar persists across sessions
- Updates in real-time across all components (sidebar, header, task cards)

### Usage
1. Navigate to Profile page
2. Click on avatar to upload new image
3. Preview the image
4. Click "Save Avatar" to persist
5. Avatar updates immediately in all components

## Settings

### Theme Switching
- Light/Dark mode toggle
- Theme persists across sessions
- Applied to all components and pages
- Uses CSS variables for consistent theming

### Accent Colors
- 6 accent color options: Amber, Blue, Pink, Rose, Emerald, Black
- Color persists across sessions
- Applied to buttons, links, active states
- Different colors for light and dark modes

## Responsive Design

### Breakpoints Tested
- 320px (mobile)
- 375px (mobile)
- 414px (mobile)
- 768px (tablet)
- 1024px (desktop)
- 1280px (desktop)
- 1440px (desktop)

### Mobile Features
- Collapsible sidebar drawer with overlay
- Touch-friendly navigation
- Stacked layouts for forms
- Horizontal scroll for tables
- Responsive modals
- Accessible button sizes

## Deployment

### Production Configuration
- `.env` files are gitignored
- `.env.example` provided for setup
- Frontend API URL configurable
- CORS configured for production URLs
- MongoDB connection configurable

### Build Commands
```bash
# Frontend
cd frontend
npm run build
npm run start

# Backend
cd backend
npm run build
npm run start:prod
```

## Assessment Notes

### Design Fidelity
Since Figma access was restricted, the application follows modern UI/UX best practices with:
- Clean, professional interface
- Consistent spacing and typography
- Accessible color contrast
- Subtle animations
- Professional color palette

### Known Limitations
- Google OAuth not implemented (uses guest login instead)
- Avatar storage uses base64 (suitable for assessment, would use S3 in production)
- No real-time updates (uses manual refresh)
- Google OAuth configuration would require additional setup
- No rate limiting implemented
- No role-based permissions beyond basic ownership
- No input sanitization beyond DTO validation

### Security Implementation
- **User Data Isolation**: Critical security feature implemented
  - Users can only access tasks where they are creator, member, or reporter
  - Users can only access projects where they are creator or lead
  - Users can only delete their own comments
  - All CRUD operations verify user authorization before execution
- **API Protection**: All API endpoints require authentication via JwtAuthGuard
- **Environment Security**: .env files ignored, no secrets committed
- **MongoDB Security**: Connection uses MongoDB Atlas with secure connection strings

### Files Modified During Assessment
Multiple files were enhanced including:
- Profile page with avatar upload functionality
- Sidebar with mobile navigation drawer
- Theme system with accent colors and dark mode
- Responsive layouts across all pages and components
- API endpoints for avatar management
- Database seeding with idempotent check
- User data isolation security implementation
- Consistent form components and design system
- Enhanced save button states with loading indicators
- Comprehensive security fixes for user authorization

## Development

### Code Quality
- TypeScript strict mode
- ESLint configuration
- No console.log statements in production code
- No unused imports
- No duplicate code
- Clean component architecture

### Testing
Manual testing performed on:
- All CRUD operations
- Authentication flows
- Theme switching
- Responsive breakpoints
- Avatar upload
- Drag and drop
- All major user flows

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Theme Not Persisting
- Check localStorage is enabled
- Verify settings API is working
- Check CSS variables are applied

### Avatar Upload Failing
- Verify file size is under 2MB
- Ensure file is an image type
- Check API endpoint is accessible

## Support
For issues or questions, refer to the API documentation at `/api` when the backend is running.

## License
This project is for assessment purposes.
