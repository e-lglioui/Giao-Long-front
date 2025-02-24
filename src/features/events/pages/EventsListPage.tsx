import { useState, useEffect } from 'react';
import { Card, Title } from "@tremor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { eventService } from '../services/event.service';
import type { Event } from '../types/event.types';
import { useAuth } from '@/hooks/useAuth';
import { PlusIcon, SearchIcon, ImageIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, DollarSignIcon, TicketIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import defaultEventImage from "../../../assets/event.jpg";

export function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const event = await eventService.searchEvents(searchTerm);
        setEvents(event ? [event] : []);
      } catch (error) {
        console.error('Error searching events:', error);
      }
    } else {
      loadEvents();
    }
  };

  const handleAddImage = async (eventId: string) => {
    console.log('Add image for event:', eventId);
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/dashboard/events/${eventId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>Events Management</Title>
        <Button onClick={() => navigate('/dashboard/events/create')}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleSearch}>
          <SearchIcon className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
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
                        {user?.id === event.userId && (
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
                        )}
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
                          className="mt-2 hover:bg-blue-500 hover:text-white transition-colors duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/events/${event._id}/register`);
                          }}
                        >
                          Register
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