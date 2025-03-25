export interface CreateStudentDto {
  name: string;
  age: number;
  class: string;
  school?: string; // Assuming school is optional during creation, but can be set later
}

export interface Student {
  id: string;
  name: string;
  age: number;
  class: string;
  grades: { [course: string]: number };
  school: string;
}

