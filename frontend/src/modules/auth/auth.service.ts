import apiClient from '@/services/api-client';
import { LoginCredentials, AuthResponse, User, ApiResponse } from '@/types';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** Service d'authentification connecté au backend */
class AuthService {
  private isBrowser() {
    return typeof window !== 'undefined';
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Appel API backend - le backend retourne { accessToken, refreshToken }
      const response = await apiClient.post('/auth/login', credentials);
      
      const data = response.data;
      const token = data.accessToken || data.token;

      if (!token) {
        throw new Error('Réponse API invalide : token manquant');
      }

      // Sauvegarder le token pour pouvoir récupérer l'utilisateur
      if (this.isBrowser()) {
        localStorage.setItem('auth_token', token);
        if (data.refreshToken) {
          localStorage.setItem('refresh_token', data.refreshToken);
        }
        document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      }

      // Récupérer les informations de l'utilisateur via /auth/me
      const userResponse = await apiClient.get('/auth/me');
      const user = userResponse.data;

      if (!user) {
        throw new Error('Impossible de récupérer les informations utilisateur');
      }

      // Sauvegarder l'utilisateur
      if (this.isBrowser()) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return { token, user };
    } catch (error: any) {
      // Gérer les erreurs de l'API
      let errorMessage = 'Erreur de connexion';
      
      if (!error.response) {
        // Erreur réseau (pas de réponse du serveur)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.message?.includes('fetch') || error.code === 'ERR_NETWORK') {
          errorMessage = `Impossible de se connecter au serveur backend (${apiUrl}). Vérifiez que le backend est démarré et accessible.`;
        } else {
          errorMessage = error.message || `Erreur réseau : Impossible de joindre le serveur (${apiUrl})`;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async register(data: RegisterData): Promise<void> {
    try {
      const response = await apiClient.post('/auth/register', data);
      // L'inscription réussie ne retourne pas de token
      return response.data;
    } catch (error: any) {
      let errorMessage = 'Erreur lors de l\'inscription';
      
      if (!error.response) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.message?.includes('fetch') || error.code === 'ERR_NETWORK') {
          errorMessage = `Impossible de se connecter au serveur backend (${apiUrl}). Vérifiez que le backend est démarré et accessible.`;
        } else {
          errorMessage = error.message || `Erreur réseau : Impossible de joindre le serveur (${apiUrl})`;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      document.cookie = 'auth_token=; path=/; max-age=0';
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.isBrowser()) return null;
    
    // Essayer de récupérer depuis le localStorage d'abord
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        // Si le parsing échoue, on récupère depuis l'API
      }
    }

    // Si pas de token, retourner null
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    // Récupérer depuis l'API pour vérifier que le token est toujours valide
    try {
      const response = await apiClient.get('/auth/me');
      const user = response.data;
      
      if (this.isBrowser()) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return user;
    } catch {
      // Si l'API échoue, retourner null (token invalide)
      this.logout();
      return null;
    }
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('auth_token');
  }
}

export const authService = new AuthService();