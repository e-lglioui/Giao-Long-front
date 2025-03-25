"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Filter, UserPlus, GraduationCap, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { studentService } from "../services/student.service"
import { Student } from "../types/student.types"
export function StudentsListPage() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState<string>("all")

  useEffect(() => {
    fetchStudents()
  }, [])

  const filterStudents = useCallback(() => {
    let result = [...students]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply class filter
    if (classFilter !== "all") {
      result = result.filter((student) => student.class.toLowerCase().includes(classFilter.toLowerCase()))
    }

    setFilteredStudents(result)
  }, [searchTerm, classFilter, students])

  useEffect(() => {
    filterStudents()
  }, [filterStudents])

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const data = await studentService.getAllStudents()
      setStudents(data)
      setFilteredStudents(data)
    } catch (err) {
      console.error("Failed to fetch students:", err)
      setError("Impossible de charger les étudiants. Veuillez réessayer plus tard.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStudentsByClass = async (className: string) => {
    if (className === "all") {
      fetchStudents()
      return
    }

    setIsLoading(true)
    try {
      const data = await studentService.getStudentsByClass(className)
      setFilteredStudents(data)
    } catch (err) {
      console.error("Failed to fetch students by class:", err)
      setError("Impossible de filtrer les étudiants par classe. Veuillez réessayer plus tard.")
    } finally {
      setIsLoading(false)
    }
  }

  const getAverageGrade = (student: Student): number => {
    if (!student.grades || student.grades.length === 0) return 0
    const total = student.grades.reduce((sum, grade) => sum + grade.grade, 0)
    return total / student.grades.length
  }

  const getBeltColor = (average: number): string => {
    if (average >= 90) return "bg-black text-white"
    if (average >= 80) return "bg-brown-500 text-white"
    if (average >= 70) return "bg-blue-500 text-white"
    if (average >= 60) return "bg-green-500 text-white"
    if (average >= 50) return "bg-yellow-500 text-black"
    return "bg-white text-black border border-gray-300"
  }

  const getUniqueClasses = (): string[] => {
    const classes = new Set(students.map((student) => student.class))
    return Array.from(classes)
  }

  const handleClassFilterChange = (value: string) => {
    setClassFilter(value)
    fetchStudentsByClass(value)
  }

  if (isLoading && students.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <Card className="w-full bg-white border-2 border-orange-200 rounded-lg shadow-md">
        <CardHeader className="space-y-2 relative">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Gestion des Élèves
            </CardTitle>
            <Button
              onClick={() => navigate("/dashboard/students/create")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un élève
            </Button>
          </div>
          <p className="text-gray-600 text-sm">Gérez les élèves de votre école de Kung Fu</p>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-50 border border-red-300">
              <AlertDescription className="text-red-600">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un élève..."
                className="pl-10 border-2 border-gray-200 focus:border-orange-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={classFilter} onValueChange={handleClassFilterChange}>
                <SelectTrigger className="w-[180px] border-2 border-gray-200 focus:border-orange-400">
                  <SelectValue placeholder="Filtrer par classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {getUniqueClasses().map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-2 border-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Tous
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Actifs
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Inactifs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onClick={() => navigate(`/dashboard/students/${student.id}`)}
                      getAverageGrade={getAverageGrade}
                      getBeltColor={getBeltColor}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p>Aucun élève trouvé</p>
                    <Button
                      variant="link"
                      className="text-orange-500 mt-2"
                      onClick={() => {
                        setSearchTerm("")
                        setClassFilter("all")
                        fetchStudents()
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="space-y-4">
                {filteredStudents.filter((s) => s.isActive).length > 0 ? (
                  filteredStudents
                    .filter((s) => s.isActive)
                    .map((student) => (
                      <StudentCard
                        key={student.id}
                        student={student}
                        onClick={() => navigate(`/dashboard/students/${student.id}`)}
                        getAverageGrade={getAverageGrade}
                        getBeltColor={getBeltColor}
                      />
                    ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p>Aucun élève actif trouvé</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="inactive">
              <div className="space-y-4">
                {filteredStudents.filter((s) => !s.isActive).length > 0 ? (
                  filteredStudents
                    .filter((s) => !s.isActive)
                    .map((student) => (
                      <StudentCard
                        key={student.id}
                        student={student}
                        onClick={() => navigate(`/dashboard/students/${student.id}`)}
                        getAverageGrade={getAverageGrade}
                        getBeltColor={getBeltColor}
                      />
                    ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p>Aucun élève inactif trouvé</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface StudentCardProps {
  student: Student
  onClick: () => void
  getAverageGrade: (student: Student) => number
  getBeltColor: (average: number) => string
}

function StudentCard({ student, onClick, getAverageGrade, getBeltColor }: StudentCardProps) {
  const averageGrade = getAverageGrade(student)
  const beltColorClass = getBeltColor(averageGrade)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white p-4 rounded-lg border-l-4 ${student.isActive ? "border-orange-500" : "border-gray-300"} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 border-2 border-orange-200">
            <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={`${student.firstName} ${student.lastName}`} />
            <AvatarFallback className="bg-orange-100 text-orange-700">
              {student.firstName.charAt(0)}
              {student.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="ml-4">
            <h4 className="text-gray-800 font-medium">
              {student.firstName} {student.lastName}
            </h4>
            <div className="flex items-center text-gray-500 text-sm">
              <span className="mr-4">ID: {student.studentId}</span>
              {!student.isActive && (
                <Badge variant="outline" className="bg-gray-100 text-gray-600">
                  Inactif
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-center">
            <div className="text-sm text-gray-500">Classe</div>
            <div className="font-medium text-gray-800">{student.class}</div>
          </div>

          <div className="hidden md:flex flex-col items-center">
            <div className="text-sm text-gray-500">Cours</div>
            <div className="font-medium text-gray-800">{student.courses?.length || 0}</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-500">Note</div>
            <div className="font-medium text-gray-800">{averageGrade.toFixed(0)}</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-500">Ceinture</div>
            <div className={`w-6 h-2 rounded-full ${beltColorClass}`}></div>
          </div>

          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </motion.div>
  )
}