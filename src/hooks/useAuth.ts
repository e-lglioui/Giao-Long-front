import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setUser, setLoading, setError } from "@/features/auth/authSlice";
import { authService, RegisterCredentials } from "@/features/auth/services/auth.service";

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

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && !user) {
      dispatch(setUser(currentUser));
    }
  }, [dispatch, user]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user: userData } = await authService.login(credentials);
      dispatch(setUser(userData));
      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      console.error("Login Error:", err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    dispatch(setUser(null));
    navigate("/login");
  };

  const register = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.register(credentials);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      console.error("Registration Error:", err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.forgotPassword(email);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send reset instructions";
      console.error("Forgot Password Error:", err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.resetPassword(token, newPassword);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reset password";
      console.error("Reset Password Error:", err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmEmail = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.confirmEmail(token);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to confirm email";
      console.error("Confirm Email Error:", err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
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
    forgotPassword,
    resetPassword,
    confirmEmail,
    getUserId: () => user?.id,
    getUsername: () => user?.username,
  };
}
