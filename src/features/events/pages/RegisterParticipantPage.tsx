import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from "@tremor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from 'lucide-react';
import { eventService } from '../services/event.service';

export function RegisterParticipantPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    city: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      const formattedData = {
        ...formData,
        birthDate: new Date(formData.birthDate).toISOString(),
        eventId: eventId
      };

      await eventService.registerParticipant(eventId!, formattedData);
      
      toast({
        title: "Success",
        description: "Participant registered successfully!",
      });
      
      navigate(`/dashboard/events/${eventId}`);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.errors) {
        setFormErrors(error.errors);
      } else {
        toast({
          title: "Registration Failed",
          description: error.message || "Failed to register participant",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/dashboard/events/${eventId}/participants/search`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Register New Participant</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))}
                className={formErrors.firstName ? "border-red-500" : ""}
                required
              />
              {formErrors.firstName && (
                <p className="text-sm text-red-500">{formErrors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  lastName: e.target.value
                }))}
                className={formErrors.lastName ? "border-red-500" : ""}
                required
              />
              {formErrors.lastName && (
                <p className="text-sm text-red-500">{formErrors.lastName}</p>
              )}
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
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
              className={formErrors.email ? "border-red-500" : ""}
              required
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
                className={formErrors.phone ? "border-red-500" : ""}
              />
              {formErrors.phone && (
                <p className="text-sm text-red-500">{formErrors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">
                Birth Date
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  birthDate: e.target.value
                }))}
                className={formErrors.birthDate ? "border-red-500" : ""}
                required
              />
              {formErrors.birthDate && (
                <p className="text-sm text-red-500">{formErrors.birthDate}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                city: e.target.value
              }))}
              className={formErrors.city ? "border-red-500" : ""}
            />
            {formErrors.city && (
              <p className="text-sm text-red-500">{formErrors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                address: e.target.value
              }))}
              className={formErrors.address ? "border-red-500" : ""}
            />
            {formErrors.address && (
              <p className="text-sm text-red-500">{formErrors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: e.target.value
                }))}
                className={formErrors.emergencyContact ? "border-red-500" : ""}
              />
              {formErrors.emergencyContact && (
                <p className="text-sm text-red-500">{formErrors.emergencyContact}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Emergency Phone</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyPhone: e.target.value
                }))}
                className={formErrors.emergencyPhone ? "border-red-500" : ""}
              />
              {formErrors.emergencyPhone && (
                <p className="text-sm text-red-500">{formErrors.emergencyPhone}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/dashboard/events/${eventId}/participants/search`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Registering...
                </div>
              ) : (
                'Register Participant'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 