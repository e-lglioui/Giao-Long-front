import React from 'react';
import { authService } from '../services/auth.service';

interface PermissionGuardProps {
  children: React.ReactNode;
  action: string;
  subject: string;
  schoolId?: string;
  fallback?: React.ReactNode;
}

/**
 * A component that conditionally renders children based on user permissions
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  action,
  subject,
  schoolId,
  fallback = null,
}) => {
  const hasPermission = authService.hasPermission(action, subject, schoolId);
  
  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard; 