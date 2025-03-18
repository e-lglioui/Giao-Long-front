import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  createInstructor,
  fetchInstructorById,
  updateInstructor,
  clearCurrentInstructor,
} from '../instructorSlice';
import { Certification, Instructor } from '../services/instructor.service';

interface InstructorFormProps {
  isEdit?: boolean;
  schoolId?: string;
}

export function InstructorForm({ isEdit = false, schoolId }: InstructorFormProps) {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentInstructor, loading, error } = useAppSelector((state) => state.instructors);

  const [formData, setFormData] = useState<Omit<Instructor, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    specialties: [],
    yearsOfExperience: 0,
    certifications: [],
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const [certForm, setCertForm] = useState<Certification>({
    name: '',
    issuingOrganization: '',
    issueDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchInstructorById(id));
    }

    return () => {
      dispatch(clearCurrentInstructor());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (currentInstructor && isEdit) {
      setFormData({
        firstName: currentInstructor.firstName,
        lastName: currentInstructor.lastName,
        email: currentInstructor.email,
        phone: currentInstructor.phone,
        address: currentInstructor.address,
        bio: currentInstructor.bio,
        specialties: [...currentInstructor.specialties],
        yearsOfExperience: currentInstructor.yearsOfExperience,
        certifications: [...currentInstructor.certifications],
      });
    }
  }, [currentInstructor, isEdit]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Erreur',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value,
    }));
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }));
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }));
  };

  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCertForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCertification = () => {
    if (certForm.name.trim() && certForm.issuingOrganization.trim()) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, { ...certForm }],
      }));
      setCertForm({
        name: '',
        issuingOrganization: '',
        issueDate: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleRemoveCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await dispatch(updateInstructor({ id, updateData: formData })).unwrap();
        toast({
          title: 'Succès',
          description: 'Instructeur mis à jour avec succès',
        });
      } else if (schoolId) {
        // This would be handled by a different action in a real app
        // For now, we'll just create the instructor
        await dispatch(createInstructor(formData)).unwrap();
        toast({
          title: 'Succès',
          description: 'Instructeur ajouté à l\'école avec succès',
        });
      } else {
        await dispatch(createInstructor(formData)).unwrap();
        toast({
          title: 'Succès',
          description: 'Instructeur créé avec succès',
        });
      }
      navigate('/dashboard/instructors');
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate('/dashboard/instructors')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEdit ? 'Modifier l\'instructeur' : 'Nouvel instructeur'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Entrez les informations de base de l'instructeur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expérience et spécialités</CardTitle>
            <CardDescription>
              Ajoutez les compétences et l'expérience de l'instructeur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Années d'expérience</Label>
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Spécialités</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.specialties.map((specialty: string, index: number) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {specialty}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleRemoveSpecialty(specialty)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Ajouter une spécialité"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSpecialty();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSpecialty}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
            <CardDescription>
              Ajoutez les certifications et diplômes de l'instructeur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {formData.certifications.map((cert: Certification, index: number) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-muted-foreground">{cert.issuingOrganization}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(cert.issueDate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCertification(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certName">Nom de la certification</Label>
                <Input
                  id="certName"
                  name="name"
                  value={certForm.name}
                  onChange={handleCertChange}
                  placeholder="ex: AWS Certified Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuingOrganization">Organisation émettrice</Label>
                <Input
                  id="issuingOrganization"
                  name="issuingOrganization"
                  value={certForm.issuingOrganization}
                  onChange={handleCertChange}
                  placeholder="ex: Amazon"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Date d'obtention</Label>
                <Input
                  id="issueDate"
                  name="issueDate"
                  type="date"
                  value={certForm.issueDate}
                  onChange={handleCertChange}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleAddCertification}
                  className="w-full md:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter la certification
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/instructors')}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                {isEdit ? 'Mise à jour...' : 'Création...'}
              </>
            ) : (
              <>{isEdit ? 'Mettre à jour' : 'Créer'}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}