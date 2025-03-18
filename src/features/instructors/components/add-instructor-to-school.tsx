import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { fetchInstructors, assignInstructorToSchool } from '../instructorSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InstructorForm } from './instructor-form';
import { Instructor } from '../services/instructor.service';

export function AddInstructorToSchool() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { instructors, loading, error } = useAppSelector((state) => state.instructors);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('existing');

  useEffect(() => {
    dispatch(fetchInstructors());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Erreur',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleAssignInstructor = async (instructorId: string) => {
    if (schoolId) {
      try {
        await dispatch(assignInstructorToSchool({ schoolId, instructorId })).unwrap();
        toast({
          title: 'Succès',
          description: 'Instructeur ajouté à l\'école avec succès',
        });
        navigate(`/dashboard/schools/${schoolId}`);
      } catch (err) {
        console.error('Error assigning instructor:', err);
      }
    }
  };

  const filteredInstructors = instructors.filter(
    (instructor: Instructor) =>
      instructor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.specialties.some((specialty: string) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(`/dashboard/schools/${schoolId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Ajouter un instructeur</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="existing">Instructeur existant</TabsTrigger>
          <TabsTrigger value="new">Nouvel instructeur</TabsTrigger>
        </TabsList>
        <TabsContent value="existing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sélectionner un instructeur existant</CardTitle>
              <CardDescription>
                Choisissez un instructeur dans la liste pour l'ajouter à l'école
              </CardDescription>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher par nom, email ou spécialité..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Spécialités</TableHead>
                      <TableHead>Expérience</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstructors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucun instructeur trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInstructors.map((instructor: Instructor) => (
                        <TableRow key={instructor.id}>
                          <TableCell>
                            {instructor.firstName} {instructor.lastName}
                          </TableCell>
                          <TableCell>{instructor.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {instructor.specialties.map((specialty: string, index: number) => (
                                <Badge key={index} variant="outline">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{instructor.yearsOfExperience} ans</TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => handleAssignInstructor(instructor.id!)}
                              size="sm"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="new" className="mt-6">
          <InstructorForm schoolId={schoolId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}