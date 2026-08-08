# AbleSpace Task Manager

A full-stack task management system built with Next.js, NestJS, and MongoDB.

## Project Overview

AbleSpace Task Manager is a comprehensive task management application that provides teams with tools to organize, track, and collaborate on projects efficiently. The application features a modern UI with drag-and-drop task boards, real-time updates, and customizable themes.

## Features

- **Authentication System**
  - Guest login for quick access
  - JWT-based authentication
  - User profile management

- **Task Management**
  - Kanban board view with drag-and-drop
  - List/table view
  - Task creation, editing, and deletion
  - Status management (To Do, Doing, Completed, On Hold)
  - Priority levels (Urgent, High, Medium, Low, None)
  - Due date tracking
  - Labels and tags
  - Team member assignment

- **Project Management**
  - Project creation and management
  - Project lead assignment
  - Priority levels
  - Due date tracking

- **Task Details**
  - Detailed task view
  - Subtasks with completion tracking
  - Comments and discussions
  - Activity log/updates
  - Resource attachments

- **User Experience**
  - Light/Dark theme switching
  - Customizable accent colors (Amber, Blue, Pink, Rose, Emerald, Black)
  - Theme persistence across sessions
  - Responsive design (mobile, tablet, desktop)
  - Loading states and error handling

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **next-themes** - Theme management
- **lucide-react** - Icon library
- **@dnd-kit** - Drag and drop functionality
- **date-fns** - Date manipulation
- **React Hooks** - State management

### Backend
- **NestJS 11** - Node.js framework
- **TypeScript** - Type-safe development
- **Mongoose** - MongoDB ODM
- **MongoDB** - NoSQL database
- **@nestjs/jwt** - JWT authentication
- **bcrypt** - Password hashing
- **class-validator** - Input validation
- **class-transformer** - Data transformation
- **Swagger** - API documentation
- **ConfigModule** - Configuration management
- **CORS** - Cross-origin resource sharing

## Architecture

The application follows a clean architecture pattern with separation of concerns:

### Frontend Architecture
- **Components**: Reusable UI components organized by feature
- **Services**: API client and service modules for backend communication
- **Hooks**: Custom React hooks for state management
- **Types**: TypeScript interfaces and enums
- **Lib**: Utility functions and configurations

### Backend Architecture
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic implementation
- **DTOs**: Data transfer objects with validation
- **Schemas**: Mongoose schemas for database models
- **Guards**: Authentication and authorization
- **Modules**: Feature-based module organization

## Folder Structure

```
ablespace-task-manager/
├── frontend/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Login page
│   │   ├── tasks/             # Tasks pages
│   │   ├── projects/          # Projects pages
│   │   ├── profile/           # User profile
│   │   ├── settings/          # Settings page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   ├── tasks/             # Task-related components
│   │   ├── projects/          # Project-related components
│   │   └── providers/         # Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── services/              # API services
│   ├── types/                 # TypeScript types
│   ├── public/                # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.ts
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # Users module
│   │   ├── tasks/             # Tasks module
│   │   ├── projects/          # Projects module
│   │   ├── comments/          # Comments module
│   │   ├── settings/          # Settings module
│   │   ├── common/            # Shared utilities
│   │   │   ├── guards/        # Auth guards
│   │   │   └── enums.ts       # Shared enums
│   │   ├── database/          # Database configuration
│   │   ├── app.module.ts      # Root module
│   │   ├── main.ts            # Application entry point
│   │   └── seed.ts            # Database seeding
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
├── README.md
└── .gitignore
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ablespace_task_manager
JWT_SECRET=change_me_to_secure_random_string
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Local Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### MongoDB Setup

1. Install MongoDB:
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install mongodb

   # On macOS
   brew install mongodb-community

   # On Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. Start MongoDB:
   ```bash
   # On Linux/macOS
   sudo systemctl start mongodb
   # or
   mongod

   # On Windows
   # Start MongoDB service from Services
   ```

3. Verify MongoDB is running:
   ```bash
   mongosh
   # or
   mongo
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ablespace_task_manager
   JWT_SECRET=your_secure_random_string_here
   FRONTEND_URL=http://localhost:3000
   ```

5. Build the application:
   ```bash
   npm run build
   ```

6. Start the backend server:
   ```bash
   npm run start:dev
   # or for production
   npm run start:prod
   ```

7. Seed the database (optional):
   ```bash
   npm run seed
   ```

8. Access API documentation:
   ```
   http://localhost:5000/api
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env.local
   ```

4. Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   npm run start
   ```

7. Access the application:
   ```
   http://localhost:3000
   ```

## Running the Application

### Development Mode

1. Start MongoDB
2. Start backend server (in one terminal):
   ```bash
   cd backend
   npm run start:dev
   ```

3. Start frontend server (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

### Production Mode

1. Start MongoDB
2. Build and start backend:
   ```bash
   cd backend
   npm run build
   npm run start:prod
   ```

3. Build and start frontend:
   ```bash
   cd frontend
   npm run build
   npm run start
   ```

## API Documentation

The backend includes Swagger API documentation. Once the backend is running, access:

```
http://localhost:5000/api
```

### Main API Endpoints

#### Authentication
- `POST /auth/guest` - Create guest user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

#### Tasks
- `GET /tasks` - Get all tasks with filters
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create new task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PATCH /tasks/:id/status` - Update task status
- `PATCH /tasks/:id/priority` - Update task priority
- `GET /tasks/:taskId/subtasks` - Get task subtasks
- `POST /tasks/:taskId/subtasks` - Create subtask
- `PATCH /tasks/subtasks/:id` - Update subtask
- `DELETE /tasks/subtasks/:id` - Delete subtask
- `GET /tasks/:taskId/activity` - Get task activity

#### Projects
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `POST /projects` - Create new project
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

#### Comments
- `GET /comments/tasks/:taskId` - Get task comments
- `POST /comments/tasks/:taskId` - Create comment
- `DELETE /comments/:id` - Delete comment

#### Users
- `GET /users/me` - Get current user
- `PATCH /users/me` - Update current user

#### Settings
- `GET /settings` - Get user settings
- `PATCH /settings` - Update user settings

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Guest Login**: Users can quickly access the application as a guest without providing credentials
2. **Regular Login**: Users can log in with email and password (requires account creation)
3. **Token Storage**: JWT tokens are stored in localStorage
4. **Token Refresh**: Tokens are valid for 7 days
5. **Protected Routes**: All application routes (except login) require authentication

## Theme System

The application supports two themes:

### Light/Dark Theme
- Uses `next-themes` for theme management
- Theme preference is persisted in localStorage
- Theme is also stored in the user's profile in the database
- Prevents flash of incorrect theme on page load

### Accent Colors
Six accent color options are available:
- Amber
- Blue (default)
- Pink
- Rose
- Emerald
- Black

Accent colors are applied using CSS variables and can be changed in the Settings page. The preference is persisted both locally and in the database.

## Responsive Design

The application is fully responsive and works on:

- **Mobile** (320px - 480px): Collapsible sidebar, stacked layouts
- **Tablet** (481px - 1024px): Adaptive layouts, touch-friendly
- **Desktop** (1025px+): Full functionality with fixed sidebar

Key responsive features:
- Mobile sidebar becomes a drawer/menu
- Tables support horizontal scrolling
- Board view supports horizontal scrolling
- Dialogs fit within viewport
- Touch-friendly button sizes

## Design Decisions

### Technology Choices
- **Next.js App Router**: Modern React framework with built-in routing and optimization
- **NestJS**: Structured Node.js framework with excellent TypeScript support
- **MongoDB**: Flexible NoSQL database suitable for task management data
- **Tailwind CSS**: Utility-first CSS for rapid UI development
- **@dnd-kit**: Modern drag-and-drop library with excellent accessibility

### Architecture Decisions
- **Service Layer Pattern**: Business logic separated from controllers
- **DTOs with Validation**: Input validation using class-validator
- **JWT Authentication**: Stateless authentication with tokens
- **Component-based UI**: Reusable components for maintainability
- **Custom Hooks**: Encapsulated state management logic

### Intentional Figma Deviations
- Google OAuth is not fully implemented (shown as demo action)
- Some minor spacing adjustments for better responsiveness
- Simplified some complex animations for performance

## Future Improvements

- [ ] Implement real Google OAuth authentication
- [ ] Add real-time updates using WebSockets
- [ ] Implement file attachments for tasks
- [ ] Add advanced search with filters
- [ ] Implement task templates
- [ ] Add project templates
- [ ] Implement team management features
- [ ] Add email notifications
- [ ] Implement task dependencies
- [ ] Add Gantt chart view for projects
- [ ] Implement time tracking
- [ ] Add reporting and analytics
- [ ] Implement keyboard shortcuts
- [ ] Add bulk operations for tasks
- [ ] Implement task archiving
- [ ] Add export/import functionality

## Contributing

This is a technical assessment project. For production use, consider:

1. Adding comprehensive error handling
2. Implementing rate limiting
3. Adding comprehensive logging
4. Implementing caching strategies
5. Adding automated testing
6. Setting up CI/CD pipeline
7. Adding monitoring and alerting
8. Implementing backup strategies

## License

This project is created for technical assessment purposes.

## Live Demo

[To be added]

## GitHub Repository

[To be added]
