import api from "@/services/api"
import type { Enrollment, CreateEnrollmentDto } from "../types/enrollment.types"

const ENROLLMENTS_URL = "/api/enrollments"

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: any,
  ) {
    super(message)
  }
}

export const enrollmentService = {
  async createEnrollment(enrollmentData: CreateEnrollmentDto): Promise<Enrollment> {
    try {
      const { data } = await api.post<Enrollment>(ENROLLMENTS_URL, enrollmentData)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to create enrollment", error.response?.status)
    }
  },

  async getAllEnrollments(filters?: { studentId?: string; schoolId?: string; status?: string }): Promise<Enrollment[]> {
    try {
      const { data } = await api.get<Enrollment[]>(ENROLLMENTS_URL, { params: filters })
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to fetch enrollments", error.response?.status)
    }
  },

  async getEnrollmentById(id: string): Promise<Enrollment> {
    try {
      const { data } = await api.get<Enrollment>(`${ENROLLMENTS_URL}/${id}`)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to fetch enrollment", error.response?.status)
    }
  },

  async getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    try {
      const { data } = await api.get<Enrollment[]>(`${ENROLLMENTS_URL}/student/${studentId}`)
      return data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || "Failed to fetch enrollments by student",
        error.response?.status,
      )
    }
  },

  async getEnrollmentsBySchool(schoolId: string): Promise<Enrollment[]> {
    try {
      const { data } = await api.get<Enrollment[]>(`${ENROLLMENTS_URL}/school/${schoolId}`)
      return data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || "Failed to fetch enrollments by school",
        error.response?.status,
      )
    }
  },

  async updateEnrollment(id: string, updateData: Partial<CreateEnrollmentDto>): Promise<Enrollment> {
    try {
      const { data } = await api.put<Enrollment>(`${ENROLLMENTS_URL}/${id}`, updateData)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to update enrollment", error.response?.status)
    }
  },

  async addClassToEnrollment(enrollmentId: string, classId: string): Promise<Enrollment> {
    try {
      const { data } = await api.post<Enrollment>(`${ENROLLMENTS_URL}/${enrollmentId}/classes/${classId}`)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to add class to enrollment", error.response?.status)
    }
  },

  async removeClassFromEnrollment(enrollmentId: string, classId: string): Promise<Enrollment> {
    try {
      const { data } = await api.delete<Enrollment>(`${ENROLLMENTS_URL}/${enrollmentId}/classes/${classId}`)
      return data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || "Failed to remove class from enrollment",
        error.response?.status,
      )
    }
  },

  async updateStatus(enrollmentId: string, status: string): Promise<Enrollment> {
    try {
      const { data } = await api.patch<Enrollment>(`${ENROLLMENTS_URL}/${enrollmentId}/status`, { status })
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to update enrollment status", error.response?.status)
    }
  },

  async deleteEnrollment(id: string): Promise<void> {
    try {
      await api.delete(`${ENROLLMENTS_URL}/${id}`)
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to delete enrollment", error.response?.status)
    }
  },
}

