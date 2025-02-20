import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setUser } from '@/features/auth/authSlice';
import { authService } from '@/features/auth/services/auth.service';
import { RegisterCredentials } from '@/features/auth/services/auth.service';
import {  setLoading, setError } from '@/features/auth/authSlice';


export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && !user) {
      dispatch(setUser(currentUser));
    }
  }, [dispatch, user]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { user: userData } = await authService.login(credentials);
      dispatch(setUser(userData));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login errorrr:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch(setUser(null));
    navigate('/login');
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const { user: userData }  = await authService.register(credentials);
      dispatch(setUser(userData));
      navigate('/login');
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated: authService.isAuthenticated(),
    login,
    logout,
    register,
    getUserId: () => user?.id,
    getUsername: () => user?.username
  };
}