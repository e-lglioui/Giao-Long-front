import axios from "axios"
import type { Student } from "../types/student.types"

const api = axios.create({
  baseURL: "http://localhost:3000/students",
  headers: {
    "Content-Type": "application/json",
  },
})

class StudentService {
  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await api.get("/")
      return response.data
    } catch (error) {
      console.error("Error fetching students:", error)
      throw error
    }
  }

  async getStudentById(id: string): Promise<Student> {
    try {
      const response = await api.get(`/${id}`)
      return response.data
    } catch (error) {
      console.error("Error fetching student:", error)
      throw error
    }
  }

  async createStudent(studentData: any): Promise<Student> {
    try {
      // Make sure the school property is included in the data
      if (!studentData.school) {
        // Get the current school ID from localStorage if available
        const schoolId = localStorage.getItem("currentSchoolId")
        if (schoolId) {
          studentData.school = schoolId
        } else {
          // If no school ID is available, throw an error
          throw new Error("School ID is required to create a student")
        }
      }

      // For school admin creating students, we need to use a different endpoint
      // that doesn't require a userId
      const response = await axios.post("http://localhost:3000/school-admin/students", studentData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include cookies for authentication
      })

      return response.data
    } catch (error: any) {
      console.error("Error creating student:", error)
      throw new Error(error.response?.data?.message || "Failed to create student")
    }
  }

  async updateStudent(id: string, updateData: Partial<Student>): Promise<Student> {
    try {
      const response = await api.put(`/${id}`, updateData)
      return response.data
    } catch (error) {
      console.error("Error updating student:", error)
      throw error
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      await api.delete(`/${id}`)
    } catch (error) {
      console.error("Error deleting student:", error)
      throw error
    }
  }

  async getStudentsByClass(className: string): Promise<Student[]> {
    try {
      const response = await api.get(`/class/${encodeURIComponent(className)}`)
      return response.data
    } catch (error) {
      console.error("Error fetching students by class:", error)
      throw error
    }
  }

  async addGrade(id: string, course: string, grade: number): Promise<Student> {
    try {
      const response = await api.put(`/${id}/grades`, { course, grade })
      return response.data
    } catch (error) {
      console.error("Error adding grade:", error)
      throw error
    }
  }
}

export const studentService = new StudentService()

