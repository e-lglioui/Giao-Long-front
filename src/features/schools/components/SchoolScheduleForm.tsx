"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { schoolService } from "../services/school.service"
import type { School } from "../types/school.types"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { TimePickerInput } from "./TimePickerInput"
import  Checkbox  from "@/components/ui/checkbox"

const scheduleSchema = z.object({
  openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be in 24-hour format (HH:MM)"),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be in 24-hour format (HH:MM)"),
  operatingDays: z.array(z.string()),
})

type ScheduleFormData = z.infer<typeof scheduleSchema>

interface SchoolScheduleFormProps {
  school: School
  onUpdate: () => void
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function SchoolScheduleForm({ school, onUpdate }: SchoolScheduleFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      openingTime: school.schedule.openingTime,
      closingTime: school.schedule.closingTime,
      operatingDays: school.schedule.operatingDays || [],
    },
  })

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      setIsLoading(true)
      await schoolService.updateSchedule(school._id, data)
      toast({
        title: "Success",
        description: "Schedule updated successfully",
      })
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update schedule",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>School Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="openingTime"
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
                name="closingTime"
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
            </div>

            <FormField
              control={form.control}
              name="operatingDays"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Operating Days</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {daysOfWeek.map((day) => (
                      <FormField
                        key={day}
                        control={form.control}
                        name="operatingDays"
                        render={({ field }) => {
                          return (
                            <FormItem key={day} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, day])
                                      : field.onChange(field.value?.filter((value) => value !== day))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{day}</FormLabel>
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

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Schedule"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

