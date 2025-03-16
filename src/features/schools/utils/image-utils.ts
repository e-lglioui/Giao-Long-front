import type React from "react"
export const API_BASE_URL =  "http://localhost:3000"

/**
 * Constructs a full image URL from a relative path
 * @param imagePath - Relative image path (e.g., "/images/image-123.jpg")
 * @returns Full image URL
 */
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return "/placeholder.svg?height=192&width=384"

  
  if (imagePath.startsWith("http")) return imagePath

  if (imagePath.startsWith("/images/")) {
    
    const filename = imagePath.split("/").pop()
 
    return `${API_BASE_URL}/upload/images/${filename}`
  }


  return `${API_BASE_URL}${imagePath}`
}


export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>): void {
  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=192&width=384"
}

