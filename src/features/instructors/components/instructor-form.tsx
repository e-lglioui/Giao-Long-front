"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, X, Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchInstructorById, updateInstructor, clearCurrentInstructor } from "../instructorSlice"
import { instructorService } from "../services/instructor.service"
import type { Certification, Instructor } from "../services/instructor.service"

interface InstructorFormProps {
  isEdit?: boolean
  schoolId?: string
}

export function InstructorForm({ isEdit = false, schoolId }: InstructorFormProps) {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const profileImageRef = useRef<HTMLInputElement>(null)
  const certificateFileRef = useRef<HTMLInputElement>(null)
  const passportFileRef = useRef<HTMLInputElement>(null)

  // Add a fallback for the instructors state
  const instructorsState = useAppSelector((state) => state.instructors) || {
    currentInstructor: null,
    loading: false,
    error: null,
  }

  const { currentInstructor, loading, error } = instructorsState
  const [uploadLoading, setUploadLoading] = useState(false)

  const [formData, setFormData] = useState<Omit<Instructor, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    specialties: [],
    yearsOfExperience: 0,
    certifications: [],
    profileImageUrl: "",
    username: "", // Ajout du champ username
    password: "", // Ajout du champ password
  })

  const [newSpecialty, setNewSpecialty] = useState("")
  const [certForm, setCertForm] = useState<Certification>({
    name: "",
    issuingOrganization: "",
    issueDate: new Date().toISOString().split("T")[0],
  })

  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [certificateFile, setCertificateFile] = useState<File | null>(null)
  const [passportFile, setPassportFile] = useState<File | null>(null)
  const [certificateFileName, setCertificateFileName] = useState("")
  const [passportFileName, setPassportFileName] = useState("")
  const [selectedSchoolId, setSelectedSchoolId] = useState("")
  const [schoolOptions, setSchoolOptions] = useState([])

 
  useEffect(() => {

    if (schoolId) {
      instructorService.setBaseUrl(`/schools/${schoolId}/instructors`)
    } else {
      instructorService.setBaseUrl("/instructors")
    }
  }, [schoolId])

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchInstructorById(id))
    }

    return () => {
      dispatch(clearCurrentInstructor())
    }
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (currentInstructor && isEdit) {
      setFormData({
        firstName: currentInstructor.firstName,
        lastName: currentInstructor.lastName,
        email: currentInstructor.email,
        phone: currentInstructor.phone || "",
        address: currentInstructor.address || "",
        bio: currentInstructor.bio || "",
        specialties: [...(currentInstructor.specialties || [])],
        yearsOfExperience: currentInstructor.yearsOfExperience || 0,
        certifications: [...(currentInstructor.certifications || [])],
        profileImageUrl: currentInstructor.profileImageUrl || "",
        passportUrl: currentInstructor.passportUrl,
        username: currentInstructor.username || "",
        password: currentInstructor.password || "",
      })
    }
  }, [currentInstructor, isEdit])

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])


  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schools = await instructorService.getAllSchools()
        setSchoolOptions(schools)
      } catch (error) {
        console.error("Error fetching schools:", error)
      }
    }

    if (!schoolId) {
      fetchSchools()
    }
  }, [schoolId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearsOfExperience" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0])
      // Create a temporary URL for preview
      const url = URL.createObjectURL(e.target.files[0])
      setFormData((prev) => ({
        ...prev,
        profileImageUrl: url,
      }))
    }
  }

  const handleCertificateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificateFile(e.target.files[0])
      setCertificateFileName(e.target.files[0].name)
    } else {
      setCertificateFile(null)
      setCertificateFileName("")
    }
  }

  const handlePassportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPassportFile(e.target.files[0])
      setPassportFileName(e.target.files[0].name)
    } else {
      setPassportFile(null)
      setPassportFileName("")
    }
  }

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }))
      setNewSpecialty("")
    }
  }

  const handleRemoveSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }))
  }

  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCertForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddCertification = () => {
    if (certForm.name.trim() && certForm.issuingOrganization.trim()) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, { ...certForm }],
      }))
      setCertForm({
        name: "",
        issuingOrganization: "",
        issueDate: new Date().toISOString().split("T")[0],
      })
    }
  }

  const handleRemoveCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadLoading(true)

    try {
      // Vérifier les données du formulaire avant soumission
      console.log("Form data being submitted:", JSON.stringify(formData, null, 2))

      // Vérifier les champs obligatoires
      const requiredFields = ["firstName", "lastName", "email", "phone", "address", "bio", "username", "password"]
      const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

      if (missingFields.length > 0) {
        toast({
          title: "Erreur de validation",
          description: `Champs obligatoires manquants: ${missingFields.join(", ")}`,
          variant: "destructive",
        })
        setUploadLoading(false)
        return
      }

      // Vérifier la longueur du mot de passe
      if (formData.password && formData.password.length < 6) {
        toast({
          title: "Erreur de validation",
          description: "Le mot de passe doit contenir au moins 6 caractères",
          variant: "destructive",
        })
        setUploadLoading(false)
        return
      }

      const instructorData = formData
      let instructorId: string | undefined

      if (isEdit && id) {
        // Update without the profile image (handle separately)
        const { profileImageUrl, ...updateData } = formData
        const updatedInstructor = await dispatch(updateInstructor({ id, updateData })).unwrap()
        instructorId = id

        // If there's a new profile image, upload it
        if (profileImage) {
          await instructorService.uploadProfileImage(id, profileImage)
        }

        toast({
          title: "Succès",
          description: "Instructeur mis à jour avec succès",
        })
      } else {
        // For new instructor
        try {
          // Configurer la base URL avant de créer l'instructeur
          if (schoolId) {
            instructorService.setBaseUrl(`/schools/${schoolId}/instructors`)
            console.log(`Set base URL to /schools/${schoolId}/instructors for creation`)
          } else {
            instructorService.setBaseUrl("/instructors")
            console.log("Set base URL to /instructors for creation")
          }

          // Créer l'instructeur directement via le service au lieu du dispatch
          const newInstructor = await instructorService.createInstructor(formData, schoolId)
          instructorId = newInstructor.id

          console.log("Instructor created successfully:", newInstructor)

          // If there's a profile image and we have an ID, upload it
          if (profileImage && newInstructor.id) {
            await instructorService.uploadProfileImage(newInstructor.id, profileImage)
          }

          // Handle school assignment - use provided schoolId or selectedSchoolId
          const schoolToAssign = schoolId || selectedSchoolId
          if (schoolToAssign && newInstructor.id && !schoolId) {
            // Si schoolId n'est pas fourni dans les props, c'est qu'on assigne à une école sélectionnée
            instructorService.setBaseUrl(`/schools/${schoolToAssign}/instructors`)
            await instructorService.assignInstructorToSchool(schoolToAssign, newInstructor.id)

            toast({
              title: "Succès",
              description: "Instructeur ajouté à l'école avec succès",
            })

            // Si un ID d'école a été fourni, naviguer vers la page de détails de l'école
            if (schoolId) {
              navigate("/dashboard/schools/my-school")
            } else {
              navigate(`/dashboard/schools/${schoolToAssign}`)
            }
            return
          }

          toast({
            title: "Succès",
            description: "Instructeur créé avec succès",
          })
        } catch (createError: any) {
          console.error("Error creating instructor:", createError)
          let errorMessage = "Une erreur est survenue lors de la création de l'instructeur"

          if (createError.message) {
            errorMessage += `: ${createError.message}`
          }

          toast({
            title: "Erreur",
            description: errorMessage,
            variant: "destructive",
          })
          setUploadLoading(false)
          return
        }
      }

      // Upload certificate if provided
      if (certificateFile && instructorId && certForm.name && certForm.issuingOrganization) {
        await instructorService.uploadCertificate(instructorId, certificateFile, {
          name: certForm.name,
          issuingOrganization: certForm.issuingOrganization,
          issueDate: certForm.issueDate,
        })
      }

      // Upload passport if provided
      if (passportFile && instructorId) {
        await instructorService.uploadSportPassport(instructorId, passportFile)
      }

      navigate("/dashboard/instructors")
    } catch (err: any) {
      console.error("Error submitting form:", err)
      let errorMessage = "Une erreur est survenue lors de l'enregistrement"

      if (err.message) {
        errorMessage += `: ${err.message}`
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setUploadLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard/instructors")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{isEdit ? "Modifier l'instructeur" : "Nouvel instructeur"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
            <CardDescription>Ajoutez une photo pour l'instructeur</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={formData.profileImageUrl} alt={`${formData.firstName} ${formData.lastName}`} />
              <AvatarFallback className="text-2xl">
                {formData.firstName?.[0]}
                {formData.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" onClick={() => profileImageRef.current?.click()} className="mt-2">
              <Upload className="h-4 w-4 mr-2" />
              {formData.profileImageUrl ? "Changer la photo" : "Ajouter une photo"}
            </Button>
            <input
              ref={profileImageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Entrez les informations de base de l'instructeur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">Le mot de passe doit contenir au moins 6 caractères</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expérience et spécialités</CardTitle>
            <CardDescription>Ajoutez les compétences et l'expérience de l'instructeur</CardDescription>
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
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSpecialty()
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
            <CardDescription>Ajoutez les certifications et diplômes de l'instructeur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {formData.certifications.map((cert: Certification, index: number) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-muted-foreground">{cert.issuingOrganization}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(cert.issueDate).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveCertification(index)}>
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
              <div className="space-y-2">
                <Label htmlFor="certificateFile">Document de certification (PDF)</Label>
                <div className="flex gap-2">
                  <Input
                    id="certificateFile"
                    type="text"
                    readOnly
                    value={certificateFileName}
                    placeholder="Aucun fichier sélectionné"
                    onClick={() => certificateFileRef.current?.click()}
                    className="cursor-pointer"
                  />
                  <Button type="button" variant="outline" onClick={() => certificateFileRef.current?.click()}>
                    <Upload className="h-4 w-4" />
                  </Button>
                  <input
                    ref={certificateFileRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleCertificateFileChange}
                  />
                </div>
              </div>
            </div>

            <Button type="button" onClick={handleAddCertification} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter la certification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Passeport Sportif</CardTitle>
            <CardDescription>Ajoutez le passeport sportif de l'instructeur (document officiel)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passportFile">Document de passeport sportif (PDF)</Label>
              <div className="flex gap-2">
                <Input
                  id="passportFile"
                  type="text"
                  readOnly
                  value={passportFileName}
                  placeholder="Aucun fichier sélectionné"
                  onClick={() => passportFileRef.current?.click()}
                  className="cursor-pointer"
                />
                <Button type="button" variant="outline" onClick={() => passportFileRef.current?.click()}>
                  <Upload className="h-4 w-4" />
                </Button>
                <input
                  ref={passportFileRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handlePassportFileChange}
                />
              </div>
            </div>

            {formData.passportUrl && (
              <div className="p-3 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <span>Passeport sportif actuel</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => window.open(formData.passportUrl, "_blank")}
                  >
                    Voir
                  </Button>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Le passeport sportif est un document officiel qui atteste des qualifications et des compétences de
              l'instructeur.
            </p>
          </CardContent>
        </Card>

        {!schoolId ? (
          <Card>
            <CardHeader>
              <CardTitle>Assignation à une école</CardTitle>
              <CardDescription>Assignez cet instructeur à une école existante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="schoolId">École</Label>
                <select
                  id="schoolId"
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Sélectionnez une école</option>
                  {schoolOptions.map((school: any) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>École assignée</CardTitle>
              <CardDescription>Cet instructeur sera assigné à votre école</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-primary/5 rounded-md border border-primary/20">
                <p className="font-medium">L'instructeur sera automatiquement assigné à votre école.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard/instructors")}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading || uploadLoading}>
            {loading || uploadLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                {isEdit ? "Mise à jour..." : "Création..."}
              </>
            ) : (
              <>{isEdit ? "Mettre à jour" : "Créer"}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

