import axios from "axios";
import { decodeJwt } from "@/lib/jwt";
import { setCookie, clearCookie } from "@/lib/auth-cookies";

// URL de base de l'API backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 secondes max
});

// Intercepteur pour ajouter le token JWT automatiquement
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs globales
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          try {
            const res = await axios.post(
              `${API_BASE_URL}/auth/refresh`,
              { refreshToken },
              { headers: { "Content-Type": "application/json" } }
            );
            const { accessToken, refreshToken: newRefresh } = res.data || {};
            if (accessToken) {
              localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
              setCookie("auth_token", accessToken);
              const payload = decodeJwt(accessToken);
              if (payload?.role) setCookie("user_role", payload.role);
            }
            if (newRefresh) {
              localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);
            }

            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
          } catch {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            clearCookie("auth_token");
            clearCookie("user_role");
            window.location.href = "/login";
          }
        } else {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          clearCookie("auth_token");
          clearCookie("user_role");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
