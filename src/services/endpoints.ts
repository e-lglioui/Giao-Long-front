export const API_BASE_URL = 'http://localhost:3000';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    CONFIRM_EMAIL:`${API_BASE_URL}/auth/confirm-email`,
    RESET_PASSWORD:`${API_BASE_URL}/auth/reset-password`,
    FORGOT_PASSWORD:`${API_BASE_URL}/auth/forgot-password`,
  }
};