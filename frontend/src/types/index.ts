export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  requestedRole?: string | null;
  phone?: string | null;
  avatar?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: "PLANNED" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
  budget?: number | null;
  progress?: number | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Expense {
  id: string;
  projectId: string;
  amount: number;
  category: string;
  description?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
}

export interface ReportItem {
  id: string;
  projectId: string;
  type: "PROJECT_SUMMARY" | "FINANCIAL" | "ATTENDANCE" | "PROGRESS";
  createdAt?: string;
}

export interface WorkerItem {
  id: string;
  projectId: string;
  firstName: string;
  lastName: string;
  trade?: string | null;
  phone?: string | null;
  dailyRate?: number | null;
}

export interface AttendanceItem {
  id: string;
  projectId: string;
  workerId: string;
  date: string;
  present?: boolean | null;
  notes?: string | null;
}

export interface PhaseItem {
  id: string;
  projectId: string;
  name: string;
  order: number;
  startDate?: string | null;
  endDate?: string | null;
}

export interface LotItem {
  id: string;
  phaseId: string;
  name: string;
  description?: string | null;
  order: number;
  startDate?: string | null;
  endDate?: string | null;
}

export interface TaskItem {
  id: string;
  lotId: string;
  name: string;
  description?: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
  progress?: number | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  assignedWorkerId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface PhotoItem {
  id: string;
  projectId: string;
  taskId?: string | null;
  url: string;
  caption?: string | null;
  createdAt?: string;
}

export interface ApiPaginatedResponse<T> {
  items: T;
  meta: { page: number; limit: number; total: number };
}
