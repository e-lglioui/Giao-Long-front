import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { School } from '../types/school.types';
import { schoolService } from '../services/school.service';
import { useToast } from "@/components/ui/use-toast";
import { Users, MapPin, Edit, Trash2 } from 'lucide-react';

export function SchoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [school, setSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadSchool();
    }
  }, [id]);

  const loadSchool = async () => {
    try {
      setIsLoading(true);
      const data = await schoolService.getSchoolById(id!);
      setSchool(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load school",
        variant: "destructive",
      });
      navigate('/schools');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this school?')) {
      return;
    }

    try {
      await schoolService.deleteSchool(id!);
      toast({
        title: "Success",
        description: "School deleted successfully",
      });
      navigate('/schools');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete school",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!school) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{school.name}</h2>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/schools/${id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Address</h3>
            <p className="text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {school.address}
            </p>
          </div>

          {school.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{school.description}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500">Students</div>
                  <div className="text-2xl font-bold">{school.dashboard.studentCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500">Revenue</div>
                  <div className="text-2xl font-bold">${school.dashboard.revenue}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Instructors</h3>
            <div className="space-y-2">
              {school.instructors.map((instructor) => (
                <div
                  key={instructor._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{instructor.username}</div>
                    <div className="text-sm text-gray-500">{instructor.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 