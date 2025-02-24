import api from '@/services/api';
import { storage } from '../../../utils/storage';
import { jwtDecode } from "jwt-decode";
import { ENDPOINTS } from '@/services/endpoints';

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    username: string;
    isConfirmed: boolean;
  };
  access_token: string;
  message: string;
  requiresEmailConfirmation: boolean;
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
  sub: string;      // User ID
  username: string; // Username
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

      const decoded = jwtDecode<DecodedToken>(data.access_token);
      console.log('Decoded token:', decoded);

      const user: User = {
        id: decoded.sub,
        username: decoded.username
      };

      storage.setToken(data.access_token);
      storage.setUser(user);

      return { user, token: data.access_token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      console.log('Sending registration request with data:', credentials);
      
      const { data } = await api.post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, credentials);
      console.log('Registration response:', data);

      if (!data.access_token) {
        throw new Error('No token received');
      }

      storage.setToken(data.access_token);
      storage.setUser(data.user);

      return {
        user: data.user,
        access_token: data.access_token,
        message: data.message,
        requiresEmailConfirmation: !data.user.isConfirmed
      };
    } catch (error: any) {
      console.error('Registration error in service:', error.response?.data || error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Registration failed. Please try again.');
    }
  }

  // Add the missing methods
  async confirmEmail(token: string): Promise<void> {
    try {
      await api.post(ENDPOINTS.AUTH.CONFIRM_EMAIL, { token });
    } catch (error) {
      throw handleError(error);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
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