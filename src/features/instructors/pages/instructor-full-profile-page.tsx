"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, Phone, MapPin, Briefcase, FileText, UserIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { instructorService } from "../services/instructor.service"
import type { Certification, Instructor } from "../services/instructor.service"
import { ProfileImageGallery } from "../components/profile-image-gallery"
import { DocumentViewer } from "../components/document-viewer"

export function InstructorFullProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("info")
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchInstructorProfile = async () => {
      if (!id) return

      try {
        setLoading(true)
        const data = await instructorService.getInstructorFullProfile(id)
        setInstructor(data)
      } catch (error) {
        console.error("Error fetching instructor profile:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil complet de l'instructeur",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInstructorProfile()
  }, [id, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!instructor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Instructeur non trouvé</h2>
        <p className="text-muted-foreground mb-6">L'instructeur que vous recherchez n'existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate("/dashboard/instructors")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate(`/dashboard/instructors/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Profil complet de l'instructeur</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="flex justify-center mb-8">
                {instructor.profileImageUrl && !imageError ? (
                  <img
                    src={`${instructor.profileImageUrl}?t=${Date.now()}`}
                    alt={`${instructor.firstName} ${instructor.lastName}`}
                    className="h-48 w-48 rounded-full object-cover border-4 border-primary shadow-lg"
                    onError={(e) => {
                      console.error("Error loading profile image:", e, instructor.profileImageUrl)
                      setImageError(true)
                    }}
                  />
                ) : (
                  <div className="h-48 w-48 bg-gray-200 rounded-full flex items-center justify-center border-4 border-primary shadow-lg">
                    <UserIcon className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-center mb-1">
                {instructor.firstName} {instructor.lastName}
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">{instructor.email}</p>

              {instructor.profileImages && instructor.profileImages.length > 1 && (
                <ProfileImageGallery
                  images={instructor.profileImages}
                  name={`${instructor.firstName} ${instructor.lastName}`}
                  currentImage={instructor.profileImageUrl}
                />
              )}

              <div className="w-full">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{instructor.yearsOfExperience || 0} ans d'expérience</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${instructor.phone}`} className="hover:underline">
                    {instructor.phone || "Non spécifié"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{instructor.address || "Non spécifié"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Biographie</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{instructor.bio || "Aucune biographie disponible"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Spécialités</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties && instructor.specialties.length > 0 ? (
                      instructor.specialties.map((specialty: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucune spécialité</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Certifications et diplômes</CardTitle>
                  <CardDescription>Liste des certifications obtenues par l'instructeur</CardDescription>
                </CardHeader>
                <CardContent>
                  {!instructor.certifications || instructor.certifications.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">Aucune certification</p>
                  ) : (
                    <div className="grid gap-4">
                      {instructor.certifications.map((cert: Certification, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg">{cert.name}</h3>
                                <p className="text-sm text-muted-foreground">{cert.issuingOrganization}</p>
                                <p className="text-xs text-muted-foreground flex items-center mt-1">
                                  <Calendar className="inline h-3 w-3 mr-1" />
                                  {new Date(cert.issueDate).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                  })}
                                </p>
                              </div>
                              {cert.documentUrl ? (
                                <DocumentViewer
                                  documentUrl={cert.documentUrl}
                                  documentName={cert.name}
                                  documentType="Certification"
                                />
                              ) : (
                                <p className="text-gray-500 italic mt-2">Document non disponible</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Passeport sportif</CardTitle>
                  <CardDescription>Document officiel d'identité sportive de l'instructeur</CardDescription>
                </CardHeader>
                <CardContent>
                  {instructor.passportUrl ? (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-10 w-10 mr-4 text-blue-500" />
                          <div>
                            <h3 className="font-medium text-lg">Passeport Sportif</h3>
                            <p className="text-sm text-muted-foreground">Document officiel d'identité sportive</p>
                          </div>
                        </div>
                        <DocumentViewer
                          documentUrl={instructor.passportUrl}
                          documentName="Passeport Sportif"
                          documentType="Passeport"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Passeport sportif non disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {instructor.profileImages && instructor.profileImages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Galerie de photos</CardTitle>
                    <CardDescription>Toutes les photos de profil de l'instructeur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {instructor.profileImages.map((imageUrl, index) => (
                        <div key={index} className="aspect-square rounded-md overflow-hidden">
                          <img
                            src={imageUrl || "/placeholder.svg"}
                            alt={`${instructor.firstName} ${instructor.lastName} - Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error("Error loading gallery image:", e)
                              e.currentTarget.src = "https://via.placeholder.com/150?text=Image+non+disponible"
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

