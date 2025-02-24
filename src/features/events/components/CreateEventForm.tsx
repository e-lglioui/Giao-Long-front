import { useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { useAuth } from "@/hooks/useAuth";
import { eventService } from '../services/event.service';
import type { CreateEventDto } from '../types/event.types';

interface CreateEventFormProps {
  userId: string;
  onSuccess: () => void;
  onClose: () => void;
}

const createEventSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  bio: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
    participantnbr: z.string().transform((val) => parseInt(val, 10)), // Conversion en number
    prix: z.string().transform((val) => parseFloat(val)), 
  startDate: z.string().refine(
    (date) => new Date(date) > new Date(),
    "Start date must be in the future"
  ),
  endDate: z.string(),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

type FormData = z.infer<typeof createEventSchema>;

export function CreateEventForm({ userId, onSuccess, onClose }: CreateEventFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      bio: "",
      participantnbr: 1,
      prix: 0,
      startDate: format(new Date().setHours(new Date().getHours() + 1), "yyyy-MM-dd'T'HH:mm"),
      endDate: format(new Date().setHours(new Date().getHours() + 2), "yyyy-MM-dd'T'HH:mm"),
    },
    mode: "onChange", // Active la validation en temps réel
  });

  
  const formValues = watch();

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      onClose();
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an event",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const eventData: CreateEventDto = {
        ...data,
        userId: userId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      };

      await eventService.createEvent(eventData);
      toast({
        title: "Success",
        description: "Event created successfully!",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to create event";
      toast({
        title: "Error",
        description: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-[600px]">
        <CardHeader>
          <h2 className="text-2xl font-bold">Create New Event</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter event name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Description</Label>
              <Controller
                name="bio"
                control={control}
                render={({ field }) => <Textarea {...field} id="bio" placeholder="Enter event description" />}
              />
              {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="participantnbr">Number of Participants</Label>
              <Controller
                name="participantnbr"
                control={control}
                render={({ field }) => <Input {...field} id="participantnbr" type="number" min="1" />}
              />
              {errors.participantnbr && <p className="text-sm text-red-500">{errors.participantnbr.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prix">Price</Label>
              <Controller
                name="prix"
                control={control}
                render={({ field }) => <Input {...field} id="prix" type="number" min="0" step="0.01" />}
              />
              {errors.prix && <p className="text-sm text-red-500">{errors.prix.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => <Input {...field} id="startDate" type="datetime-local" />}
              />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => <Input {...field} id="endDate" type="datetime-local" />}
              />
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
            </div>

            <div className="flex justify-between space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  disabled={!isValid}
                >
                  Preview
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Dialog de prévisualisation */}
      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Event Preview</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p><strong>Name:</strong> {formValues.name}</p>
                <p><strong>Description:</strong> {formValues.bio}</p>
                <p><strong>Participants:</strong> {formValues.participantnbr}</p>
                <p><strong>Price:</strong> ${formValues.prix}</p>
                <p><strong>Start Date:</strong> {format(new Date(formValues.startDate), 'PPpp')}</p>
                <p><strong>End Date:</strong> {format(new Date(formValues.endDate), 'PPpp')}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit(onSubmit)}>
              Confirm & Create
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmation d'annulation */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Event Creation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel? All entered data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={onClose}>
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 