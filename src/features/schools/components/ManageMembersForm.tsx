"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { schoolService } from "../services/school.service"
import { studentService } from "../../students/services/student.service"
import type { School } from "../types/school.types"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { UserPlus, UserMinus, Plus, Minus } from "lucide-react"
import  Checkbox  from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const studentSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  studentId: z.string().min(1, "L'ID étudiant est requis"),
  dateOfBirth: z.string().min(1, "La date de naissance est requise"),
  class: z.string().min(1, "La classe est requise"),
  isActive: z.boolean().default(true),
  courses: z.array(z.string()).optional(),
  userId: z.string().optional(), // Optional for manual user creation
})

type StudentFormData = z.infer<typeof studentSchema>

interface ManageMembersFormProps {
  school: School
  onUpdate: () => void
}

export function ManageMembersForm({ school, onUpdate }: ManageMembersFormProps) {
  const [activeTab, setActiveTab] = useState("instructors")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [courses, setCourses] = useState<string[]>([])
  const [newCourse, setNewCourse] = useState("")

  const form = useForm<StudentFormData>({
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
      
      if (activeTab === "instructors") {
        // Add instructor logic
        await schoolService.addInstructor(school._id, data.userId!)
        toast({
          title: "Succès",
          description: "Instructeur ajouté avec succès",
        })
      } else {
        // Add student logic with full student creation
        const studentData = {
          ...data,
          courses,
          school: school._id, // Add school reference
        }

        await studentService.createStudent(studentData)
        
        toast({
          title: "Succès",
          description: "Étudiant créé et ajouté à l'école",
        })
      }

      // Reset form and state
      form.reset()
      setCourses([])
      onUpdate()
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec de l'ajout",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gérer les membres</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="instructors">Instructeurs</TabsTrigger>
            <TabsTrigger value="students">Étudiants</TabsTrigger>
          </TabsList>

          <TabsContent value="instructors">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Instructeur</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input placeholder="Entrer l'ID de l'instructeur" {...field} />
                        </FormControl>
                        <Button type="submit" disabled={isLoading}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          {isLoading ? "Ajout..." : "Ajouter"}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <div className="mt-6">
              <h4 className="font-medium mb-4">Instructeurs actuels</h4>
              <div className="space-y-2">
                {school.instructors && school.instructors.length > 0 ? (
                  school.instructors.map((instructor) => (
                    <div key={instructor._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{instructor.username}</div>
                        <div className="text-sm text-gray-500">{instructor.email}</div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          /* Handle remove instructor */
                        }}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Aucun instructeur assigné</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Prénom de l'étudiant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'étudiant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Étudiant</FormLabel>
                        <FormControl>
                          <Input placeholder="ID unique de l'étudiant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de naissance</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Classe</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Wing Chun Débutant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked)}
                          />
                        </FormControl>
                        <FormLabel>Étudiant actif</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Cours</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCourse}
                      onChange={(e) => setNewCourse(e.target.value)}
                      placeholder="Ajouter un cours"
                    />
                    <Button
                      type="button"
                      onClick={addCourse}
                      variant="outline"
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
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {courses.length === 0 && <p className="text-gray-500 text-sm italic">Aucun cours ajouté</p>}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {isLoading ? "Ajout..." : "Ajouter l'étudiant"}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-6">
              <h4 className="font-medium mb-4">Étudiants actuels</h4>
              <div className="space-y-2">
                {school.students && school.students.length > 0 ? (
                  school.students.map((student) => (
                    <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{student.username}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          /* Handle remove student */
                        }}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Aucun étudiant inscrit</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}