import type React from "react"
import api from "@/services/api"

export const API_BASE_URL = "http://localhost:3000"

// Modifions la fonction getImageUrl pour mieux gérer les chemins de fichiers
export function getImageUrl(imagePath: string | undefined): string | undefined {
  if (!imagePath) return undefined

  // Skip paths with 'undefined' in them
  if (imagePath.includes("undefined")) {
    console.warn(`Skipping invalid path with 'undefined': ${imagePath}`)
    return undefined
  }

  // If it's already a full URL, return it as is
  if (imagePath.startsWith("http")) return imagePath

  // Extract the filename from the path
  const filename = imagePath.split("/").pop()

  // Handle paths based on filename patterns
  if (filename) {
    // Image files
    if (filename.startsWith("image-")) {
      return `${API_BASE_URL}/upload/images/${filename}`
    }

    // Document files (certificates, passports)
    if (filename.startsWith("certificate-") || filename.startsWith("passport-") || filename.startsWith("document-")) {
      return `${API_BASE_URL}/upload/documents/${filename}`
    }
  }

  // Handle paths that start with /images/ or /documents/
  if (imagePath.startsWith("/images/")) {
    return `${API_BASE_URL}/upload/images/${imagePath.split("/").pop()}`
  }

  if (imagePath.startsWith("/documents/")) {
    return `${API_BASE_URL}/upload/documents/${imagePath.split("/").pop()}`
  }

  // Default case: append to base URL
  return `${API_BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
}

/**
 * Handles image loading errors by setting a placeholder
 * @param e - The error event
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>): void {
  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=192&width=384"
}

export interface Certification {
  name: string
  issuingOrganization: string
  issueDate: string
  expiryDate?: string
  documentUrl?: string // URL to the certificate PDF document
  certificateFile?: string // Alternative field name for document URL
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
  sportsPassport?: string // Alternative field name for passport URL
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

// Adapter function to transform backend response to frontend format
const adaptInstructor = (data: any): Instructor => {
  console.log("Raw instructor data from API:", data)

  // Extract a valid profile image URL from profileImages array if available
  let profileImageUrl = data.profileImageUrl
  let profileImages: string[] = []

  // Process profile images array
  if (data.profileImages && data.profileImages.length > 0) {
    const validImages = data.profileImages.filter(
      (img: string) => img && typeof img === "string" && !img.includes("undefined"),
    )

    if (validImages.length > 0) {
      // Use the most recent one (assume it's the last in the array)
      profileImageUrl = validImages[validImages.length - 1]

      // Store all valid profile images with resolved URLs
      profileImages = validImages.map((img: string) => getImageUrl(img)).filter(Boolean) as string[]
    }
  } else if (profileImageUrl) {
    // If we have a single profile image but no array, create an array with just that image
    const resolved = getImageUrl(profileImageUrl)
    if (resolved) {
      profileImages = [resolved]
    }
  }

  // Résoudre l'URL de l'image de profil
  const resolvedProfileImageUrl = getImageUrl(profileImageUrl)

  // Handle the case where instructor data comes with a nested userId
  if (data.userId) {
    return {
      id: data._id,
      firstName: data.userId.firstName || "",
      lastName: data.userId.lastName || "",
      email: data.userId.email || "",
      phone: data.phone || "",
      address: data.address || "",
      bio: data.bio || "",
      specialties: data.specialties || [],
      yearsOfExperience: data.yearsOfExperience || 0,
      certifications: (data.certifications || []).map((cert: any) => ({
        ...cert,
        documentUrl: getImageUrl(cert.documentUrl || cert.certificateFile),
      })),
      profileImageUrl: resolvedProfileImageUrl,
      profileImages: profileImages,
      passportUrl: getImageUrl(data.sportsPassport || data.passportUrl),
    }
  }

  // Handle the case for standard format
  return {
    id: data._id || data.id,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    bio: data.bio || "",
    specialties: data.specialties || [],
    yearsOfExperience: data.yearsOfExperience || 0,
    certifications: (data.certifications || []).map((cert: any) => ({
      ...cert,
      documentUrl: getImageUrl(cert.documentUrl || cert.certificateFile),
    })),
    profileImageUrl: resolvedProfileImageUrl,
    profileImages: profileImages,
    passportUrl: getImageUrl(data.sportsPassport || data.passportUrl),
  }
}

// Helper function to safely open documents
const openDocument = async (url: string | undefined, errorToast: (message: string) => void): Promise<void> => {
  if (!url) {
    errorToast("L'URL du document est invalide")
    console.error("Document URL is undefined or null")
    return
  }

  console.log(`Attempting to open document: ${url}`)

  try {
    // First check if the document is accessible
    const response = await fetch(url, { method: "HEAD" })
    if (!response.ok) {
      errorToast(`Le document est inaccessible (${response.status})`)
      console.error(`Document not accessible (${response.status}): ${url}`)

      // Essayer une URL alternative si l'URL originale ne fonctionne pas
      const alternativeUrl = url.replace("/upload/documents/", "/documents/")
      console.log(`Trying alternative URL: ${alternativeUrl}`)

      const altResponse = await fetch(alternativeUrl, { method: "HEAD" })
      if (altResponse.ok) {
        console.log(`Alternative URL works, opening: ${alternativeUrl}`)
        window.open(alternativeUrl, "_blank")
        return
      } else {
        console.error(`Alternative URL also failed (${altResponse.status}): ${alternativeUrl}`)
      }

      return
    }

    // Open the document in a new tab
    console.log(`Document accessible, opening: ${url}`)
    window.open(url, "_blank")
  } catch (error) {
    errorToast("Erreur lors de l'accès au document")
    console.error("Error accessing document:", error)

    // Essayer une URL alternative en cas d'erreur
    try {
      const alternativeUrl = url.replace("/upload/documents/", "/documents/")
      console.log(`Error occurred, trying alternative URL: ${alternativeUrl}`)
      window.open(alternativeUrl, "_blank")
    } catch (altError) {
      console.error("Error with alternative URL as well:", altError)
    }
  }
}

class InstructorService {
  private baseUrl = "/instructors"

  async getAllInstructors(): Promise<Instructor[]> {
    const response = await api.get(this.baseUrl)
    return Array.isArray(response.data) ? response.data.map(adaptInstructor) : []
  }

  async getInstructorById(id: string): Promise<Instructor> {
    const response = await api.get(`${this.baseUrl}/${id}`)
    return adaptInstructor(response.data)
  }

  async getInstructorFullProfile(id: string): Promise<Instructor> {
    const response = await api.get(`${this.baseUrl}/${id}/full-profile`)
    return adaptInstructor(response.data)
  }

  async createInstructor(instructor: Omit<Instructor, "id">): Promise<Instructor> {
    const response = await api.post(this.baseUrl, instructor)
    return adaptInstructor(response.data)
  }

  async updateInstructor(id: string, updateData: InstructorUpdateDto): Promise<Instructor> {
    const response = await api.patch(`${this.baseUrl}/${id}`, updateData)
    return adaptInstructor(response.data)
  }

  async deleteInstructor(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`)
  }

  async addInstructorToSchool(schoolId: string, instructor: Omit<Instructor, "id">): Promise<Instructor> {
    const response = await api.post(`/schools/${schoolId}/instructors`, instructor)
    return adaptInstructor(response.data)
  }

  async assignInstructorToSchool(schoolId: string, instructorId: string): Promise<void> {
    await api.put(`/schools/${schoolId}/instructors/${instructorId}`)
  }

  async uploadProfileImage(id: string, imageFile: File): Promise<Instructor> {
    // Create FormData with the correct field name
    const formData = new FormData()

    // IMPORTANT: Use 'image' as the field name to match the backend controller
    formData.append("image", imageFile)

    console.log("Uploading profile image:", imageFile.name, imageFile.type, imageFile.size)

    try {
      const response = await api.post(`${this.baseUrl}/${id}/profile-image`, formData, {
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

  async uploadCertificate(
    id: string,
    certificateFile: File,
    certificateData: { name: string; issuingOrganization: string; issueDate: string },
  ): Promise<Instructor> {
    const formData = new FormData()

    // IMPORTANT: Use 'certificate' as the field name to match the backend controller
    formData.append("certificate", certificateFile)

    // Add metadata
    formData.append("name", certificateData.name)
    formData.append("issuingOrganization", certificateData.issuingOrganization)
    formData.append("issueDate", certificateData.issueDate)

    console.log("Uploading certificate:", certificateFile.name, certificateFile.type, certificateFile.size)

    try {
      const response = await api.post(`${this.baseUrl}/${id}/certificate`, formData, {
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

  async uploadSportPassport(id: string, passportFile: File): Promise<Instructor> {
    const formData = new FormData()

    // IMPORTANT: Use 'passport' as the field name to match the backend controller
    formData.append("passport", passportFile)

    console.log("Uploading sports passport:", passportFile.name, passportFile.type, passportFile.size)

    try {
      const response = await api.post(`${this.baseUrl}/${id}/sports-passport`, formData, {
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

  // Helper method to safely open documents
  openDocument(url: string | undefined, errorToast: (message: string) => void): Promise<void> {
    return openDocument(url, errorToast)
  }
}

export const instructorService = new InstructorService()
export { openDocument }

