"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, Save, Trash, BookOpen, BarChart } from "lucide-react"
import { Student}  from "../types/student.types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { studentService} from "../services/student.service" // Import the student service

const studentSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  studentId: z.string().min(1, "L'ID étudiant est requis"),
  dateOfBirth: z.string().min(1, "La date de naissance est requise"),
  class: z.string().min(1, "La classe est requise"),
  isActive: z.boolean(),
  courses: z.array(z.string()).optional(),
})

type StudentFormData = z.infer<typeof studentSchema>

// Helper function to transform API student format to component student format
const transformStudentData = (apiStudent: Student): any => {
  // Convert the grades array to a Record<string, number> format
  const gradesRecord: Record<string, number> = {};
  if (apiStudent.grades) {
    apiStudent.grades.forEach(gradeItem => {
      gradesRecord[gradeItem.course] = gradeItem.grade;
    });
  }

  return {
    _id: apiStudent.id,
    firstName: apiStudent.firstName,
    lastName: apiStudent.lastName,
    studentId: apiStudent.studentId,
    dateOfBirth: apiStudent.dateOfBirth,
    class: apiStudent.class,
    isActive: apiStudent.isActive,
    courses: apiStudent.courses || [],
    grades: gradesRecord
  };
}

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [student, setStudent] = useState<any | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (id) {
      fetchStudent(id)
    }
  }, [id])

  const fetchStudent = async (studentId: string) => {
    setIsLoading(true)
    try {
      const apiStudent = await studentService.getStudentById(studentId);
      const transformedStudent = transformStudentData(apiStudent);
      
      setStudent(transformedStudent);
      reset({
        firstName: transformedStudent.firstName,
        lastName: transformedStudent.lastName,
        studentId: transformedStudent.studentId,
        dateOfBirth: transformedStudent.dateOfBirth,
        class: transformedStudent.class,
        isActive: transformedStudent.isActive,
        courses: transformedStudent.courses,
      });
    } catch (err) {
      console.error("Failed to fetch student:", err)
      setError("Impossible de charger les données de l'élève")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: StudentFormData) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      
      // Update via the student service
      await studentService.updateStudent(id, {
        firstName: data.firstName,
        lastName: data.lastName,
        studentId: data.studentId,
        dateOfBirth: data.dateOfBirth,
        class: data.class,
        isActive: data.isActive,
        courses: data.courses
      });
      
      // Fetch the updated student data
      await fetchStudent(id);
      setIsEditing(false);
      
      toast({
        title: "Élève mis à jour",
        description: "Les informations ont été mises à jour avec succès.",
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to update student:", err);
      setError("Impossible de mettre à jour l'élève");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteStudent = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      await studentService.deleteStudent(id);
      
      toast({
        title: "Élève supprimé",
        description: "L'élève a été supprimé avec succès.",
        variant: "default",
      });

      navigate("/dashboard/students");
    } catch (err) {
      console.error("Failed to delete student:", err);
      setError("Impossible de supprimer l'élève");
      setIsLoading(false);
    }
  }

  const handleAddGrade = async (course: string, grade: number) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      await studentService.addGrade(id, course, grade);
      
      // Refresh student data
      await fetchStudent(id);
      
      toast({
        title: "Note ajoutée",
        description: "La note a été ajoutée avec succès.",
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to add grade:", err);
      setError("Impossible d'ajouter la note");
    } finally {
      setIsLoading(false);
    }
  }

  const getAverageGrade = (): number => {
    if (!student) return 0;
    const values = Object.values(student.grades);
    if (values.length === 0) return 0;
    return values.reduce((sum: number, grade: number) => sum + grade, 0) / values.length;
  }

  if (isLoading && !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex-1 p-6">
        <Alert variant="destructive" className="mb-6 bg-red-50 border border-red-300">
          <AlertDescription className="text-red-600">
            Élève non trouvé.{" "}
            <Button variant="link" onClick={() => navigate("/dashboard/students")}>
              Retour à la liste
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard/students")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Détails de l'élève</h1>
      </div>

      <Card className="w-full bg-white border-2 border-orange-200 rounded-lg shadow-md">
        <CardHeader className="space-y-2 relative">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              {student.firstName} {student.lastName}
            </CardTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Supprimer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                          Êtes-vous sûr de vouloir supprimer cet élève ? Cette action est irréversible.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteStudent} disabled={isLoading}>
                          {isLoading ? "Suppression..." : "Supprimer"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    setIsEditing(false)
                    if (student)
                      reset({
                        firstName: student.firstName,
                        lastName: student.lastName,
                        studentId: student.studentId,
                        dateOfBirth: student.dateOfBirth,
                        class: student.class,
                        isActive: student.isActive,
                        courses: student.courses,
                      })
                  }}
                >
                  Annuler
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Badge className={`${student.isActive ? "bg-green-500" : "bg-gray-500"} text-white`}>
              {student.isActive ? "Actif" : "Inactif"}
            </Badge>
            <span className="ml-4 text-gray-600">ID: {student.studentId}</span>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-50 border border-red-300">
              <AlertDescription className="text-red-600">{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 bg-gray-100">
              <TabsTrigger value="info" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Informations
              </TabsTrigger>
              <TabsTrigger value="grades" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Notes
              </TabsTrigger>
              <TabsTrigger value="courses" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Cours
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="relative group">
                    <Avatar className="h-40 w-40 border-4 border-orange-300 shadow-lg shadow-orange-100">
                      <AvatarImage src={`/placeholder.svg?height=160&width=160`} alt="Photo de l'élève" />
                      <AvatarFallback className="bg-orange-100 text-5xl text-orange-700">
                        {student.firstName.charAt(0)}
                        {student.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-bold text-gray-800">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-orange-600">{student.studentId}</p>
                    <Badge className="mt-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                      {student.class}
                    </Badge>
                  </div>

                  <div className="mt-6 w-full">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Statistiques</h4>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Note moyenne:</span>
                        <span className="font-bold text-gray-800">{getAverageGrade().toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Cours suivis:</span>
                        <span className="font-bold text-gray-800">{student.courses.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Statut:</span>
                        <span className="font-bold text-gray-800">{student.isActive ? "Actif" : "Inactif"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700">
                          Prénom
                        </Label>
                        <Input
                          {...register("firstName")}
                          id="firstName"
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
                          className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                        />
                        {errors.class && <p className="text-sm text-red-500">{errors.class.message}</p>}
                      </div>

                      <div className="space-y-2 flex items-center">
                        <Label htmlFor="isActive" className="text-gray-700 mr-4">
                          Statut
                        </Label>
                        <div className="flex items-center">
                          <input
                            {...register("isActive")}
                            id="isActive"
                            type="checkbox"
                            disabled={!isEditing}
                            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <Label htmlFor="isActive" className="ml-2 text-gray-700">
                            Actif
                          </Label>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 text-white font-semibold py-2 transition-all duration-300 shadow-md shadow-orange-200 hover:shadow-orange-300"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            <span className="ml-2">Sauvegarde...</span>
                          </div>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    )}
                  </form>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="grades">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">Notes</h3>
                  {isEditing && (
                    <Button 
                      variant="outline" 
                      className="border-orange-500 text-orange-600 hover:bg-orange-50"
                      onClick={() => {
                        // You would typically open a dialog or form here to add a grade
                        // For this example, let's assume we're adding a hardcoded grade
                        const course = prompt("Entrez le nom du cours");
                        const grade = prompt("Entrez la note");
                        if (course && grade && !isNaN(Number(grade))) {
                          handleAddGrade(course, Number(grade));
                        }
                      }}
                    >
                      Ajouter une note
                    </Button>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Moyenne générale</h4>
                      <p className="text-gray-500">Performance globale de l'élève</p>
                    </div>
                    <div className="text-3xl font-bold text-orange-600">{getAverageGrade().toFixed(1)}</div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(student.grades).map(([course, grade]) => (
                      <div key={course} className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div>
                          <h5 className="font-medium text-gray-800">{course}</h5>
                          <p className="text-sm text-gray-500">Cours</p>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              Number(grade) >= 90
                                ? "bg-green-100 text-green-700"
                                : Number(grade) >= 80
                                  ? "bg-blue-100 text-blue-700"
                                  : Number(grade) >= 70
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                          >
                            {grade}
                          </div>
                          {isEditing && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2"
                              onClick={() => {
                                const newGrade = prompt(`Modifier la note pour ${course}`, String(grade));
                                if (newGrade && !isNaN(Number(newGrade))) {
                                  handleAddGrade(course, Number(newGrade));
                                }
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {Object.keys(student.grades).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <BarChart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p>Aucune note enregistrée</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">Cours</h3>
                  {isEditing && (
                    <Button 
                      variant="outline" 
                      className="border-orange-500 text-orange-600 hover:bg-orange-50"
                      onClick={() => {
                        const course = prompt("Entrez le nom du cours à ajouter");
                        if (course && student) {
                          const updatedCourses = [...student.courses, course];
                          if (id) {
                            studentService.updateStudent(id, { courses: updatedCourses })
                              .then(() => fetchStudent(id))
                              .catch(err => {
                                console.error("Failed to add course:", err);
                                setError("Impossible d'ajouter le cours");
                              });
                          }
                        }
                      }}
                    >
                      Ajouter un cours
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {student.courses.map((course: string) => (
                    <motion.div
                      key={course}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center mb-4">
                        <BookOpen className="h-6 w-6 text-orange-500 mr-2" />
                        <h4 className="text-gray-800 font-medium">{course}</h4>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-4xl font-bold text-gray-800">
                          {student.grades[course] ? student.grades[course] : "-"}
                        </div>
                        <div className="text-sm text-gray-500">Note</div>
                      </div>
                      {isEditing && (
                        <div className="mt-4 flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => {
                              if (student && id) {
                                const updatedCourses = student.courses.filter((c: string) => c !== course);
                                studentService.updateStudent(id, { courses: updatedCourses })
                                  .then(() => fetchStudent(id))
                                  .catch(err => {
                                    console.error("Failed to remove course:", err);
                                    setError("Impossible de supprimer le cours");
                                  });
                              }
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Retirer
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {student.courses.length === 0 && (
                    <div className="text-center py-8 text-gray-500 col-span-2">
                      <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p>Aucun cours enregistré</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}