# AbleSpace Task Manager - Project Run Commands

## Project Structure
```
ablespace-task-manager/
├── backend/          # NestJS Backend
└── frontend/         # Next.js Frontend
```

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- npm installed

## Initial Setup (First Time Only)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp env.example .env.local
# Edit .env.local with your API URL (usually http://localhost:5000)
```

### 3. Database Seeding (Optional but Recommended)
```bash
cd backend
npm run seed
```

## Running the Project

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
Backend will run on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:3000`

### Option 2: Production Build

**Build Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Build Frontend:**
```bash
cd frontend
npm run build
npm run start
```

## Available Commands

### Backend Commands
```bash
cd backend

# Development mode with hot reload
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Seed database with demo data
npm run seed
```

### Frontend Commands
```bash
cd frontend

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Run linter
npm run lint
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?appName=<app_name>
JWT_SECRET=your_secure_random_string
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Access the Application

Once both servers are running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api (if Swagger is enabled)

## Troubleshooting

### Port Already in Use
If you get "port already in use" error:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Issues
- Check your MongoDB URI in .env
- Ensure MongoDB Atlas allows connections from your IP
- Verify database cluster is running

### npm install Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Testing the Application

1. Open http://localhost:3000 in browser
2. Click "Continue as Guest" to login
3. Navigate through Tasks, Projects, Profile, Settings
4. Test all features: create tasks, drag-and-drop, theme switching, etc.

## Stopping the Servers

Press `Ctrl + C` in each terminal to stop the servers.