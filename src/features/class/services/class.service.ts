import api from "@/services/api"
import type {
  Class,
  CreateClassDto,
  UpdateClassDto,
  EnrollStudentDto,
  EnrollMultipleStudentsDto,
} from "../types/class.types"

const CLASSES_URL = "/api/classes"

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: any,
  ) {
    super(message)
  }
}

export const classService = {
  async createClass(classData: CreateClassDto): Promise<Class> {
    try {
      const { data } = await api.post<Class>(CLASSES_URL, classData)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to create class", error.response?.status)
    }
  },

  async getAllClasses(filters?: { schoolId?: string; instructorId?: string; status?: string }): Promise<Class[]> {
    try {
      const { data } = await api.get<Class[]>(CLASSES_URL, { params: filters })
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to fetch classes", error.response?.status)
    }
  },

  async getClassById(id: string): Promise<Class> {
    try {
      const { data } = await api.get<Class>(`${CLASSES_URL}/${id}`)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to fetch class", error.response?.status)
    }
  },

  async updateClass(id: string, classData: UpdateClassDto): Promise<Class> {
    try {
      const { data } = await api.put<Class>(`${CLASSES_URL}/${id}`, classData)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to update class", error.response?.status)
    }
  },

  async deleteClass(id: string): Promise<void> {
    try {
      await api.delete(`${CLASSES_URL}/${id}`)
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to delete class", error.response?.status)
    }
  },

  async enrollStudent(classId: string, enrollData: EnrollStudentDto): Promise<Class> {
    try {
      const { data } = await api.post<Class>(`${CLASSES_URL}/${classId}/enroll`, enrollData)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to enroll student", error.response?.status)
    }
  },

  async enrollMultipleStudents(classId: string, enrollData: EnrollMultipleStudentsDto): Promise<Class> {
    try {
      const { data } = await api.post<Class>(`${CLASSES_URL}/${classId}/enroll-multiple`, enrollData)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to enroll students", error.response?.status)
    }
  },

  async removeStudent(classId: string, studentId: string): Promise<Class> {
    try {
      const { data } = await api.delete<Class>(`${CLASSES_URL}/${classId}/students/${studentId}`)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to remove student", error.response?.status)
    }
  },

  async updateStatus(classId: string, status: string): Promise<Class> {
    try {
      const { data } = await api.patch<Class>(`${CLASSES_URL}/${classId}/status`, { status })
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to update class status", error.response?.status)
    }
  },

  async getClassesByInstructor(instructorId: string): Promise<Class[]> {
    try {
      const { data } = await api.get<Class[]>(`${CLASSES_URL}/instructor/${instructorId}`)
      return data
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || "Failed to fetch classes by instructor",
        error.response?.status,
      )
    }
  },

  async getClassesByStudent(studentId: string): Promise<Class[]> {
    try {
      const { data } = await api.get<Class[]>(`${CLASSES_URL}/student/${studentId}`)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to fetch classes by student", error.response?.status)
    }
  },

  async getClassesBySchool(schoolId: string): Promise<Class[]> {
    try {
      const { data } = await api.get<Class[]>(`${CLASSES_URL}/school/${schoolId}`)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to fetch classes by school", error.response?.status)
    }
  },
}

