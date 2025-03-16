"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type Enrollment, EnrollmentStatus } from "../types/enrollment.types"
import { enrollmentService } from "../services/enrollment.service"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Calendar, School, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface EnrollmentListProps {
  schoolId?: string
  studentId?: string
}

export function EnrollmentList({ schoolId, studentId }: EnrollmentListProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEnrollments()
  }, [])

  const loadEnrollments = async () => {
    try {
      setIsLoading(true)
      let data: Enrollment[] = []

      if (schoolId) {
        data = await enrollmentService.getEnrollmentsBySchool(schoolId)
      } else if (studentId) {
        data = await enrollmentService.getEnrollmentsByStudent(studentId)
      } else {
        data = await enrollmentService.getAllEnrollments()
      }

      setEnrollments(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load enrollments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeColor = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case EnrollmentStatus.ACTIVE:
        return "bg-green-100 text-green-800"
      case EnrollmentStatus.COMPLETED:
        return "bg-blue-100 text-blue-800"
      case EnrollmentStatus.CANCELLED:
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
        <CardTitle>Enrollments</CardTitle>
        {(schoolId || studentId) && (
          <Button onClick={() => navigate("/enrollments/new", { state: { schoolId, studentId } })}>
            <Plus className="h-4 w-4 mr-2" />
            New Enrollment
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {enrollments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No enrollments found.</p>
            {(schoolId || studentId) && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/enrollments/new", { state: { schoolId, studentId } })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first enrollment
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment._id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate(`/enrollments/${enrollment._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">
                      {enrollment.studentId.firstName} {enrollment.studentId.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{enrollment.studentId.email}</p>
                  </div>
                  <Badge className={getStatusBadgeColor(enrollment.status)}>{enrollment.status}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <School className="h-4 w-4 mr-2" />
                    {enrollment.schoolId.name}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(enrollment.enrollmentDate)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {enrollment.classes.length} classes
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

