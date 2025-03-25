import { useState, useEffect } from 'react';
import { Card, Title } from "@tremor/react";
import { eventService } from '../services/event.service';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CalendarIcon, DollarSignIcon, TicketIcon, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import defaultEventImage from "../../../assets/event.jpg";
import type { Event } from '../types/event.types';

export function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      loadMyEvents();
    }
  }, [user]);

  const loadMyEvents = async () => {
    try {
      if (!user?.id) return;
      const data = await eventService.getEventsByUserId(user?.id);
      setEvents(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = async (eventId: string) => {
    console.log('Add image for event:', eventId);
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/dashboard/events/${eventId}`);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <Title className="text-2xl font-bold text-gray-800">My Events</Title>
        <Button onClick={() => navigate('/dashboard/events/create')}>
          Create Event
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : events.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">You haven't created any events yet.</p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/dashboard/events/create')}
          >
            Create Your First Event
          </Button>
        </Card>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className="group cursor-pointer overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => handleEventClick(event._id)}
              >
                <div className="space-y-4">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  
                      <div className="relative w-full h-full">
                        <img
                          src={defaultEventImage} 
                          alt="Default event"
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            variant="outline"
                            className="backdrop-blur-sm bg-white/30 hover:bg-white/50 transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddImage(event._id);
                            }}
                          >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Add Image
                          </Button>
                        </div>
                      </div>
                   
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {event.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {format(new Date(event.startDate), 'PPP')}
                        </p>
                        <p className="text-sm font-medium flex items-center text-green-600">
                          <DollarSignIcon className="w-4 h-4 mr-1" />
                          {event.prix}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium flex items-center justify-end text-orange-600">
                          <TicketIcon className="w-4 h-4 mr-1" />
                          {event.participantnbr} left
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 hover:bg-orange-500 hover:text-white transition-colors duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/events/${event._id}/edit`);
                          }}
                        >
                          Edit Event
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Badge de statut */}
                  {event.participantnbr === 0 ? (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Sold Out
                    </div>
                  ) : event.participantnbr < 10 ? (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Few tickets left
                    </div>
                  ) : null}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 