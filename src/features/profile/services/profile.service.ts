import axios from "axios"
import type { ProfileData } from "../types/user"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export class ProfileService {
  static async getProfile(userId: string): Promise<ProfileData> {
    try {
      const response = await axios.get(`${API_URL}/profiles/${userId}`)
      return response.data
    } catch (error) {
      console.error("Error fetching profile:", error)
      throw error
    }
  }

  static async updateProfile(userId: string, profileData: Partial<ProfileData>): Promise<ProfileData> {
    try {
      const response = await axios.put(`${API_URL}/profiles/${userId}`, profileData)
      return response.data
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }
}

