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
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    DETAIL: (id: string) => `${API_BASE_URL}/users/${id}`,
    ROLE: `${API_BASE_URL}/users/role`,
    ASSIGN_ROLE: `${API_BASE_URL}/users/role/assign`,
    REMOVE_ROLE: `${API_BASE_URL}/users/role/remove`,
    BY_ROLE: `${API_BASE_URL}/users/by-role`,
  },
  INSTRUCTORS: {
    BASE: `${API_BASE_URL}/instructors`,
    DETAIL: (id: string) => `${API_BASE_URL}/instructors/${id}`,
    ADD_TO_SCHOOL: (schoolId: string) => `${API_BASE_URL}/schools/${schoolId}/instructors`,
    ASSIGN_TO_SCHOOL: (schoolId: string, instructorId: string) => 
      `${API_BASE_URL}/schools/${schoolId}/instructors/${instructorId}`,
  }
};