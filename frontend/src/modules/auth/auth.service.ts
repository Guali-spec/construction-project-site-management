import apiClient from "@/services/api-client";
import { LoginCredentials, AuthResponse, User } from "@/types";
import { decodeJwt } from "@/lib/jwt";
import { clearCookie, setCookie } from "@/lib/auth-cookies";

class AuthService {
  private isBrowser() {
    return typeof window !== "undefined";
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    const auth = response.data;

    if (this.isBrowser()) {
      localStorage.setItem("access_token", auth.accessToken);
      localStorage.setItem("refresh_token", auth.refreshToken);
      setCookie("auth_token", auth.accessToken);
      const payload = decodeJwt(auth.accessToken);
      if (payload?.role) setCookie("user_role", payload.role);
    }

    return auth;
  }

  async register(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    requestedRole?: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", payload);
    const auth = response.data;
    if (this.isBrowser()) {
      localStorage.setItem("access_token", auth.accessToken);
      localStorage.setItem("refresh_token", auth.refreshToken);
      setCookie("auth_token", auth.accessToken);
      const decoded = decodeJwt(auth.accessToken);
      if (decoded?.role) setCookie("user_role", decoded.role);
    }
    return auth;
  }

  async fetchCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    const user = response.data;
    if (this.isBrowser()) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user?.role) setCookie("user_role", user.role);
    }
    return user;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      clearCookie("auth_token");
      clearCookie("user_role");
    }
  }

  getCurrentUser(): User | null {
    if (!this.isBrowser()) return null;
    
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem("access_token");
  }
}

export const authService = new AuthService();
