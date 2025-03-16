import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Plus, X, Upload } from "lucide-react"
import api from "@/services/api"

interface MultipleImageUploadProps {
  schoolId: string
  onImagesAdded: () => void
}

export function MultipleImageUpload({ schoolId, onImagesAdded }: MultipleImageUploadProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([""]) 
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const addImageField = () => {
    setImageUrls([...imageUrls, ""])
  }

  const removeImageField = (index: number) => {
    const newImageUrls = [...imageUrls]
    newImageUrls.splice(index, 1)
    setImageUrls(newImageUrls.length ? newImageUrls : [""])
  }

  const updateImageUrl = (index: number, value: string) => {
    const newImageUrls = [...imageUrls]
    newImageUrls[index] = value
    setImageUrls(newImageUrls)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validImageUrls = imageUrls.filter(url => url.trim() !== "")
    
    if (validImageUrls.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one image URL",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      await api.post(`http://localhost:3000/schools/${schoolId}/multiple-images`, { 
        imageUrls: validImageUrls 
      })
      
      toast({
        title: "Success",
        description: "Images added successfully",
      })
      setImageUrls([""])
      onImagesAdded()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add images",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {imageUrls.map((url, index) => (
        <div key={index} className="flex space-x-2">
          <Input 
            type="text" 
            placeholder="Enter image URL" 
            value={url} 
            onChange={(e) => updateImageUrl(index, e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          {imageUrls.length > 1 && (
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={() => removeImageField(index)}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={addImageField}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Image
        </Button>
        
        <Button type="submit" disabled={isLoading}>
          <Upload className="w-4 h-4 mr-2" />
          {isLoading ? "Uploading..." : "Upload Images"}
        </Button>
      </div>
    </form>
  )
}