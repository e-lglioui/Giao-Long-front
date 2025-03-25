import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@tremor/react";
import { Search, UserPlus, ArrowLeft } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { eventService } from '../services/event.service';

export function ParticipantSearchPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await eventService.searchParticipants(searchTerm);
      setSearchResults(results);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search participants",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddExistingParticipant = async (participantId: string) => {
    try {
      await eventService.addParticipantToEvent(eventId!, participantId);
      toast({
        title: "Success",
        description: "Participant added to event successfully",
      });
      navigate(`/dashboard/events/${eventId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add participant to event",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/dashboard/events/${eventId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Event
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Add Participant to Event</h2>
        
        <div className="flex gap-4 mb-8">
          <Input
            placeholder="Search participant by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/events/${eventId}/participants/new`)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            New Participant
          </Button>
        </div>

        {isSearching ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((participant) => (
              <div
                key={participant._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium">
                    {participant.firstName} {participant.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{participant.email}</p>
                </div>
                <Button
                  onClick={() => handleAddExistingParticipant(participant.id)}
                >
                  Add to Event
                </Button>
              </div>
            ))}
          </div>
        ) : searchTerm && (
          <div className="text-center py-8 text-gray-500">
            No participants found. Try a different search or create a new participant.
          </div>
        )}
      </Card>
    </div>
  );
} 