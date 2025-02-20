const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  REFRESH_TOKEN: 'refreshToken'
} as const;

export const storage = {
  
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
  setToken: (token: string) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },
  removeToken: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  getUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      return null;
    }
  },
  setUser: (user: any) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  removeUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getRefreshToken: () => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
  setRefreshToken: (token: string) => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },
  removeRefreshToken: () => {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

 
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
};

export default storage; 