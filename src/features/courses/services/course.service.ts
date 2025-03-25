import api from "@/services/api"
import type { Course, CreateCourseDto, UpdateCourseDto } from "../types/course.types"

const COURSES_URL = "/api/courses"

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: any,
  ) {
    super(message)
  }
}

export const courseService = {
  async createCourse(courseData: CreateCourseDto): Promise<Course> {
    try {
      const { data } = await api.post<Course>(COURSES_URL, courseData)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to create course", error.response?.status)
    }
  },

  async getAllCourses(): Promise<Course[]> {
    try {
      const { data } = await api.get<Course[]>(COURSES_URL)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to fetch courses", error.response?.status)
    }
  },

  async getCourseById(id: string): Promise<Course> {
    try {
      const { data } = await api.get<Course>(`${COURSES_URL}/${id}`)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to fetch course", error.response?.status)
    }
  },

  async updateCourse(id: string, courseData: UpdateCourseDto): Promise<Course> {
    try {
      const { data } = await api.put<Course>(`${COURSES_URL}/${id}`, courseData)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to update course", error.response?.status)
    }
  },

  async deleteCourse(id: string): Promise<void> {
    try {
      await api.delete(`${COURSES_URL}/${id}`)
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to delete course", error.response?.status)
    }
  },
}

