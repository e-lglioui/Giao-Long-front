"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Plus, Minus } from "lucide-react"
import Checkbox from "@/components/ui/checkbox";
import { studentService } from "../services/student.service"

const studentSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  studentId: z.string().min(1, "L'ID étudiant est requis"),
  dateOfBirth: z.string().min(1, "La date de naissance est requise"),
  class: z.string().min(1, "La classe est requise"),
  isActive: z.boolean().default(true),
  courses: z.array(z.string()).optional(),
})

type StudentFormData = z.infer<typeof studentSchema>

export function CreateStudentPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courses, setCourses] = useState<string[]>([])
  const [newCourse, setNewCourse] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      studentId: "",
      dateOfBirth: "",
      class: "",
      isActive: true,
      courses: [],
    },
  })

  const addCourse = () => {
    if (newCourse.trim() !== "" && !courses.includes(newCourse.trim())) {
      setCourses([...courses, newCourse.trim()])
      setNewCourse("")
    }
  }

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: StudentFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Include courses in the data
      data.courses = courses

      // Use the service to create the student
      await studentService.createStudent(data)

      toast({
        title: "Élève créé",
        description: "Le nouvel élève a été créé avec succès.",
        variant: "default",
      })

      navigate("/dashboard/students")
    } catch (err) {
      console.error("Failed to create student:", err)
      setError(err instanceof Error ? err.message : "Impossible de créer l'élève")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard/students")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Ajouter un nouvel élève</h1>
      </div>

      <Card className="w-full bg-white border-2 border-orange-200 rounded-lg shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
            Informations de l'élève
          </CardTitle>
          <p className="text-gray-600 text-sm">Remplissez les informations pour créer un nouvel élève</p>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-50 border border-red-300">
              <AlertDescription className="text-red-600">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700">
                  Prénom
                </Label>
                <Input
                  {...register("firstName")}
                  id="firstName"
                  placeholder="Prénom de l'élève"
                  className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700">
                  Nom
                </Label>
                <Input
                  {...register("lastName")}
                  id="lastName"
                  placeholder="Nom de l'élève"
                  className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId" className="text-gray-700">
                  ID Étudiant
                </Label>
                <Input
                  {...register("studentId")}
                  id="studentId"
                  placeholder="KF001"
                  className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                />
                {errors.studentId && <p className="text-sm text-red-500">{errors.studentId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-gray-700">
                  Date de naissance
                </Label>
                <Input
                  {...register("dateOfBirth")}
                  id="dateOfBirth"
                  type="date"
                  className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                />
                {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="class" className="text-gray-700">
                  Classe
                </Label>
                <Input
                  {...register("class")}
                  id="class"
                  placeholder="Ex: Wing Chun Débutant"
                  className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                />
                {errors.class && <p className="text-sm text-red-500">{errors.class.message}</p>}
              </div>

              <div className="space-y-2 flex items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox id="isActive" {...register("isActive")} defaultChecked={true} />
                  <Label htmlFor="isActive" className="text-gray-700">
                    Élève actif
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-gray-700">Cours</Label>

              <div className="flex gap-2">
                <Input
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  placeholder="Ajouter un cours"
                  className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                />
                <Button
                  type="button"
                  onClick={addCourse}
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {courses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span>{course}</span>
                    <Button
                      type="button"
                      onClick={() => removeCourse(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {courses.length === 0 && <p className="text-gray-500 text-sm italic">Aucun cours ajouté</p>}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/students")}>
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 text-white font-semibold py-2 transition-all duration-300 shadow-md shadow-orange-200 hover:shadow-orange-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span className="ml-2">Création...</span>
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Créer l'élève
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}