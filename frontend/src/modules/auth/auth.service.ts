import apiClient from '@/services/api-client';
import { LoginCredentials, AuthResponse, User } from '@/types';

/** Auth : mock pour démo. Remplacer par appels backend (POST /auth/login, etc.) lors de l’intégration. */
class AuthService {
  private isBrowser() {
    return typeof window !== 'undefined';
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Pour la démo, simule une réponse API
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-for-demo',
      user: {
        id: 1,
        email: credentials.email,
        firstName: 'Pauline',
        lastName: 'KABORE',
        role: 'admin',
        phone: '+226 70 00 00 00',
        isActive: true,
      },
    };

    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    // En production, utiliser :
    // const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Sauvegarder pour la session (localStorage + cookie pour middleware)
    if (this.isBrowser()) {
      localStorage.setItem('auth_token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      document.cookie = `auth_token=${mockResponse.token}; path=/; max-age=86400; SameSite=Lax`;
    }

    return mockResponse;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      document.cookie = 'auth_token=; path=/; max-age=0';
    }
  }

  getCurrentUser(): User | null {
    if (!this.isBrowser()) return null;
    
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('auth_token');
  }
}

export const authService = new AuthService();