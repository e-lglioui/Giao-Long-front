import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Title } from "@tremor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { eventService } from '../services/event.service';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Calendar, Clock, Users, DollarSign, FileText } from 'lucide-react';
import { motion } from "framer-motion";

export function UpdateEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    startDate: '',
    endDate: '',
    prix: '',
    participantnbr: '',
  });

  useEffect(() => {
    if (id) {
      loadEvent(id);
    }
  }, [id]);

  const loadEvent = async (eventId: string) => {
    try {
      const event = await eventService.getEventById(eventId);
      // Formatage des dates pour l'input datetime-local
      const formatDate = (date: string) => {
        return new Date(date).toISOString().slice(0, 16);
      };

      setFormData({
        name: event.name,
        bio: event.bio,
        startDate: formatDate(event.startDate),
        endDate: formatDate(event.endDate),
        prix: event.prix.toString(),
        participantnbr: event.participantnbr.toString(),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
      navigate('/dashboard/events');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedEvent = {
        ...formData,
        prix: parseFloat(formData.prix),
        participantnbr: parseInt(formData.participantnbr),
        userId: user?.id,
      };

      await eventService.updateEvent(id!, updatedEvent);
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      navigate(`/dashboard/events/${id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/dashboard/events/${id}`)}
            className="hover:bg-white/50 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Button>
        </div>

        <Card className="bg-white shadow-xl">
          <div className="p-8">
            <Title className="text-2xl font-bold text-gray-900 mb-8">Update Event</Title>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter event name"
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                    placeholder="Enter event description"
                    rows={4}
                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      Start Date & Time
                    </label>
                    <Input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      End Date & Time
                    </label>
                    <Input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Price
                    </label>
                    <Input
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      Number of Participants
                    </label>
                    <Input
                      type="number"
                      name="participantnbr"
                      value={formData.participantnbr}
                      onChange={handleChange}
                      required
                      min="0"
                      className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/dashboard/events/${id}`)}
                  className="hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Updating...
                    </div>
                  ) : (
                    'Update Event'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </motion.div>
  );
} 