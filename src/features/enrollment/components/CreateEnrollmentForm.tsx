"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { enrollmentService } from "../services/enrollment.service"
import { EnrollmentStatus } from "../types/enrollment.types"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"

const createEnrollmentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  schoolId: z.string().min(1, "School is required"),
  classes: z.array(z.string()).optional(),
  enrollmentDate: z.date({
    required_error: "Enrollment date is required",
  }),
  status: z.nativeEnum(EnrollmentStatus).optional(),
  notes: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof createEnrollmentSchema>

export function CreateEnrollmentForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [schools, setSchools] = useState([])
  const [students, setStudents] = useState([])
  const [availableClasses, setAvailableClasses] = useState([])
  const [selectedSchoolId, setSelectedSchoolId] = useState("")

  // Get initial values from location state if available
  const initialSchoolId = location.state?.schoolId || ""
  const initialStudentId = location.state?.studentId || ""

  const form = useForm<FormData>({
    resolver: zodResolver(createEnrollmentSchema),
    defaultValues: {
      studentId: initialStudentId,
      schoolId: initialSchoolId,
      classes: [],
      enrollmentDate: new Date(),
      status: EnrollmentStatus.ACTIVE,
      notes: [],
    },
  })

  useEffect(() => {
    // In a real app, you would fetch schools and students here
    // For now, we'll use dummy data
    setSchools([
      { _id: "1", name: "Main Kung Fu School" },
      { _id: "2", name: "Downtown Dojo" },
      { _id: "3", name: "Shaolin Temple" },
    ])

    setStudents([
      { _id: "1", firstName: "John", lastName: "Doe" },
      { _id: "2", firstName: "Jane", lastName: "Smith" },
      { _id: "3", firstName: "Bruce", lastName: "Lee" },
    ])

    // If we have an initial school ID, load its classes
    if (initialSchoolId) {
      setSelectedSchoolId(initialSchoolId)
      loadClassesForSchool(initialSchoolId)
    }
  }, [initialSchoolId])

  const loadClassesForSchool = async (schoolId: string) => {
    try {
      // In a real app, you would fetch classes for the selected school
      // For now, we'll use dummy data
      setAvailableClasses([
        { _id: "1", title: "Kung Fu Basics", date: "2023-06-01", startTime: "09:00", endTime: "10:00" },
        { _id: "2", title: "Advanced Techniques", date: "2023-06-02", startTime: "10:00", endTime: "11:00" },
        { _id: "3", title: "Meditation & Focus", date: "2023-06-03", startTime: "11:00", endTime: "12:00" },
      ])
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load classes",
        variant: "destructive",
      })
    }
  }

  const onSchoolChange = (schoolId: string) => {
    setSelectedSchoolId(schoolId)
    form.setValue("schoolId", schoolId)
    form.setValue("classes", [])
    loadClassesForSchool(schoolId)
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      await enrollmentService.createEnrollment(data)
      toast({
        title: "Success",
        description: "Enrollment created successfully",
      })
      navigate("/enrollments")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create enrollment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Enrollment</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student: any) => (
                          <SelectItem key={student._id} value={student._id}>
                            {student.firstName} {student.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schoolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <Select onValueChange={(value) => onSchoolChange(value)} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a school" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schools.map((school: any) => (
                          <SelectItem key={school._id} value={school._id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="enrollmentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Enrollment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={EnrollmentStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={EnrollmentStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={EnrollmentStatus.COMPLETED}>Completed</SelectItem>
                      <SelectItem value={EnrollmentStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedSchoolId && (
              <FormField
                control={form.control}
                name="classes"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Classes</FormLabel>
                    </div>
                    <div className="space-y-2">
                      {availableClasses.map((classItem: any) => (
                        <FormField
                          key={classItem._id}
                          control={form.control}
                          name="classes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={classItem._id}
                                className="flex flex-row items-start space-x-3 space-y-0 border p-3 rounded-md"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(classItem._id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), classItem._id])
                                        : field.onChange(field.value?.filter((value) => value !== classItem._id))
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">{classItem.title}</FormLabel>
                                  <p className="text-sm text-gray-500">
                                    {format(new Date(classItem.date), "PPP")} • {classItem.startTime} -{" "}
                                    {classItem.endTime}
                                  </p>
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/enrollments")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Enrollment"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

