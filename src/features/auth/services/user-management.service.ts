import api from '@/services/api';
import { Role, UserRole } from '../types/roles';
import { ENDPOINTS } from '@/services/endpoints';
import { authService } from './auth.service';

interface AssignRoleRequest {
  userId: string;
  role: Role;
  schoolIds?: string[]; 
}

interface UserRoleResponse {
  userId: string;
  role: string;
  schoolIds?: string[];
}

class UserManagementService {
  /**
   * Assign a role to a user
   * This replaces any existing role
   */
  async assignRole(request: AssignRoleRequest): Promise<UserRoleResponse> {
    try {
      // Only Super Admin can assign School Admin role
      if (request.role === Role.SCHOOL_ADMIN && !authService.hasRole(Role.SUPER_ADMIN)) {
        throw new Error('Only Super Admins can assign School Admin roles');
      }

      // School Admin, Instructor, and Staff roles require schoolIds
      if ([Role.SCHOOL_ADMIN, Role.INSTRUCTOR, Role.STAFF].includes(request.role) && 
          (!request.schoolIds || request.schoolIds.length === 0)) {
        throw new Error(`${request.role} role requires at least one school to be assigned`);
      }

      // For assigning instructor/staff roles, check if current user has School Admin role for those schools
      if ([Role.INSTRUCTOR, Role.STAFF].includes(request.role) && 
          !authService.hasRole(Role.SUPER_ADMIN)) {
        
        // Check if user has School Admin role
        if (!authService.hasRole(Role.SCHOOL_ADMIN)) {
          throw new Error('Only School Admins can assign Instructor or Staff roles');
        }
        
        // Check if the school is administered by the current user
        const userHasAccessToSchools = request.schoolIds?.every(
          schoolId => authService.hasSchoolAccess(schoolId)
        );
        
        if (!userHasAccessToSchools) {
          throw new Error('You can only assign roles for schools you administer');
        }
      }

      const { data } = await api.post<UserRoleResponse>(
        ENDPOINTS.USERS.ASSIGN_ROLE,
        request
      );
      return data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  /**
   * Get the user's current role
   */
  async getUserRole(userId: string): Promise<UserRole> {
    try {
      const { data } = await api.get(`${ENDPOINTS.USERS.ROLE}/${userId}`);
      return data.userRole;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}

export const userManagementService = new UserManagementService();