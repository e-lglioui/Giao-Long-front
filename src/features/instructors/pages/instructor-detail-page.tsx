"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Trash2, Calendar, Phone, MapPin, Briefcase, Upload, FileText, User } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchInstructorById, deleteInstructor, clearCurrentInstructor } from "../instructorSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Certification } from "../services/instructor.service"
import { instructorService, handleImageError } from "../services/instructor.service"
import { ProfileImageGallery } from "../components/profile-image-gallery"
import { DocumentViewer } from "../components/document-viewer"

export function InstructorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const certificateFileInputRef = useRef<HTMLInputElement>(null)
  const passportFileInputRef = useRef<HTMLInputElement>(null)

  // Add a fallback for the instructors state
  const instructorsState = useAppSelector((state) => state.instructors) || {
    currentInstructor: null,
    loading: false,
    error: null,
  }

  const { currentInstructor, loading, error } = instructorsState
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  // State for new certificate
  const [newCertification, setNewCertification] = useState({
    name: "",
    issuingOrganization: "",
    issueDate: new Date().toISOString().split("T")[0],
  })

  // Ajoutons un log pour déboguer les URLs d'images
  const debugImageUrl = (url: string | undefined) => {
    console.log(`Profile image URL: ${url}`)
    return url ? `${url}?t=${Date.now()}` : undefined
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchInstructorById(id))
    }

    return () => {
      dispatch(clearCurrentInstructor())
    }
  }, [dispatch, id])

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleDelete = async () => {
    if (id) {
      try {
        await dispatch(deleteInstructor(id)).unwrap()
        toast({
          title: "Succès",
          description: "Instructeur supprimé avec succès",
        })
        navigate("/dashboard/instructors")
      } catch (err) {
        console.error("Error deleting instructor:", err)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression",
          variant: "destructive",
        })
      }
    }
  }

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !id) return

    const file = e.target.files[0]
    setUploadLoading(true)

    console.log("📸 Selected file info:")
    console.log("- Name:", file.name)
    console.log("- Type:", file.type)
    console.log("- Size:", file.size, "bytes")

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide",
        variant: "destructive",
      })
      setUploadLoading(false)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast({
        title: "Erreur",
        description: "L'image est trop volumineuse (maximum 5 Mo)",
        variant: "destructive",
      })
      setUploadLoading(false)
      return
    }

    try {
      // Attempt to upload using the standard method
      await instructorService.uploadProfileImage(id, file)

      // Update the current instructor in the UI without full page reload
      dispatch(fetchInstructorById(id))

      toast({
        title: "Succès",
        description: "Image de profil mise à jour avec succès",
      })
    } catch (err: any) {
      console.error("❌ Error uploading profile image:", err)

      // Try to extract a more specific error message
      let errorMsg = "Échec du téléchargement de l'image"

      if (err.response && err.response.data) {
        console.error("📄 Server response data:", JSON.stringify(err.response.data, null, 2))

        // Try different properties that might contain the error message
        errorMsg =
          err.response.data.message ||
          err.response.data.error ||
          err.response.data.detail ||
          "Échec du téléchargement de l'image"
      }

      toast({
        title: "Erreur",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setUploadLoading(false)
    }
  }

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !id) return

    const file = e.target.files[0]
    setUploadLoading(true)

    try {
      await instructorService.uploadCertificate(id, file, newCertification)

      // Update the current instructor in the UI
      dispatch(fetchInstructorById(id))

      // Reset the form
      setNewCertification({
        name: "",
        issuingOrganization: "",
        issueDate: new Date().toISOString().split("T")[0],
      })

      toast({
        title: "Succès",
        description: "Certification ajoutée avec succès",
      })
    } catch (err) {
      console.error("Error uploading certificate:", err)
      toast({
        title: "Erreur",
        description: "Échec du téléchargement de la certification",
        variant: "destructive",
      })
    } finally {
      setUploadLoading(false)
    }
  }

  const handleSportPassportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !id) return

    const file = e.target.files[0]
    setUploadLoading(true)

    try {
      await instructorService.uploadSportPassport(id, file)

      // Update the current instructor in the UI
      dispatch(fetchInstructorById(id))

      toast({
        title: "Succès",
        description: "Passeport sportif mis à jour avec succès",
      })
    } catch (err) {
      console.error("Error uploading sport passport:", err)
      toast({
        title: "Erreur",
        description: "Échec du téléchargement du passeport sportif",
        variant: "destructive",
      })
    } finally {
      setUploadLoading(false)
    }
  }

  const handleSelectProfileImage = async (imageUrl: string) => {
    if (!id) return

    // This is a placeholder - in a real app, you would have an API endpoint to set a specific image as the main profile image
    toast({
      title: "Information",
      description: "Cette fonctionnalité n'est pas encore implémentée côté serveur",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!currentInstructor) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/dashboard/instructors")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {currentInstructor.firstName} {currentInstructor.lastName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/dashboard/instructors/${id}/full-profile`)}>
            <User className="mr-2 h-4 w-4" />
            Profil complet
          </Button>
          <Button variant="outline" onClick={() => navigate(`/dashboard/instructors/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              {currentInstructor.profileImageUrl ? (
                <img
                  src={debugImageUrl(currentInstructor.profileImageUrl) || "/placeholder.svg"}
                  alt={`${currentInstructor.firstName} ${currentInstructor.lastName}`}
                  className="w-24 h-24 rounded-full object-cover shadow-md mb-4"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-md mb-4">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <h2 className="text-xl font-bold text-center mb-1">
                {currentInstructor.firstName} {currentInstructor.lastName}
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-4">{currentInstructor.email}</p>

              <Button
                variant="outline"
                className="w-full mb-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLoading}
              >
                {uploadLoading ? (
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Changer la photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageUpload}
              />

              {currentInstructor.profileImages && currentInstructor.profileImages.length > 1 && (
                <ProfileImageGallery
                  images={currentInstructor.profileImages}
                  name={`${currentInstructor.firstName} ${currentInstructor.lastName}`}
                  currentImage={currentInstructor.profileImageUrl}
                  onSelectImage={handleSelectProfileImage}
                />
              )}

              <div className="w-full mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{currentInstructor.yearsOfExperience || 0} ans d'expérience</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{currentInstructor.phone || "Non spécifié"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{currentInstructor.address || "Non spécifié"}</span>
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
                  <p>{currentInstructor.bio || "Aucune biographie disponible"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Spécialités</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentInstructor.specialties && currentInstructor.specialties.length > 0 ? (
                      currentInstructor.specialties.map((specialty: string, index: number) => (
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
                  <CardTitle>Certifications</CardTitle>
                  <CardDescription>Liste des certifications et diplômes de l'instructeur</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!currentInstructor.certifications || currentInstructor.certifications.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">Aucune certification</p>
                  ) : (
                    <div className="grid gap-4">
                      {currentInstructor.certifications.map((cert: Certification, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between">
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
                                <span className="text-gray-500 italic">Non disponible</span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => certificateFileInputRef.current?.click()}
                    disabled={uploadLoading}
                  >
                    {uploadLoading ? (
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Ajouter une certification
                  </Button>
                  <input
                    ref={certificateFileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleCertificateUpload}
                  />
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents sportifs</CardTitle>
                  <CardDescription>Passeport sportif et autres documents officiels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-6 w-6 mr-3 text-blue-500" />
                        <div>
                          <h3 className="font-medium">Passeport Sportif</h3>
                          <p className="text-sm text-muted-foreground">Document officiel d'identité sportive</p>
                        </div>
                      </div>
                      {currentInstructor.passportUrl ? (
                        <DocumentViewer
                          documentUrl={currentInstructor.passportUrl}
                          documentName="Passeport Sportif"
                          documentType="Passeport"
                        />
                      ) : (
                        <span className="text-gray-500 italic">Non disponible</span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => passportFileInputRef.current?.click()}
                    disabled={uploadLoading}
                  >
                    {uploadLoading ? (
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {currentInstructor.passportUrl ? "Mettre à jour le passeport" : "Ajouter un passeport sportif"}
                  </Button>
                  <input
                    ref={passportFileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleSportPassportUpload}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement l'instructeur et toutes les données
              associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

