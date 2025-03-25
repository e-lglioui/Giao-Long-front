"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { schoolAdminService } from "../services/school-admin.service"
import { useToast } from "@/components/ui/use-toast"
import { MapPin, Edit, Clock, Calendar, Upload, Image, Users, GraduationCap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { School } from "../types/school.types"

export function SchoolAdminMySchoolPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [school, setSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadSchool()
  }, [])

  const loadSchool = async () => {
    try {
      setIsLoading(true)
      const data = await schoolAdminService.getMySchool()
      setSchool(data)
    } catch (error: any) {
      if (error.statusCode === 404) {
        // No school yet, redirect to create form
        navigate("/dashboard/schools/my-school/create")
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load school",
          variant: "destructive",
        })
        navigate("/dashboard")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      await schoolAdminService.uploadImage(file)
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
      // Reload school data to get updated images
      loadSchool()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!school) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="mb-4">You don't have a school yet.</p>
        <Button asChild>
          <Link to="/dashboard/schools/my-school/create">Create School</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{school.name}</h2>
        <Button asChild variant="outline">
          <Link to="/dashboard/schools/my-school/edit">
            <Edit className="w-4 h-4 mr-2" />
            Edit School
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
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
                    src={school.images[0] || "/placeholder.svg"}
                    alt={school.name}
                    className="w-full h-64 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
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
                  {school.schedule?.openingTime || "N/A"} - {school.schedule?.closingTime || "N/A"}
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  {school.schedule?.operatingDays?.join(", ") || "No operating days specified"}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{school.description || "No description available."}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>School Images</CardTitle>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
                <Button asChild>
                  <Link to="/dashboard/schools/my-school/images/upload-multiple">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Multiple
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!school.images || school.images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Image className="w-16 h-16 mb-4" />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {school.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`School ${index + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructors">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Instructors</CardTitle>
              <Button asChild>
                <Link to="/dashboard/instructors/create">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Add Instructor
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {!school.instructors || school.instructors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <GraduationCap className="w-16 h-16 mb-4" />
                  <p>No instructors have been added yet</p>
                  <Button asChild className="mt-4">
                    <Link to="/dashboard/instructors/create">Add your first instructor</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {school.instructors.map((instructor) => (
                    <Card key={instructor._id} className="bg-primary/5 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {instructor.firstName} {instructor.lastName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">{instructor.email}</p>
                        <p className="text-sm text-gray-500">{instructor.specialization || "No specialization"}</p>
                        <div className="mt-4">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/dashboard/instructors/${instructor._id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Students</CardTitle>
              <Button asChild>
                <Link to="/dashboard/students/create">
                  <Users className="w-4 h-4 mr-2" />
                  Add Student
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {!school.students || school.students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mb-4" />
                  <p>No students have been added yet</p>
                  <Button asChild className="mt-4">
                    <Link to="/dashboard/students/create">Add your first student</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {school.students.map((student) => (
                    <Card key={student._id} className="bg-primary/5 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {student.firstName} {student.lastName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">{student.email}</p>
                        <div className="mt-4">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/dashboard/students/${student._id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

