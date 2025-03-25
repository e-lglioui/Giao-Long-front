"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserCog, GraduationCap, Upload, Image, Edit, Plus, School } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCard } from "../StatsCard"
import { schoolAdminService } from "../../schools/services/school-admin.service"
import { useToast } from "@/components/ui/use-toast"
import type { School as SchoolType } from "../../schools/types/school.types"

const SchoolAdminDashboard = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [school, setSchool] = useState<SchoolType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true)
        const schoolData = await schoolAdminService.getMySchool()
        setSchool(schoolData)
        setError(null)
      } catch (err: any) {
        if (err.statusCode === 404) {
          // No school yet, that's okay
          setSchool(null)
        } else {
          setError("Failed to load school data")
          toast({
            title: "Error",
            description: err.message || "Failed to load school data",
            variant: "destructive",
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSchool()
  }, [toast])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const updatedSchool = await schoolAdminService.uploadImage(file)
      setSchool(updatedSchool)
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If no school exists yet, show create school button
  if (!school) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">School Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.username}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your School</CardTitle>
            <CardDescription>
              You haven't created a school yet. As a school admin, you can create one school to manage.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <School className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-center mb-6">
              Start by creating your Kung Fu school to manage instructors, students, and classes.
            </p>
            <Button asChild>
              <Link to="/dashboard/schools/my-school/create">
                <Plus className="mr-2 h-4 w-4" />
                Create School
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/dashboard/schools/my-school/edit">
              <Edit className="mr-2 h-4 w-4" />
              Edit School
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/instructors/create">
              <UserCog className="mr-2 h-4 w-4" />
              Add Instructor
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{school.name}</CardTitle>
              <CardDescription>{school.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">School Details</h3>
                  <p>
                    <strong>Contact:</strong> {school.contactNumber || "Not specified"}
                  </p>
                  <p>
                    <strong>Maximum Students:</strong> {school.maxStudents || "Not specified"}
                  </p>
                  <p>
                    <strong>Hours:</strong> {school.schedule?.openingTime || "08:00"} -{" "}
                    {school.schedule?.closingTime || "16:00"}
                  </p>
                  <p>
                    <strong>Operating Days:</strong> {school.schedule?.operatingDays?.join(", ") || "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Description</h3>
                  <p>{school.description || "No description available."}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button asChild variant="outline">
                <Link to="/dashboard/schools/my-school/edit">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit School
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Instructors"
              metric={school.instructors?.length || 0}
              icon={<GraduationCap className="h-5 w-5" />}
              progress={70}
              target="Capacity"
            />
            <StatsCard
              title="Students"
              metric={school.students?.length || 0}
              icon={<Users className="h-5 w-5" />}
              progress={90}
              target="Capacity"
            />
            <StatsCard
              title="Images"
              metric={school.images?.length || 0}
              icon={<Image className="h-5 w-5" />}
              progress={65}
              target="Capacity"
            />
          </div>
        </TabsContent>

        <TabsContent value="instructors" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Instructors Management</CardTitle>
              <Button asChild>
                <Link to="/dashboard/instructors/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Instructor
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {school.instructors && school.instructors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {school.instructors.map((instructor) => (
                    <Card key={instructor._id} className="bg-primary/5 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {instructor.firstName} {instructor.lastName}
                        </CardTitle>
                        <CardDescription>{instructor.email}</CardDescription>
                      </CardHeader>
                      <CardContent>
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
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <GraduationCap className="w-16 h-16 mb-4" />
                  <p>No instructors added yet</p>
                  <Button asChild className="mt-4">
                    <Link to="/dashboard/instructors/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Instructor
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Students Management</CardTitle>
              <Button asChild>
                <Link to="/dashboard/students/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Student
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {school.students && school.students.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {school.students.map((student) => (
                    <Card key={student._id} className="bg-primary/5 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {student.firstName} {student.lastName}
                        </CardTitle>
                        <CardDescription>{student.email}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mt-4">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/dashboard/students/${student._id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mb-4" />
                  <p>No students added yet</p>
                  <Button asChild className="mt-4">
                    <Link to="/dashboard/students/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Student
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>School Images</CardTitle>
              <div className="flex gap-2">
                <Button asChild variant="outline" disabled={uploadingImage}>
                  <label className="cursor-pointer flex items-center">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </Button>
                <Button asChild>
                  <Link to="/dashboard/schools/my-school/images/upload-multiple">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Multiple
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {school.images && school.images.length > 0 ? (
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
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Image className="w-16 h-16 mb-4" />
                  <p>No images uploaded yet</p>
                  <Button asChild variant="outline" className="mt-4" disabled={uploadingImage}>
                    <label className="cursor-pointer flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Your First Image
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SchoolAdminDashboard

