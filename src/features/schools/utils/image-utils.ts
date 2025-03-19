import type React from "react";

export const API_BASE_URL = "http://localhost:3000";

/**
 * Constructs a full image URL from a relative path
 * @param imagePath - Relative image path (e.g., "/images/image-123.jpg")
 * @returns Full image URL
 */
export function getImageUrl(imagePath: string): string {
  if (!imagePath || imagePath.trim() === "") {
    return "/placeholder.svg?height=192&width=384";
  }
  
  // If URL is already complete (HTTP or HTTPS), return it directly
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  
  // Handle image paths - convert /images/filename to /upload/images/filename
  if (imagePath.startsWith("/images/")) {
    const filename = imagePath.split("/").pop();
    if (!filename) return "/placeholder.svg?height=192&width=384";
    
    return `${API_BASE_URL}/upload/images/${filename}`;
  }
  
  // Handle document paths - convert /documents/filename to /upload/documents/filename
  if (imagePath.startsWith("/documents/")) {
    const filename = imagePath.split("/").pop();
    if (!filename) return "/placeholder.svg?height=192&width=384";
    
    return `${API_BASE_URL}/upload/documents/${filename}`;
  }
  
  // For any other path format, try to extract the filename and make a best guess
  if (imagePath.startsWith("/")) {
    const parts = imagePath.split("/");
    const filename = parts.pop(); // Get the last segment (filename)
    const fileType = parts[1]; // Get the second segment (likely 'images' or 'documents')
    
    if (filename && (fileType === 'images' || fileType === 'documents')) {
      return `${API_BASE_URL}/upload/${fileType}/${filename}`;
    }
  }
  
  // Last resort - try to access the file directly (but this likely won't work)
  console.warn("Potentially invalid image path format:", imagePath);
  return `${API_BASE_URL}${imagePath}`;
}

/**
 * Handle image loading errors and set a placeholder image
 * @param e - Synthetic event of the image element
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>): void {
  const target = e.target as HTMLImageElement;
  console.log("Image failed to load:", target.src);
  target.onerror = null; // Prevent infinite loop if fallback image is not found
  target.src = "/placeholder.svg?height=192&width=384";
}