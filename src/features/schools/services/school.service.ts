import api from "@/services/api"
import type { School, CreateSchoolDto, UpdateSchoolDto, ScheduleDto } from "../types/school.types"

const SCHOOLS_URL = "http://localhost:3000/schools"

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: any,
  ) {
    super(message)
  }
}

export const schoolService = {
  async createSchool(schoolData: CreateSchoolDto): Promise<School> {
    try {
      console.log("API sending data:", JSON.stringify(schoolData, null, 2))

      // Add explicit headers to ensure content type is correct
      const { data } = await api.post<School>(SCHOOLS_URL, schoolData, {
        headers: {
          "Content-Type": "application/json",
          // Add a custom header with the school name as a backup
          "X-School-Name": schoolData.name,
        },
      })
      return data
    } catch (error: any) {
      console.error("API error response:", error.response?.data)
      throw new ApiError(error.response?.data?.message || "Failed to create school", error.response?.status)
    }
  },

  async getAllSchools(): Promise<School[]> {
    try {
      const { data } = await api.get<School[]>(SCHOOLS_URL)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to fetch schools", error.response?.status)
    }
  },

  async getSchoolById(id: string): Promise<School> {
    try {
      const { data } = await api.get<School>(`${SCHOOLS_URL}/${id}`)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to fetch school", error.response?.status)
    }
  },

  async updateSchool(id: string, schoolData: UpdateSchoolDto): Promise<School> {
    try {
      const { data } = await api.put<School>(`${SCHOOLS_URL}/${id}`, schoolData)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to update school", error.response?.status)
    }
  },

  async deleteSchool(id: string): Promise<void> {
    try {
      await api.delete(`${SCHOOLS_URL}/${id}`)
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to delete school", error.response?.status)
    }
  },

  async addInstructor(schoolId: string, instructorId: string): Promise<School> {
    try {
      const { data } = await api.put<School>(`${SCHOOLS_URL}/${schoolId}/instructors/${instructorId}`)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to add instructor", error.response?.status)
    }
  },

  async addStudent(schoolId: string, studentId: string): Promise<School> {
    try {
      const { data } = await api.put<School>(`${SCHOOLS_URL}/${schoolId}/students/${studentId}`)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to add student", error.response?.status)
    }
  },

  async updateSchedule(schoolId: string, schedule: ScheduleDto): Promise<School> {
    try {
      const { data } = await api.patch<School>(`${SCHOOLS_URL}/${schoolId}/schedule`, schedule)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to update schedule", error.response?.status)
    }
  },

  async uploadSingleImage(schoolId: string, file: File): Promise<School> {
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const { data } = await api.post<School>(`${SCHOOLS_URL}/${schoolId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to upload image", error.response?.status)
    }
  },
  
  async uploadMultipleImages(schoolId: string, files: FileList): Promise<School> {
    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i])
      }
      
      const { data } = await api.post<School>(`${SCHOOLS_URL}/${schoolId}/multiple-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to upload images", error.response?.status)
    }
  },

  async deleteImage(schoolId: string, imageUrl: string): Promise<School> {
    try {
      const { data } = await api.delete<School>(`${SCHOOLS_URL}/${schoolId}/images`, {
        data: { imageUrl }
      })
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to delete image", error.response?.status)
    }
  },
  async getSchoolsForMap() {
    try {
      const { data } = await api.get<School[]>(`${SCHOOLS_URL}/map`)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to fetch schools for map", error.response?.status)
    }
  },

  async getNearbySchools(latitude: number, longitude: number, maxDistance = 5000) {
    try {
      const { data } = await api.get<School[]>(
        `${SCHOOLS_URL}/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`,
      )
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to fetch nearby schools", error.response?.status)
    }
  },

}