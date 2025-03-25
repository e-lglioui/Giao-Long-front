"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { School, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { schoolAdminService } from "../services/school-admin.service"
import { useToast } from "@/components/ui/use-toast"

export function MySchoolCheck() {
  const [hasSchool, setHasSchool] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const checkSchool = async () => {
      try {
        setLoading(true)
        await schoolAdminService.getMySchool()
        setHasSchool(true)
      } catch (err: any) {
        if (err.statusCode === 404) {
          // No school yet
          setHasSchool(false)
        } else {
          toast({
            title: "Error",
            description: err.message || "Failed to check school status",
            variant: "destructive",
          })
        }
      } finally {
        setLoading(false)
      }
    }

    checkSchool()
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (hasSchool === false) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Your School</CardTitle>
          <CardDescription>
            You haven't created a school yet. As a school admin, you can create one school to manage.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <School className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-center mb-6">
            Start by creating your school to manage instructors, students, and classes.
          </p>
          <Button asChild>
            <Link to="/dashboard/schools/my-school/create">
              <Plus className="mr-2 h-4 w-4" />
              Create School
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}

