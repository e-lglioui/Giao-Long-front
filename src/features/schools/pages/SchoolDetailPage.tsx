"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { School } from "../types/school.types"
import { schoolService } from "../services/school.service"
import { useToast } from "@/components/ui/use-toast"
import { MapPin, Edit, Trash2, Clock, Calendar, Upload, Image as ImageIcon } from "lucide-react"
import { ManageMembersForm } from "../components/ManageMembersForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SchoolScheduleForm } from "../components/SchoolScheduleForm"
import { ClassList } from "../../class/components/ClassList"
import { ImageGallery } from "../components/ImageGallery"
import api from "@/services/api"

export function SchoolDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [school, setSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (id) {
      loadSchool()
    }
  }, [id])

  const loadSchool = async () => {
    try {
      setIsLoading(true)
      const data = await schoolService.getSchoolById(id!)
      setSchool(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load school",
        variant: "destructive",
      })
      navigate("dashboard/schools")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this school?")) {
      return
    }

    try {
      await schoolService.deleteSchool(id!)
      toast({
        title: "Success",
        description: "School deleted successfully",
      })
      navigate("dashboard/schools")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete school",
        variant: "destructive",
      })
    }
  }

  // const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files
  //   if (!files || files.length === 0) return

  //   setIsUploading(true)
  //   const formData = new FormData()
    
  //   // Append all selected files
  //   for (let i = 0; i < files.length; i++) {
  //     formData.append('images', files[i])
  //   }

  //   try {
  //     await api.post(`http://localhost:3000/schools/${id}/images`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     })
      
  //     toast({
  //       title: "Success",
  //       description: `${files.length > 1 ? 'Images' : 'Image'} uploaded successfully`,
  //     })
      
  //     // Reload school data to get updated images
  //     loadSchool()
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.response?.data?.message || "Failed to upload images",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsUploading(false)
  //     // Clear the file input
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = ''
  //     }
  //   }
  // }
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
  
    setIsUploading(true)
    
    try {
      if (files.length === 1) {
        await schoolService.uploadSingleImage(id!, files[0])
      } else {
        await schoolService.uploadMultipleImages(id!, files)
      }
      
      toast({
        title: "Success",
        description: `${files.length > 1 ? 'Images' : 'Image'} uploaded successfully`,
      })
      
      // Reload school data to get updated images
      loadSchool()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleImageDeleted = () => {
    // Reload school data to get updated images list
    loadSchool()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!school) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{school.name}</h2>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate(`/schools/${id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Featured image (if available) */}
              {school.images && school.images.length > 0 && (
                <div className="mb-6">
                  <img 
                    src={school.images[0]} 
                    alt={school.name} 
                    className="w-full h-64 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "../../../assets/placeholder-image.png";
                    }}
                  />
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {school.address}
                </p>
              </div>

              {school.contactNumber && (
                <div>
                  <h3 className="font-semibold mb-2">Contact</h3>
                  <p className="text-gray-600">{school.contactNumber}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Operating Hours</h3>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {school.schedule?.openingTime || 'N/A'} - {school.schedule?.closingTime || 'N/A'}
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  {school.schedule?.operatingDays?.join(", ") || 'No operating days specified'}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Students</div>
                      <div className="text-2xl font-bold">{school.dashboard.studentCount}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Revenue</div>
                      <div className="text-2xl font-bold">${school.dashboard.revenue}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>School Images</CardTitle>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Images"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(!school.images || school.images.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <ImageIcon className="w-16 h-16 mb-4" />
                  <p>No images have been uploaded yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload your first image
                  </Button>
                </div>
              ) : (
                <ImageGallery 
                  schoolId={school._id} 
                  images={school.images} 
                  onImageDeleted={handleImageDeleted}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <ManageMembersForm school={school} onUpdate={loadSchool} />
        </TabsContent>

        <TabsContent value="schedule">
          <SchoolScheduleForm school={school} onUpdate={loadSchool} />
        </TabsContent>

        <TabsContent value="classes">
          <ClassList schoolId={school._id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}