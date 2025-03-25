export enum Role {
  SUPER_ADMIN = 'super_admin',
  SCHOOL_ADMIN = 'school_admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
  STAFF = 'staff',
  USER = 'user'
}

// A user is assigned a single role, possibly with school associations
export interface UserRole {
  role: Role;
  schoolIds?: string[]; // For SCHOOL_ADMIN, INSTRUCTOR, STAFF roles
}

export interface RolePermission {
  action: string;
  subject: string;
}

// Define permissions for each role
export const rolePermissions: Record<Role, RolePermission[]> = {
  [Role.SUPER_ADMIN]: [
    { action: 'manage', subject: 'all' },
    { action: 'create', subject: 'school_admin' },
    { action: 'assign', subject: 'school' }
  ],
  [Role.SCHOOL_ADMIN]: [
    { action: 'manage', subject: 'school' },
    { action: 'create', subject: 'instructor' },
    { action: 'create', subject: 'staff' },
    { action: 'manage', subject: 'course' }
  ],
  [Role.INSTRUCTOR]: [
    { action: 'read', subject: 'school' },
    { action: 'teach', subject: 'course' },
    { action: 'manage', subject: 'class' }
  ],
  [Role.STUDENT]: [
    { action: 'enroll', subject: 'course' },
    { action: 'attend', subject: 'class' },
    { action: 'read', subject: 'material' }
  ],
  [Role.STAFF]: [
    { action: 'read', subject: 'school' },
    { action: 'support', subject: 'admin' },
    { action: 'manage', subject: 'event' }
  ],
  [Role.USER]: [
    { action: 'read', subject: 'public' }
  ]
};