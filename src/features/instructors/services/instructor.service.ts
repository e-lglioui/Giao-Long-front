import api from "@/services/api"

export interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: string;
}

export interface Instructor {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  specialties: string[];
  yearsOfExperience: number;
  certifications: Certification[];
}

export interface InstructorUpdateDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  specialties?: string[];
  yearsOfExperience?: number;
  certifications?: Certification[];
}

class InstructorService {
  private baseUrl = '/instructors';

  async getAllInstructors(): Promise<Instructor[]> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

  async getInstructorById(id: string): Promise<Instructor> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createInstructor(instructor: Omit<Instructor, 'id'>): Promise<Instructor> {
    const response = await api.post(this.baseUrl, instructor);
    return response.data;
  }

  async updateInstructor(id: string, updateData: InstructorUpdateDto): Promise<Instructor> {
    const response = await api.patch(`${this.baseUrl}/${id}`, updateData);
    return response.data;
  }

  async deleteInstructor(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async addInstructorToSchool(schoolId: string, instructor: Omit<Instructor, 'id'>): Promise<Instructor> {
    const response = await api.post(`/schools/${schoolId}/instructors`, instructor);
    return response.data;
  }

  async assignInstructorToSchool(schoolId: string, instructorId: string): Promise<void> {
    await api.put(`/schools/${schoolId}/instructors/${instructorId}`);
  }
}

export const instructorService = new InstructorService();