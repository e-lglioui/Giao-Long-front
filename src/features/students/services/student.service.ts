import axios from "axios";
import { CreateStudentDto } from "../types/student.types";
import {Student} from "../types/student.types";



const api = axios.create({
  baseURL: "http://localhost:3000/students",
  headers: {
    "Content-Type": "application/json",
  },
});

class StudentService {
  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  }

  async getStudentById(id: string): Promise<Student> {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching student:", error);
      throw error;
    }
  }

  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const response = await api.post("/", createStudentDto);
      return response.data;
    } catch (error: any) {
      console.error("Error creating student:", error);
      throw new Error(error.response?.data?.message || "Failed to create student");
    }
  }

  async updateStudent(id: string, updateData: Partial<Student>): Promise<Student> {
    try {
      const response = await api.put(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      await api.delete(`/${id}`);
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  }

  async getStudentsByClass(className: string): Promise<Student[]> {
    try {
      const response = await api.get(`/class/${encodeURIComponent(className)}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching students by class:", error);
      throw error;
    }
  }

  async addGrade(id: string, course: string, grade: number): Promise<Student> {
    try {
      const response = await api.put(`/${id}/grades`, { course, grade });
      return response.data;
    } catch (error) {
      console.error("Error adding grade:", error);
      throw error;
    }
  }
}

export const studentService = new StudentService();
