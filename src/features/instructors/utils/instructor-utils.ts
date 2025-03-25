import type React from "react"

export const API_BASE_URL = "http://localhost:3000"



/**
 * Utility function to handle image URLs
 * @param imagePath - The path to the image
 * @returns The full URL to the image
 */
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
    if (filename.startsWith("image-") || filename.startsWith("school-instructor-image-")) {
      return `${API_BASE_URL}/upload/images/${filename}`
    }

    // Document files (certificates, passports)
    if (
      filename.startsWith("certificate-") ||
      filename.startsWith("passport-") ||
      filename.startsWith("document-") ||
      filename.startsWith("school-instructor-certificate-") ||
      filename.startsWith("school-instructor-passport-")
    ) {
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

// ===== DOCUMENT UTILITIES =====

/**
 * Helper function to safely open documents
 * @param url - The URL of the document to open
 * @param errorToast - A function to display error messages
 */
export const openDocument = async (url: string | undefined, errorToast: (message: string) => void): Promise<void> => {
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

// ===== DATA ADAPTER UTILITIES =====

/**
 * Adapter function to transform backend response to frontend format
 * @param data - The raw data from the API
 * @returns A formatted Instructor object
 */
export const adaptInstructor = (data: any): any => {
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

