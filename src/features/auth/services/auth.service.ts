import api from '@/services/api';
import { storage } from '../../../utils/storage';
import { jwtDecode } from "jwt-decode";
import { ENDPOINTS } from '@/services/endpoints';
export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}

const handleError = (error: any): Error => {
  if (error.response) {
    const message = error.response.data.message || 'An error occurred';
    return new Error(message);
  }
  return new Error('Network error');
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

interface DecodedToken {
  sub: string;      // ID de l'utilisateur
  username: string; // Nom d'utilisateur
  exp: number;      // Expiration
  iat: number;      // Issued at
}

interface User {
  id: string;
  username: string;
}

class AuthService {
  async login(credentials: LoginCredentials) {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', credentials);
      console.log('Login response:', data);

      if (!data.access_token) {
        throw new Error('No token received');
      }

      // Décode le token pour obtenir les informations utilisateur
      const decoded = jwtDecode<DecodedToken>(data.access_token);
      console.log('Decoded token:', decoded);

      // Crée l'objet utilisateur à partir des données du token
      const user: User = {
        id: decoded.sub,
        username: decoded.username
      };

      // Stocke le token et les informations utilisateur
      storage.setToken(data.access_token);
      storage.setUser(user);

      return { user, token: data.access_token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(credentials: RegisterCredentials) {
    try {
      const { data } = await api.post<LoginResponse>(ENDPOINTS.AUTH.REGISTER, credentials);
      console.log('Login response:', data);

      if (!data.access_token) {
        throw new Error('No token received');
      }

      // Décode le token pour obtenir les informations utilisateur
      const decoded = jwtDecode<DecodedToken>(data.access_token);
      console.log('Decoded token:', decoded);

      // Crée l'objet utilisateur à partir des données du token
      const user: User = {
        id: decoded.sub,
        username: decoded.username
      };

      // Stocke le token et les informations utilisateur
      storage.setToken(data.access_token);
      storage.setUser(user);

      return { user, token: data.access_token };
    } catch (error) {
      throw handleError(error);
    }
  }

  getCurrentUser(): User | null {
    const token = storage.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        id: decoded.sub,
        username: decoded.username
      };
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = storage.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }

  logout() {
    storage.clearAuth();
  }
}

export const authService = new AuthService(); 