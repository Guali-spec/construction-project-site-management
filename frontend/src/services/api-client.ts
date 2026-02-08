import axios from 'axios';

// URL de base de l'API backend
// Le backend n'utilise pas de préfixe /api, les routes sont directement /auth, /projects, etc.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes max
});

// Intercepteur pour ajouter le token JWT automatiquement
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
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
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        // Ne pas rediriger si on est déjà sur la page de login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.response?.status === 403) {
      // Accès interdit
      console.error('Accès interdit:', error.response.data);
    } else if (error.response?.status >= 500) {
      // Erreur serveur
      console.error('Erreur serveur:', error.response.data);
    } else if (!error.response) {
      // Erreur réseau (pas de réponse du serveur)
      const networkError = error.code === 'ECONNREFUSED' 
        ? 'Le serveur backend n\'est pas accessible. Vérifiez qu\'il est démarré sur ' + (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
        : error.message || 'Erreur réseau : Impossible de joindre le serveur';
      console.error('Erreur réseau:', networkError);
    }
    return Promise.reject(error);
  }
);

export default apiClient;