import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Trash2 } from "lucide-react"
import api from "@/services/api"

interface ImageGalleryProps {
  schoolId: string
  images: string[]
  onImageDeleted: () => void
}

export function ImageGallery({ schoolId, images, onImageDeleted }: ImageGalleryProps) {
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const handleDeleteImage = async (imageUrl: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return
    }
    
    setIsDeleting(prev => ({ ...prev, [imageUrl]: true }))
    
    try {
      await api.delete(`http://localhost:3000/schools/${schoolId}/images`, {
        data: { imageUrl }
      })
      
      toast({
        title: "Success",
        description: "Image deleted successfully",
      })
      onImageDeleted()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete image",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(prev => ({ ...prev, [imageUrl]: false }))
    }
  }
  
  if (images.length === 0) {
    return <p className="text-gray-500 italic">No images available</p>
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <img 
            src={imageUrl} 
            alt={`School view ${index + 1}`} 
            className="w-full h-48 object-cover rounded-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "../../../assets/placeholder-image.png";
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleDeleteImage(imageUrl)}
              disabled={isDeleting[imageUrl]}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting[imageUrl] ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}