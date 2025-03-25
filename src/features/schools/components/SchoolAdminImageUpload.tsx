"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { schoolAdminService } from "../services/school-admin.service"
import { Upload, X } from "lucide-react"

export function SchoolAdminImageUpload() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])

      // Create preview URLs
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removeFile = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index])

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one image to upload",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Create a FileList-like object
      const dataTransfer = new DataTransfer()
      selectedFiles.forEach((file) => {
        dataTransfer.items.add(file)
      })

      await schoolAdminService.uploadMultipleImages(dataTransfer.files)

      toast({
        title: "Success",
        description: `${selectedFiles.length} images uploaded successfully`,
      })

      // Clean up preview URLs
      previewUrls.forEach((url) => URL.revokeObjectURL(url))

      navigate("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Multiple Images</CardTitle>
        <CardDescription>Select multiple images to upload to your school</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
              >
                <span>Upload files</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB each</p>
          </div>

          {previewUrls.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Selected images</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square w-full overflow-hidden rounded-lg">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="mt-1 text-xs text-gray-500 truncate">{selectedFiles[index].name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={isLoading || selectedFiles.length === 0}>
          {isLoading ? "Uploading..." : "Upload Images"}
        </Button>
      </CardFooter>
    </Card>
  )
}

