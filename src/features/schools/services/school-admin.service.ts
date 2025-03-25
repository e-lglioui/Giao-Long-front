import api from "@/services/api"
import type { School } from "../types/school.types"

const SCHOOL_ADMIN_URL = "http://localhost:3000/school-admin/schools"

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: any,
  ) {
    super(message)
  }
}

export const schoolAdminService = {
  // Create a new school (school admin can only create one)
  async createSchool(schoolData: any): Promise<School> {
    try {
      console.log("API sending data:", JSON.stringify(schoolData, null, 2))
      const { data } = await api.post<School>(SCHOOL_ADMIN_URL, schoolData)
      return data
    } catch (error: any) {
      console.error("API error response:", error.response?.data)
      if (error.response?.status === 403) {
        throw new ApiError("You can only create one school as a school admin", error.response?.status)
      }
      throw new ApiError(error.response?.data?.message || "Failed to create school", error.response?.status)
    }
  },

  // Get the school admin's school
  async getMySchool(): Promise<School> {
    try {
      const { data } = await api.get<School>(`${SCHOOL_ADMIN_URL}/my-school`)
      return data
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new ApiError("You don't have a school yet", error.response?.status)
      }
      throw new ApiError(error.response?.data?.message || "Failed to fetch your school", error.response?.status)
    }
  },

  // Update the school admin's school
  async updateMySchool(schoolData: any): Promise<School> {
    try {
      const { data } = await api.put<School>(`${SCHOOL_ADMIN_URL}/my-school`, schoolData)
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to update school", error.response?.status)
    }
  },

  // Upload a single image for the school
  async uploadImage(file: File): Promise<School> {
    try {
      const formData = new FormData()
      formData.append("image", file)

      const { data } = await api.post<School>(`${SCHOOL_ADMIN_URL}/my-school/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to upload image", error.response?.status)
    }
  },

  // Upload multiple images for the school
  async uploadMultipleImages(files: FileList): Promise<School> {
    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i])
      }

      const { data } = await api.post<School>(`${SCHOOL_ADMIN_URL}/my-school/multiple-images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return data
    } catch (error: any) {
      throw new ApiError(error.response?.data?.message || "Failed to upload images", error.response?.status)
    }
  },

}

