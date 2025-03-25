"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { InstructorForm } from "../components/instructor-form"
import { schoolAdminService } from "@/features/schools/services/school-admin.service"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function CreateInstructorPage() {
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setIsLoading(true)
        const school = await schoolAdminService.getMySchool()
        setSchoolId(school._id)
      } catch (err: any) {
        console.error("Error fetching school:", err)
        setError(err.message || "Impossible de récupérer les informations de votre école")

        // Si l'utilisateur n'a pas d'école, rediriger vers la page de création d'école
        if (err.statusCode === 404) {
          toast({
            title: "Aucune école trouvée",
            description: "Vous devez d'abord créer une école avant d'ajouter des instructeurs",
            variant: "destructive",
          })
          navigate("/dashboard/schools/my-school/create")
        } else {
          toast({
            title: "Erreur",
            description: err.message || "Une erreur est survenue lors de la récupération de votre école",
            variant: "destructive",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchool()
  }, [navigate, toast])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error && !schoolId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Erreur</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <InstructorForm schoolId={schoolId || undefined} />
}

