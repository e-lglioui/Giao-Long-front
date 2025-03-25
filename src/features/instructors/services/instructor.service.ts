import api from "@/services/api"
import { getImageUrl, adaptInstructor, openDocument } from "../utils/instructor-utils"

export interface Certification {
  name: string
  issuingOrganization: string
  issueDate: string
  expiryDate?: string
  documentUrl?: string
  certificateFile?: string
}

export interface Instructor {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  bio: string
  specialties: string[]
  yearsOfExperience: number
  certifications: Certification[]
  profileImageUrl?: string // URL to the profile image
  profileImages?: string[] // Array of all profile images
  passportUrl?: string // URL to the sport passport document
  sportsPassport?: string
  username: string // Ajout du champ username
  password?: string // Ajout du champ password (optionnel pour les mises à jour)
}

export interface InstructorUpdateDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  bio?: string
  specialties?: string[]
  yearsOfExperience?: number
  certifications?: Certification[]
}

export interface SchoolInstructorFullProfile {
  basicInfo: {
    id: string
    name: string
    email: string
    username: string
  }
  schoolInfo: {
    school: string
    rank?: string
    specialties?: string[]
    biography?: string
    joinedAt?: Date
  }
  profileInfo: {
    bio?: string
    phone?: string
    address?: string
    yearsOfExperience?: number
    certifications?: Certification[]
    profileImages?: string[]
    sportsPassport?: string
  } | null
}

class InstructorService {
  private baseUrl: string

  constructor(baseUrl = "/instructors") {
    this.baseUrl = baseUrl
  }

  /**
   * Change the base URL for API requests
   * @param newBaseUrl The new base URL to use
   */
  setBaseUrl(newBaseUrl: string): void {
    this.baseUrl = newBaseUrl
  }

  /**
   * Get the appropriate URL based on context
   * @param schoolId Optional school ID for school-specific endpoints
   * @returns The appropriate URL
   */
  private getContextUrl(schoolId?: string): string {
    if (schoolId) {
      return `/schools/${schoolId}/instructors`
    }
    return `/${this.baseUrl}`
  }

  async getAllInstructors(): Promise<Instructor[]> {
    try {
      const response = await api.get(`/${this.baseUrl}`)
      return Array.isArray(response.data) ? response.data.map(adaptInstructor) : []
    } catch (error) {
      console.error("Failed to fetch all instructors:", error)
      return []
    }
  }

  /**
   * Get instructor by ID
   */
  async getInstructorById(id: string): Promise<Instructor> {
    try {
      const response = await api.get(`/${this.baseUrl}/${id}`)
      return adaptInstructor(response.data)
    } catch (error) {
      console.error(`Failed to fetch instructor with ID ${id}:`, error)
      throw error
    }
  }

  async getInstructorFullProfile(id: string): Promise<Instructor> {
    try {
      const response = await api.get(`/${this.baseUrl}/${id}/full-profile`)
      return adaptInstructor(response.data)
    } catch (error) {
      console.error(`Failed to fetch full profile for instructor with ID ${id}:`, error)
      throw error
    }
  }

  /**
   * Create a new instructor
   * @param instructor The instructor data
   * @param schoolId Optional school ID. If provided, the instructor will be created for this school
   */
  async createInstructor(instructor: any, schoolId?: string): Promise<Instructor> {
    try {
      const url = this.getContextUrl(schoolId)
      console.log(`Creating instructor with URL: ${url}`)

      // Créer une copie des données pour éviter de modifier l'original
      const instructorData = { ...instructor }

      // Vérifier si les champs requis sont présents
      const requiredFields = ["firstName", "lastName", "email", "username", "password"]
      const missingFields = requiredFields.filter((field) => !instructorData[field])

      if (missingFields.length > 0) {
        console.error(`Missing required fields: ${missingFields.join(", ")}`)
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
      }

      // Vérifier la longueur du mot de passe
      if (instructorData.password && instructorData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      console.log(
        "Instructor data being sent:",
        JSON.stringify(
          {
            ...instructorData,
            password: instructorData.password ? "******" : undefined, // Masquer le mot de passe dans les logs
          },
          null,
          2,
        ),
      )

      const response = await api.post(url, instructorData)
      console.log("Create instructor response:", response.data)
      return adaptInstructor(response.data)
    } catch (error: any) {
      console.error("Failed to create instructor:", error)

      // Afficher plus de détails sur l'erreur
      if (error.response) {
        console.error("Error response data:", error.response.data)
        console.error("Error response status:", error.response.status)
        console.error("Error response headers:", error.response.headers)

        // Si le serveur renvoie un message d'erreur spécifique, le propager
        if (error.response.data && error.response.data.message) {
          throw new Error(`Server error: ${error.response.data.message}`)
        }
      }

      throw error
    }
  }

  /**
   * Update an instructor
   */
  async updateInstructor(id: string, updateData: InstructorUpdateDto): Promise<Instructor> {
    try {
      const response = await api.patch(`/${this.baseUrl}/${id}`, updateData)
      return adaptInstructor(response.data)
    } catch (error) {
      console.error(`Failed to update instructor with ID ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete an instructor
   */
  async deleteInstructor(id: string): Promise<void> {
    try {
      await api.delete(`/api${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Failed to delete instructor with ID ${id}:`, error)
      throw error
    }
  }

  /**
   * Upload profile image for an instructor
   */
  async uploadProfileImage(id: string, imageFile: File): Promise<Instructor> {
    try {
      const formData = new FormData()
      formData.append("image", imageFile)

      console.log("Uploading profile image:", imageFile.name, imageFile.type, imageFile.size)

      const response = await api.post(`/api${this.baseUrl}/${id}/profile-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Profile image upload successful:", response.data)
      return adaptInstructor(response.data)
    } catch (error: any) {
      console.error("Profile image upload failed:", error)

      if (error.response && error.response.data) {
        console.error("Error response:", error.response.data)
      }

      throw error
    }
  }

  /**
   * Upload certification for an instructor
   */
  async uploadCertificate(
    id: string,
    certificateFile: File,
    certificateData: { name: string; issuingOrganization: string; issueDate: string; expiryDate?: string },
  ): Promise<Instructor> {
    try {
      const formData = new FormData()
      formData.append("certificate", certificateFile)

      // Add metadata
      formData.append("name", certificateData.name)
      formData.append("issuingOrganization", certificateData.issuingOrganization)
      formData.append("issueDate", certificateData.issueDate)
      if (certificateData.expiryDate) {
        formData.append("expiryDate", certificateData.expiryDate)
      }

      console.log("Uploading certificate:", certificateFile.name, certificateFile.type, certificateFile.size)

      const response = await api.post(`/api${this.baseUrl}/${id}/certificate`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Certificate upload successful:", response.data)
      return adaptInstructor(response.data)
    } catch (error: any) {
      console.error("Certificate upload failed:", error)

      if (error.response && error.response.data) {
        console.error("Error response:", error.response.data)
      }

      throw error
    }
  }

  /**
   * Upload sports passport for an instructor
   */
  async uploadSportPassport(id: string, passportFile: File): Promise<Instructor> {
    try {
      const formData = new FormData()
      formData.append("passport", passportFile)

      console.log("Uploading sports passport:", passportFile.name, passportFile.type, passportFile.size)

      const response = await api.post(`/api${this.baseUrl}/${id}/sports-passport`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Sports passport upload successful:", response.data)
      return adaptInstructor(response.data)
    } catch (error: any) {
      console.error("Sports passport upload failed:", error)

      if (error.response && error.response.data) {
        console.error("Error response:", error.response.data)
      }

      throw error
    }
  }

  // ===== SCHOOL-SPECIFIC INSTRUCTOR ENDPOINTS =====

  /**
   * Get all instructors for a specific school
   */
  async getSchoolInstructors(schoolId: string): Promise<Instructor[]> {
    try {
      const response = await api.get(this.getContextUrl(schoolId))

      if (response.data && response.data.instructors && Array.isArray(response.data.instructors)) {
        return response.data.instructors.map(adaptInstructor)
      }

      return []
    } catch (error) {
      console.error(`Failed to fetch instructors for school ${schoolId}:`, error)
      return []
    }
  }

  /**
   * Get a specific instructor's details for a school
   */
  async getSchoolInstructorById(schoolId: string, instructorId: string): Promise<any> {
    try {
      const response = await api.get(`${this.getContextUrl(schoolId)}/${instructorId}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch instructor ${instructorId} for school ${schoolId}:`, error)
      throw error
    }
  }

  /**
   * Add a new instructor to a school
   */
  async addInstructorToSchool(schoolId: string, instructor: any): Promise<any> {
    try {
      const response = await api.post(this.getContextUrl(schoolId), instructor)
      return response.data
    } catch (error) {
      console.error(`Failed to add instructor to school ${schoolId}:`, error)
      throw error
    }
  }

  /**
   * Assign an existing instructor to a school
   */
  async assignInstructorToSchool(schoolId: string, instructorId: string): Promise<any> {
    try {
      const response = await api.put(`${this.getContextUrl(schoolId)}/${instructorId}`)
      return response.data
    } catch (error) {
      console.error(`Failed to assign instructor ${instructorId} to school ${schoolId}:`, error)
      throw error
    }
  }

  /**
   * Update instructor details for a school
   */
  async updateSchoolInstructor(schoolId: string, instructorId: string, updateData: any): Promise<any> {
    try {
      const response = await api.put(`${this.getContextUrl(schoolId)}/${instructorId}`, updateData)
      return response.data
    } catch (error) {
      console.error(`Failed to update instructor ${instructorId} for school ${schoolId}:`, error)
      throw error
    }
  }

  /**
   * Remove instructor from school
   */
  async removeInstructorFromSchool(schoolId: string, instructorId: string): Promise<any> {
    try {
      const response = await api.delete(`${this.getContextUrl(schoolId)}/${instructorId}`)
      return response.data
    } catch (error) {
      console.error(`Failed to remove instructor ${instructorId} from school ${schoolId}:`, error)
      throw error
    }
  }

  /**
   * Upload profile image for a school instructor
   */
  async uploadSchoolInstructorProfileImage(schoolId: string, instructorId: string, imageFile: File): Promise<any> {
    try {
      const formData = new FormData()
      formData.append("image", imageFile)

      console.log("Uploading profile image for school instructor:", imageFile.name, imageFile.type, imageFile.size)

      const response = await api.post(`${this.getContextUrl(schoolId)}/${instructorId}/profile-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error(`Failed to upload profile image for instructor ${instructorId} in school ${schoolId}:`, error)
      throw error
    }
  }

  async uploadSchoolInstructorCertificate(
    schoolId: string,
    instructorId: string,
    certificateFile: File,
    certificationDetails: {
      name: string
      issuingOrganization: string
      issueDate: string
      expiryDate?: string
    },
  ): Promise<any> {
    try {
      const formData = new FormData()
      formData.append("certificate", certificateFile)

      // Add certification details
      formData.append("name", certificationDetails.name)
      formData.append("issuingOrganization", certificationDetails.issuingOrganization)
      formData.append("issueDate", certificationDetails.issueDate)

      if (certificationDetails.expiryDate) {
        formData.append("expiryDate", certificationDetails.expiryDate)
      }

      console.log(
        "Uploading certificate for school instructor:",
        certificateFile.name,
        certificateFile.type,
        certificateFile.size,
      )

      const response = await api.post(`${this.getContextUrl(schoolId)}/${instructorId}/certificate`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error(`Failed to upload certificate for instructor ${instructorId} in school ${schoolId}:`, error)
      throw error
    }
  }

  async uploadSchoolInstructorSportsPassport(schoolId: string, instructorId: string, passportFile: File): Promise<any> {
    try {
      const formData = new FormData()
      formData.append("passport", passportFile)

      console.log(
        "Uploading sports passport for school instructor:",
        passportFile.name,
        passportFile.type,
        passportFile.size,
      )

      const response = await api.post(`${this.getContextUrl(schoolId)}/${instructorId}/sports-passport`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error(`Failed to upload sports passport for instructor ${instructorId} in school ${schoolId}:`, error)
      throw error
    }
  }

  async getSchoolInstructorFullProfile(schoolId: string, instructorId: string): Promise<SchoolInstructorFullProfile> {
    try {
      const response = await api.get(`${this.getContextUrl(schoolId)}/${instructorId}/full-profile`)

      // Process profile images if they exist
      if (response.data.profileInfo && response.data.profileInfo.profileImages) {
        response.data.profileInfo.profileImages = response.data.profileInfo.profileImages
          .map((img: string) => getImageUrl(img))
          .filter(Boolean)
      }

      // Process certifications if they exist
      if (response.data.profileInfo && response.data.profileInfo.certifications) {
        response.data.profileInfo.certifications = response.data.profileInfo.certifications.map((cert: any) => ({
          ...cert,
          documentUrl: getImageUrl(cert.certificateFile),
        }))
      }

      // Process sports passport if it exists
      if (response.data.profileInfo && response.data.profileInfo.sportsPassport) {
        response.data.profileInfo.sportsPassport = getImageUrl(response.data.profileInfo.sportsPassport)
      }

      return response.data
    } catch (error) {
      console.error(`Failed to fetch full profile for instructor ${instructorId} in school ${schoolId}:`, error)
      throw error
    }
  }

  // Helper method to safely open documents
  openDocument(url: string | undefined, errorToast: (message: string) => void): Promise<void> {
    return openDocument(url, errorToast)
  }

  // Ajoutons la méthode pour récupérer toutes les écoles
  /**
   * Get all schools
   */
  async getAllSchools(): Promise<any[]> {
    try {
      const response = await api.get("/api/schools")
      return Array.isArray(response.data)
        ? response.data.map((school: any) => ({
            id: school._id || school.id,
            name: school.name,
            address: school.address || "",
            description: school.description || "",
          }))
        : []
    } catch (error) {
      console.error("Failed to fetch all schools:", error)
      return []
    }
  }
}

export const instructorService = new InstructorService()

