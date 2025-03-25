"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type Class, ClassStatus } from "../types/class.types"
import { classService } from "../services/class.service"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Calendar, Clock, Users, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface ClassListProps {
  schoolId?: string
  instructorId?: string
  studentId?: string
}

export function ClassList({ schoolId, instructorId, studentId }: ClassListProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      setIsLoading(true)
      let data: Class[] = []

      if (schoolId) {
        data = await classService.getClassesBySchool(schoolId)
      } else if (instructorId) {
        data = await classService.getClassesByInstructor(instructorId)
      } else if (studentId) {
        data = await classService.getClassesByStudent(studentId)
      } else {
        data = await classService.getAllClasses()
      }

      setClasses(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load classes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeColor = (status: ClassStatus) => {
    switch (status) {
      case ClassStatus.SCHEDULED:
        return "bg-blue-100 text-blue-800"
      case ClassStatus.IN_PROGRESS:
        return "bg-green-100 text-green-800"
      case ClassStatus.COMPLETED:
        return "bg-gray-100 text-gray-800"
      case ClassStatus.CANCELLED:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP")
    } catch (error) {
      return dateString
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
        <CardTitle>Classes</CardTitle>
        {schoolId && (
          <Button onClick={() => navigate(`/schools/${schoolId}/classes/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            New Class
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {classes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No classes found.</p>
            {schoolId && (
              <Button variant="outline" className="mt-4" onClick={() => navigate(`/schools/${schoolId}/classes/new`)}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first class
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map((classItem) => (
              <div
                key={classItem._id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate(`/classes/${classItem._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{classItem.title}</h3>
                    <p className="text-sm text-gray-500">{classItem.courseId.title}</p>
                  </div>
                  <Badge className={getStatusBadgeColor(classItem.status)}>{classItem.status}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(classItem.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {classItem.startTime} - {classItem.endTime}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {classItem.currentEnrollment} / {classItem.maxCapacity} students
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {classItem.level} level
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

