import api from '@/services/api';
import { School, CreateSchoolDto, UpdateSchoolDto } from '../types/school.types';

const SCHOOLS_URL = '/schools';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: any
  ) {
    super(message);
  }
}

export const schoolService = {
  async createSchool(schoolData: CreateSchoolDto): Promise<School> {
    try {
      const { data } = await api.post<School>(SCHOOLS_URL, schoolData);
      return data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to create school',
        error.response?.status
      );
    }
  },

  async getAllSchools(): Promise<School[]> {
    try {
      const { data } = await api.get<School[]>(SCHOOLS_URL);
      return data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to fetch schools',
        error.response?.status
      );
    }
  },

  async getSchoolById(id: string): Promise<School> {
    try {
      const { data } = await api.get<School>(`${SCHOOLS_URL}/${id}`);
      return data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to fetch school',
        error.response?.status
      );
    }
  },

  async updateSchool(id: string, schoolData: UpdateSchoolDto): Promise<School> {
    try {
      const { data } = await api.put<School>(`${SCHOOLS_URL}/${id}`, schoolData);
      return data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to update school',
        error.response?.status
      );
    }
  },

  async deleteSchool(id: string): Promise<void> {
    try {
      await api.delete(`${SCHOOLS_URL}/${id}`);
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to delete school',
        error.response?.status
      );
    }
  },

  async addInstructor(schoolId: string, instructorId: string): Promise<School> {
    try {
      const { data } = await api.post<School>(
        `${SCHOOLS_URL}/${schoolId}/instructors/${instructorId}`
      );
      return data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to add instructor',
        error.response?.status
      );
    }
  },

  async addStudent(schoolId: string, studentId: string): Promise<School> {
    try {
      const { data } = await api.post<School>(
        `${SCHOOLS_URL}/${schoolId}/students/${studentId}`
      );
      return data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || 'Failed to add student',
        error.response?.status
      );
    }
  }
}; 