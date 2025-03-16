"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Course } from "../types/course.types"
import { courseService } from "../services/course.service"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Calendar, Users, School } from "lucide-react"

export function CourseListPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setIsLoading(true)
      const data = await courseService.getAllCourses()
      setCourses(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load courses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Courses</CardTitle>
        <Button onClick={() => navigate("/dashboard/courses/create")}>
          <Plus className="h-4 w-4 mr-2" />
          New Course
        </Button>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No courses found.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard/courses/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first course
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate(`/dashboard/courses/${course._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.description}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <School className="h-4 w-4 mr-2" />
                    School: {course.schoolId}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Capacity: {course.capacity || "Unlimited"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Sessions: {course.schedule.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

