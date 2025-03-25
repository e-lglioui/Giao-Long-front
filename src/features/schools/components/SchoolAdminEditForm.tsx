"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { TimePickerInput } from "./TimePickerInput"
import Checkbox from "@/components/ui/checkbox"
import { schoolAdminService } from "../services/school-admin.service"

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// Schema matches backend expectations
const updateSchoolSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contactNumber: z.string().optional(),
  description: z.string().optional(),
  maxStudents: z.number().min(1).optional(),
  schedule: z.object({
    openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be in 24-hour format (HH:MM)"),
    closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be in 24-hour format (HH:MM)"),
    operatingDays: z.array(z.string()),
  }),
  location: z
    .object({
      latitude: z.number().min(-90).max(90).optional(),
      longitude: z.number().min(-180).max(180).optional(),
    })
    .optional(),
})

type FormData = z.infer<typeof updateSchoolSchema>

export function SchoolAdminEditForm() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const form = useForm<FormData>({
    resolver: zodResolver(updateSchoolSchema),
    defaultValues: {
      name: "",
      address: "",
      contactNumber: "",
      description: "",
      maxStudents: undefined,
      schedule: {
        openingTime: "08:00",
        closingTime: "18:00",
        operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      location: {
        latitude: undefined,
        longitude: undefined,
      },
    },
  })

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setInitialLoading(true)
        const school = await schoolAdminService.getMySchool()

        // Set form values from fetched school
        form.reset({
          name: school.name,
          address: school.address || "",
          contactNumber: school.contactNumber || "",
          description: school.description || "",
          maxStudents: school.maxStudents,
          schedule: {
            openingTime: school.schedule?.openingTime || "08:00",
            closingTime: school.schedule?.closingTime || "18:00",
            operatingDays: school.schedule?.operatingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          },
          location: school.location
            ? {
                latitude: school.location.latitude,
                longitude: school.location.longitude,
              }
            : undefined,
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load school data",
          variant: "destructive",
        })
        navigate("/dashboard")
      } finally {
        setInitialLoading(false)
      }
    }

    fetchSchool()
  }, [form, navigate, toast])

  const onSubmit = async (data: FormData) => {
    // Format location data, ensuring numbers for lat/lng
    const location = data.location
      ? {
          latitude: data.location.latitude !== undefined ? Number(data.location.latitude) : undefined,
          longitude: data.location.longitude !== undefined ? Number(data.location.longitude) : undefined,
        }
      : undefined

    const formattedData = {
      ...data,
      maxStudents: data.maxStudents || undefined,
      schedule: {
        openingTime: data.schedule.openingTime,
        closingTime: data.schedule.closingTime,
        operatingDays: data.schedule.operatingDays || [],
      },
      location: location && location.latitude !== undefined && location.longitude !== undefined ? location : undefined,
    }

    try {
      setIsLoading(true)
      await schoolAdminService.updateMySchool(formattedData)
      toast({
        title: "Success",
        description: "School updated successfully",
      })
      navigate("/dashboard")
    } catch (error: any) {
      console.error("Error updating school:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update school",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedDays = form.watch("schedule.operatingDays") || []

  const toggleDay = (day: string) => {
    const currentDays = [...selectedDays]
    const dayIndex = currentDays.indexOf(day)

    if (dayIndex > -1) {
      currentDays.splice(dayIndex, 1)
    } else {
      currentDays.push(day)
    }

    form.setValue("schedule.operatingDays", currentDays, { shouldValidate: true })
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Your School</CardTitle>
        <CardDescription>Update your school information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter school description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Students</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter maximum students"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value ? Number(value) : undefined)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location.latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Enter latitude (e.g., 40.7128)"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value ? Number(value) : undefined)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Enter longitude (e.g., -74.0060)"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value ? Number(value) : undefined)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel className="block mb-2">Schedule</FormLabel>
                <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-md">
                  <FormField
                    control={form.control}
                    name="schedule.openingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Time</FormLabel>
                        <FormControl>
                          <TimePickerInput value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="schedule.closingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closing Time</FormLabel>
                        <FormControl>
                          <TimePickerInput value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormLabel className="block mb-2">Operating Days</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${day}`}
                            checked={selectedDays.includes(day)}
                            onCheckedChange={() => toggleDay(day)}
                          />
                          <label
                            htmlFor={`day-${day}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.schedule?.operatingDays && (
                      <p className="text-sm font-medium text-destructive mt-2">
                        {form.formState.errors.schedule.operatingDays.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update School"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

