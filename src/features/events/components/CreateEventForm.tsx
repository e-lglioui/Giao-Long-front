"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, Users, DollarSign, School, User, MapPin, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { eventService } from "../services/event.service"

// Updated event types to match backend schema
export const EventType = {
  ACADEMIC: "ACADEMIC",
  CULTURAL: "CULTURAL",
  SPORTS: "SPORTS",
  WORKSHOP: "WORKSHOP",
  CONFERENCE: "CONFERENCE",
  OTHER: "OTHER",
} as const

export type EventTypeValues = (typeof EventType)[keyof typeof EventType]

const EventStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
} as const

const createEventSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must be less than 500 characters"),
    type: z.nativeEnum(EventType),
    organizingSchool: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
    organizer: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
    location: z.object({
      address: z.string().min(1, "Address is required"),
      city: z.string().min(1, "City is required"),
      country: z.string().min(1, "Country is required"),
    }),
    participantnbr: z.coerce.number().min(1, "Must have at least 1 participant"),
    prix: z.coerce.number().min(0, "Price cannot be negative"),
    startDate: z.string().refine((date) => new Date(date) > new Date(), "Start date must be in the future"),
    endDate: z.string(),
    registrationDetails: z.object({
      deadline: z.string().min(1, "Registration deadline is required"),
      requirements: z.string().min(1, "Registration requirements are required"),
    }),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })

type FormData = z.infer<typeof createEventSchema>

interface CreateEventFormProps {
  userId: string
  onSuccess: () => void
  onClose: () => void
}

export function CreateEventForm({ userId, onSuccess, onClose }: CreateEventFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      type: EventType.OTHER,
      organizingSchool: "",
      organizer: "",
      location: {
        address: "",
        city: "",
        country: "",
      },
      participantnbr: 1,
      prix: 0,
      startDate: format(new Date().setHours(new Date().getHours() + 1), "yyyy-MM-dd'T'HH:mm"),
      endDate: format(new Date().setHours(new Date().getHours() + 2), "yyyy-MM-dd'T'HH:mm"),
      registrationDetails: {
        deadline: format(new Date().setHours(new Date().getHours() + 1), "yyyy-MM-dd'T'HH:mm"),
        requirements: "",
      },
    },
    mode: "onChange",
  })

  const formValues = watch()

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true)
    } else {
      onClose()
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const eventData = {
        ...data,
        userId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        registrationDetails: {
          ...data.registrationDetails,
          deadline: new Date(data.registrationDetails.deadline),
          currentParticipants: 0,
          maxParticipants: data.participantnbr,
        },
        status: EventStatus.PUBLISHED,
        participants: [],
      }

      await eventService.createEvent(eventData)
      toast({
        title: "Success",
        description: "Event created successfully!",
      })
      onSuccess()
    } catch (error: any) {
      if (error.name === "ApiError") {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to create event. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Create Event</h2>
        <p className="text-sm text-muted-foreground">Fill in the details to create a new event.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="title">
                <FileText className="h-4 w-4 inline mr-2" />
                Event Title
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input id="title" placeholder="Enter event title" {...field} />}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="type">Event Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select event type" value={field.value} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EventType).map(([key, value]) => (
                      <SelectItem key={value} value={value}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                )}
              />
              {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea id="description" placeholder="Enter event description" className="resize-none" {...field} />
              )}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="organizingSchool">
                <School className="h-4 w-4 inline mr-2" />
                Organizing School ID
              </Label>
              <Controller
                name="organizingSchool"
                control={control}
                render={({ field }) => <Input id="organizingSchool" placeholder="School ObjectId" {...field} />}
              />
              {errors.organizingSchool && (
                <p className="text-sm text-red-500 mt-1">{errors.organizingSchool.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="organizer">
                <User className="h-4 w-4 inline mr-2" />
                Organizer ID
              </Label>
              <Controller
                name="organizer"
                control={control}
                render={({ field }) => <Input id="organizer" placeholder="Organizer ObjectId" {...field} />}
              />
              {errors.organizer && <p className="text-sm text-red-500 mt-1">{errors.organizer.message}</p>}
            </div>
          </div>

          <div className="grid gap-4">
            <Label>
              <MapPin className="h-4 w-4 inline mr-2" />
              Location Details
            </Label>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Controller
                  name="location.address"
                  control={control}
                  render={({ field }) => <Input placeholder="Address" {...field} />}
                />
                {errors.location?.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.location.address.message}</p>
                )}
              </div>
              <div>
                <Controller
                  name="location.city"
                  control={control}
                  render={({ field }) => <Input placeholder="City" {...field} />}
                />
                {errors.location?.city && <p className="text-sm text-red-500 mt-1">{errors.location.city.message}</p>}
              </div>
              <div>
                <Controller
                  name="location.country"
                  control={control}
                  render={({ field }) => <Input placeholder="Country" {...field} />}
                />
                {errors.location?.country && (
                  <p className="text-sm text-red-500 mt-1">{errors.location.country.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="startDate">
                <CalendarIcon className="h-4 w-4 inline mr-2" />
                Start Date & Time
              </Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => <Input type="datetime-local" id="startDate" {...field} />}
              />
              {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message?.toString()}</p>}
            </div>

            <div>
              <Label htmlFor="endDate">
                <Clock className="h-4 w-4 inline mr-2" />
                End Date & Time
              </Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => <Input type="datetime-local" id="endDate" {...field} />}
              />
              {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate.message?.toString()}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="participantnbr">
                <Users className="h-4 w-4 inline mr-2" />
                Number of Participants
              </Label>
              <Controller
                name="participantnbr"
                control={control}
                render={({ field }) => (
                  <Input type="number" id="participantnbr" min="1" placeholder="Maximum participants" {...field} />
                )}
              />
              {errors.participantnbr && (
                <p className="text-sm text-red-500 mt-1">{errors.participantnbr.message?.toString()}</p>
              )}
            </div>

            <div>
              <Label htmlFor="prix">
                <DollarSign className="h-4 w-4 inline mr-2" />
                Price
              </Label>
              <Controller
                name="prix"
                control={control}
                render={({ field }) => (
                  <Input type="number" id="prix" min="0" step="0.01" placeholder="0.00" {...field} />
                )}
              />
              {errors.prix && <p className="text-sm text-red-500 mt-1">{errors.prix.message?.toString()}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="registrationDeadline">Registration Deadline</Label>
              <Controller
                name="registrationDetails.deadline"
                control={control}
                render={({ field }) => <Input type="datetime-local" id="registrationDeadline" {...field} />}
              />
              {errors.registrationDetails?.deadline && (
                <p className="text-sm text-red-500 mt-1">{errors.registrationDetails.deadline.message?.toString()}</p>
              )}
            </div>

            <div>
              <Label htmlFor="registrationRequirements">Registration Requirements</Label>
              <Controller
                name="registrationDetails.requirements"
                control={control}
                render={({ field }) => (
                  <Input id="registrationRequirements" placeholder="e.g., Student ID required" {...field} />
                )}
              />
              {errors.registrationDetails?.requirements && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.registrationDetails.requirements.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !isValid}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>You have unsaved changes. Leaving will discard them.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onClose}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

