import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Title } from "@tremor/react";
import { Button } from "@/components/ui/button";
import { eventService } from '../services/event.service';
import type { Event } from '../types/event.types';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { motion } from "framer-motion";
import defaultEventImage from "../../../assets/event.jpg";
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  ArrowLeft,
  Share2,
  Heart,
  Download,
  Edit,
  Trash2,
  UserPlus,
  MoreHorizontal,
  Info,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isOwner = user?.id === event?.userId;
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent(id);
    }
  }, [id]);

  const loadEvent = async (eventId: string) => {
    try {
      const data = await eventService.getEventById(eventId);
      setEvent(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
      navigate('/dashboard/events');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRegisterForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });
    setFormErrors({});
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      const formattedData = {
        ...registerForm,
        phone: registerForm.phone.trim(),
        
        eventId: event?._id
      };

      console.log('Submitting data:', formattedData);

      if (!event?._id) return;
      await eventService.registerParticipant(event?._id, formattedData);
      
      toast({
        title: "Success",
        description: "Registration successful!",
      });
      setIsRegisterOpen(false);
      resetForm();
      loadParticipants();
    } catch (error: any) {
      console.error('Registration error:', error);
      
      
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event?.name,
        text: event?.bio,
        url: window.location.href,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleDownload = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      setIsLoading(true);
      if (!event?._id) return;
      await eventService.downloadParticipants(event._id, format);
      toast({
        title: "Success",
        description: `Participants list downloaded successfully in ${format.toUpperCase()} format`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download participants list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!event?._id) return;
      await eventService.deleteEvent(event._id);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      navigate('/dashboard/events');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const loadParticipants = async () => {
    if (!event?._id) return;
    
    setIsLoadingParticipants(true);
    try {
      const data = await eventService.getEventParticipants(event._id);
      console.log('Participants loaded:', data); // Pour le debug
      setParticipants(data);
    } catch (error) {
      console.error('Error loading participants:', error); // Pour le debug
      toast({
        title: "Error",
        description: "Failed to load participants",
        variant: "destructive",
      });
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  const handleDeleteParticipant = async (participantId: string) => {
    try {
      if (!event?._id) return;
      await eventService.deleteParticipant(event._id, participantId);
      toast({
        title: "Success",
        description: "Participant removed successfully",
      });
      loadParticipants(); // Recharger la liste
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove participant",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/dashboard/events')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard/events')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>

            {isOwner && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download List
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                      <FileText className="mr-2 h-4 w-4 text-red-500" />
                      Download as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload('csv')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
                      Download as CSV
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDownload('excel')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-blue-500" />
                      Download as Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/dashboard/events/edit/${event._id}`)}
                  title="Edit event"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Event
                </Button>
              </>
            )}
          </div>
        </div>

          <Card className="max-w-4xl mx-auto overflow-hidden bg-white shadow-xl">
            <div className="relative group">
          
                <div className="relative h-[400px] overflow-hidden">

                  <img
                    src={defaultEventImage}
                    alt="Default event"
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  
               
              </div>
            

            {event.participantnbr === 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
                Sold Out
              </div>
            )}
          </div>

            <div className="p-8 space-y-8 bg-white">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{event.bio}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-xl">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CalendarIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Date</p>
                      <p className="text-gray-600">
                        {format(new Date(event.startDate), 'd, MMMM , yyyy,h:mm a')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Clock className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Time</p>
                      <p className="text-gray-600">
                      {format(new Date(event.endDate), 'd, MMMM , yyyy,h:mm a')}
                      </p>
                    </div>
                  </div>

                  
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Users className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Available Tickets</p>
                      <p className="text-gray-600">{event.ticketrestant} spots left</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Price</p>
                      <p className="text-gray-600">${event.prix}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Users className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Participant</p>
                      <p className="text-gray-600">{event.participantnbr} participants</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                {isOwner ? (
                  <div className="space-y-4">
                    <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                          size="lg"
                          disabled={event.participantnbr === 0}
                          onClick={() => navigate(`/dashboard/events/${event._id}/participants/search`)}
                        >
                          <UserPlus className="mr-2 h-5 w-5" />
                          {event.participantnbr === 0 ? 'Sold Out' : 'Add Participant'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Register for {event.name}</DialogTitle>
                          <DialogDescription>
                            Please fill in the participant's information
                          </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleRegister} className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">
                                First Name
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="firstName"
                                value={registerForm.firstName}
                                onChange={(e) => {
                                  setRegisterForm(prev => ({
                                    ...prev,
                                    firstName: e.target.value
                                  }));
                                  if (formErrors.firstName) {
                                    setFormErrors(prev => ({
                                      ...prev,
                                      firstName: ''
                                    }));
                                  }
                                }}
                                className={formErrors.firstName ? "border-red-500" : ""}
                                required
                              />
                              {formErrors.firstName && (
                                <p className="text-sm text-red-500 mt-1">{formErrors.firstName}</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                value={registerForm.lastName}
                                onChange={(e) => setRegisterForm(prev => ({
                                  ...prev,
                                  lastName: e.target.value
                                }))}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">
                              Email
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={registerForm.email}
                              onChange={(e) => {
                                setRegisterForm(prev => ({
                                  ...prev,
                                  email: e.target.value
                                }));
                                if (formErrors.email) {
                                  setFormErrors(prev => ({
                                    ...prev,
                                    email: ''
                                  }));
                                }
                              }}
                              className={formErrors.email ? "border-red-500" : ""}
                              required
                            />
                            {formErrors.email && (
                              <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={registerForm.phone}
                              onChange={(e) => setRegisterForm(prev => ({
                                ...prev,
                                phone: e.target.value
                              }))}
                              required
                            />
                          </div>
                          <div className="flex justify-end gap-3 mt-6">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsRegisterOpen(false);
                                resetForm();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={isSubmitting || Object.keys(formErrors).length > 0}
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                  Registering...
                                </div>
                              ) : (
                                'Register'
                              )}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                 
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            className="flex-1"
                            variant="outline"
                            onClick={loadParticipants}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            View Participants
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px]">
                          <SheetHeader>
                            <SheetTitle>Event Participants</SheetTitle>
                            <SheetDescription>
                              List of all registered participants for this event
                            </SheetDescription>
                          </SheetHeader>
                          
                          {isLoadingParticipants ? (
                            <div className="flex justify-center items-center h-40">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                            </div>
                          ) : (
                            <div className="mt-6">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>firstName</TableHead>
                                    <TableHead>lastName</TableHead>
                                    <TableHead>email</TableHead>
                                    <TableHead>more information</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {participants && participants.length > 0 ? (
                                    participants.map((participant: any) => (
                                      <TableRow key={participant._id}>
                                        <TableCell>{participant.firstName}</TableCell>
                                        <TableCell>{participant.lastName}</TableCell>
                                        <TableCell>{participant.email}</TableCell>
                                        <TableCell>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                              <DropdownMenuItem
                                                onClick={() => {
                                                  toast({
                                                    title: "Participant Information",
                                                    description: (
                                                      <div className="mt-2 space-y-2">
                                                        <p><strong>Name:</strong> {participant.firstName} {participant.lastName}</p>
                                                        <p><strong>Email:</strong> {participant.email}</p>
                                                        <p><strong>Registration Date:</strong> 
                                                          {participant.phone}
                                                    </p>
                                                        
                                                      </div>
                                                    ),
                                                    duration: 10000,
                                                  });
                                                }}
                                              >
                                                <Info className="mr-2 h-4 w-4" />
                                                View Details
                                              </DropdownMenuItem>
                      
                                              <DropdownMenuItem 
                                                onClick={() => navigate(`/dashboard/events/${event._id}/participants/edit/${participant.id}`)}
                                              >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Participant
                                              </DropdownMenuItem>
                                              <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => handleDeleteParticipant(participant.id)}
                                              >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove Participant
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                        No participants registered yet
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline"
                          className="flex-1"
                          disabled={isLoading}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download List
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                          <FileText className="mr-2 h-4 w-4 text-red-500" />
                          Download as PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload('csv')}>
                          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
                          Download as CSV
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDownload('excel')}>
                          <FileSpreadsheet className="mr-2 h-4 w-4 text-blue-500" />
                          Download as Excel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                      className="flex-1"
                      variant="outline"
                      onClick={() => navigate(`/dashboard/events/edit/${event._id}`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Event
                    </Button>
                    <Button 
                      className="flex-1"
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                      Contact the event organizer for registration details
                    
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 