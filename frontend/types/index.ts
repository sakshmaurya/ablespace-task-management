export enum TaskStatus {
  TODO = 'TODO',
  DOING = 'DOING',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export enum Priority {
  NONE = 'NONE',
  URGENT = 'URGENT',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum AccentColor {
  AMBER = 'AMBER',
  BLUE = 'BLUE',
  PINK = 'PINK',
  ROSE = 'ROSE',
  EMERALD = 'EMERALD',
  BLACK = 'BLACK',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  username: string;
  isGuest: boolean;
  theme: Theme;
  accentColor: AccentColor;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  priority: Priority;
  lead?: User;
  dueDate?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  projectId?: Project;
  members: User[];
  labels: string[];
  dueDate?: string;
  reporter?: User;
  resources: string[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  _id: string;
  taskId: string;
  title: string;
  priority: Priority;
  members: User[];
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  taskId: string;
  userId: User;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  taskId: string;
  userId: User;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Settings {
  theme: Theme;
  accentColor: AccentColor;
}
