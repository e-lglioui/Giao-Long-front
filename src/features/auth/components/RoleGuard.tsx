import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Role } from '../types/roles';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  schoolId?: string;
  redirectTo?: string;
}

/**
 * A component that restricts access to routes based on user roles
 */
const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  schoolId,
  redirectTo = '/login',
}) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const hasRequiredRole = allowedRoles.some(role => authService.hasRole(role, schoolId));
  
  if (!hasRequiredRole) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User has the required role, allow access
  return <>{children}</>;
};

export default RoleGuard; 