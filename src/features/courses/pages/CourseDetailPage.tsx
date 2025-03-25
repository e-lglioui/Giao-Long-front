"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Course } from "../types/course.types"
import { courseService } from "../services/course.service"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2, Users, Calendar, School } from "lucide-react"

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadCourse()
    }
  }, [id])

  const loadCourse = async () => {
    try {
      setIsLoading(true)
      const data = await courseService.getCourseById(id!)
      setCourse(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load course",
        variant: "destructive",
      })
      navigate("/dashboard/courses")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return
    }

    try {
      await courseService.deleteCourse(id!)
      toast({
        title: "Success",
        description: "Course deleted successfully",
      })
      navigate("/dashboard/courses")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete course",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{course.title}</CardTitle>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate(`/dashboard/courses/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-600">{course.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <School className="h-4 w-4 mr-2" />
            School: {course.schoolId}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            Instructor: {course.instructorId}
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

        <div>
          <h3 className="font-semibold mb-2">Schedule</h3>
          <div className="space-y-2">
            {course.schedule.map((session, index) => (
              <div key={index} className="flex items-center justify-between border p-2 rounded">
                <span>{new Date(session.date).toLocaleDateString()}</span>
                <span>
                  {session.startTime} - {session.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Participants</h3>
          <p className="text-gray-600">{course.participants.length} enrolled</p>
          {/* You can add a list of participants here if needed */}
        </div>
      </CardContent>
    </Card>
  )
}

