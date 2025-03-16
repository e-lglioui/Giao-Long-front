import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { schoolService } from "../services/school.service"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  schoolId: string
  onImageAdded: () => void
}

export function ImageUpload({ schoolId, onImageAdded }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      await schoolService.addImage(schoolId, imageUrl)
      toast({
        title: "Success",
        description: "Image added successfully",
      })
      setImageUrl("")
      onImageAdded()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add image",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2">
        <Input 
          type="text" 
          placeholder="Enter image URL" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <Upload className="w-4 h-4 mr-2" />
          {isLoading ? "Adding..." : "Add Image"}
        </Button>
      </div>
    </form>
  )
}