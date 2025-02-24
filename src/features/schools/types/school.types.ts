export interface School {
  _id: string;
  name: string;
  address: string;
  description?: string;
  instructors: {
    _id: string;
    username: string;
    email: string;
  }[];
  students: {
    _id: string;
    username: string;
  }[];
  dashboard: {
    studentCount: number;
    revenue: number;
    performanceStats: Map<string, any>;
  };
}

export interface CreateSchoolDto {
  name: string;
  address: string;
  description?: string;
}

export interface UpdateSchoolDto extends Partial<CreateSchoolDto> {} 