import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Title } from "@tremor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, User, Mail, Phone } from 'lucide-react';
import { motion } from "framer-motion";
import { eventService } from '../services/event.service';

export function UpdateParticipantPage() {
  const { eventId, participantId } = useParams<{ eventId: string; participantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!eventId || !participantId) {
      toast({
        title: "Error",
        description: "Invalid participant or event ID",
        variant: "destructive",
      });
      navigate('/dashboard/events');
      return;
    }
    loadParticipant();
  }, [eventId, participantId]);

  const loadParticipant = async () => {
    try {
      console.log('Loading participant:', { eventId, participantId }); // Debug log
      const data = await eventService.getParticipant(eventId!, participantId!);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || '',
      });
    } catch (error) {
      console.error('Error loading participant:', error); // Debug log
      toast({
        title: "Error",
        description: "Failed to load participant details",
        variant: "destructive",
      });
      navigate(`/dashboard/events/${eventId}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !participantId) return;

    setIsLoading(true);
    try {
      console.log('Updating participant:', { eventId, participantId, formData }); // Debug log
      await eventService.updateParticipant(eventId, participantId, formData);
      toast({
        title: "Success",
        description: "Participant updated successfully",
      });
      navigate(`/dashboard/events/${eventId}`);
    } catch (error: any) {
      console.error('Error updating participant:', error); // Debug log
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update participant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/dashboard/events/${eventId}`)}
            className="hover:bg-white/50 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Button>
        </div>

        <Card className="bg-white shadow-xl">
          <div className="p-8">
            <Title className="text-2xl font-bold text-gray-900 mb-8">Update Participant</Title>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    First Name
                  </label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Last Name
                  </label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/dashboard/events/${eventId}`)}
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
                    'Update Participant'
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