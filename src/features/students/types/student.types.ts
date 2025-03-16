

export interface CreateStudentDto {
    firstName: string;
    lastName: string;
    studentId: string;
    dateOfBirth: string;
    class: string;
    isActive: boolean;
    courses?: string[];
  }
  
  export interface Student extends CreateStudentDto {
    id: string;
    grades?: {
      course: string;
      grade: number;
    }[];
  }