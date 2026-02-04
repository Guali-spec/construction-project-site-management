// Types pour l'authentification
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
    isActive: boolean;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  // Types pour les chantiers (projets)
  export interface Project {
    id: number;
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    status: 'planned' | 'active' | 'completed' | 'cancelled';
    budget: number;
    createdAt: string;
  }
  
  // Types pour la réponse API standard
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
  }