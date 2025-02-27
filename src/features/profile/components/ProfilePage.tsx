"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Edit, Save, Trophy, User, Award, Calendar, Clock, Star } from "lucide-react"
import type { ProfileData } from "../types/user"

// Utilisez un placeholder pour l'image de profil
const profileImage = "/placeholder.svg?height=800&width=600"

const profileSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  dateOfBirth: z.string().optional(),
  belt: z.string().optional(),
  style: z.string().optional(),
  bio: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      belt: "",
      style: "",
      bio: "",
    },
  })

  useEffect(() => {
    // Simuler le chargement des données de profil
    const fetchProfileData = async () => {
      setProfileLoading(true)
      try {
        // Remplacer par un vrai appel API
        // const response = await fetch(`/api/profile/${user.id}`);
        // const data = await response.json();

        // Données simulées pour la démonstration
        const mockData: ProfileData = {
          username: "dragonwarrior",
          firstName: "Li",
          lastName: "Wei",
          email: user?.email || "li.wei@kungfu.com",
          dateOfBirth: "1990-05-15",
          belt: "Ceinture Noire",
          style: "Wing Chun",
          bio: "Pratiquant les arts martiaux depuis 15 ans, spécialisé dans le Wing Chun et le Tai Chi.",
          achievements: [
            { id: 1, title: "Champion National", year: 2022 },
            { id: 2, title: "Médaille d'Or - Tournoi International", year: 2021 },
            { id: 3, title: "Instructeur Certifié", year: 2020 },
          ],
          stats: {
            tournaments: 12,
            wins: 9,
            students: 15,
            yearsOfPractice: 15,
          },
        }

        setProfileData(mockData)
        reset(mockData)
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error)
        setProfileError("Impossible de charger les données du profil")
      } finally {
        setProfileLoading(false)
      }
    }

    if (user) {
      fetchProfileData()
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setProfileLoading(true)
      // Simuler une mise à jour de profil
      // await fetch(`/api/profile/${user.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      // Simuler un délai de mise à jour
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProfileData((prevData) => (prevData ? { ...prevData, ...data } : null))
      setIsEditing(false)
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
        variant: "default",
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      setProfileError("Impossible de mettre à jour le profil")
    } finally {
      setProfileLoading(false)
    }
  }

  if (isLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
   
      <div className="flex-1 p-6 overflow-auto">
        <Card className="w-full bg-white border-2 border-orange-200 rounded-lg shadow-md">
          <CardHeader className="space-y-2 relative">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                Profil du Maître
              </CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    setIsEditing(false)
                    if (profileData) reset(profileData)
                  }}
                >
                  Annuler
                </Button>
              )}
            </div>
            <p className="text-gray-600 text-sm">Gérez votre parcours et vos accomplissements</p>
          </CardHeader>

          <CardContent>
            {profileError && (
              <Alert variant="destructive" className="mb-6 bg-red-50 border border-red-300">
                <AlertDescription className="text-red-600">{profileError}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 bg-gray-100">
                <TabsTrigger value="info" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Informations
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Accomplissements
                </TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Statistiques
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="relative group">
                      <Avatar className="h-40 w-40 border-4 border-orange-300 shadow-lg shadow-orange-100">
                        <AvatarImage
                          src={profileData?.avatarUrl || "/placeholder.svg?height=160&width=160"}
                          alt="Photo de profil"
                        />
                        <AvatarFallback className="bg-orange-100 text-5xl text-orange-700">
                          {profileData?.firstName?.charAt(0) || ""}
                          {profileData?.lastName?.charAt(0) || ""}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" className="text-orange-700 p-2">
                            <Camera className="h-6 w-6" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 text-center">
                      <h3 className="text-xl font-bold text-gray-800">
                        {profileData?.firstName} {profileData?.lastName}
                      </h3>
                      <p className="text-orange-600">{profileData?.username}</p>
                      <Badge className="mt-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white">{profileData?.belt}</Badge>
                    </div>

                    <div className="mt-6 w-full">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Style</h4>
                      <p className="text-gray-800 bg-gray-100 p-3 rounded-md text-center">
                        {profileData?.style || "Non spécifié"}
                      </p>
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-gray-700">
                            Prénom
                          </Label>
                          <Input
                            {...register("firstName")}
                            id="firstName"
                            disabled={!isEditing}
                            className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                          />
                          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-gray-700">
                            Nom
                          </Label>
                          <Input
                            {...register("lastName")}
                            id="lastName"
                            disabled={!isEditing}
                            className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                          />
                          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-gray-700">
                            Nom d'utilisateur
                          </Label>
                          <Input
                            {...register("username")}
                            id="username"
                            disabled={!isEditing}
                            className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                          />
                          {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700">
                            Email
                          </Label>
                          <Input
                            {...register("email")}
                            id="email"
                            type="email"
                            disabled={!isEditing}
                            className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                          />
                          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth" className="text-gray-700">
                            Date de naissance
                          </Label>
                          <Input
                            {...register("dateOfBirth")}
                            id="dateOfBirth"
                            type="date"
                            disabled={!isEditing}
                            className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="belt" className="text-gray-700">
                            Ceinture
                          </Label>
                          <Input
                            {...register("belt")}
                            id="belt"
                            disabled={!isEditing}
                            className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="style" className="text-gray-700">
                          Style de Kung Fu
                        </Label>
                        <Input
                          {...register("style")}
                          id="style"
                          disabled={!isEditing}
                          className="bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-gray-700">
                          Biographie
                        </Label>
                        <textarea
                          {...register("bio")}
                          id="bio"
                          rows={4}
                          disabled={!isEditing}
                          className="w-full bg-white text-gray-800 border-2 border-gray-200 focus:border-orange-400 transition-all duration-300 rounded-md p-2"
                        />
                      </div>

                      {isEditing && (
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-indigo-700 hover:to-orange-600 text-white font-semibold py-2 transition-all duration-300 shadow-md shadow-orange-200 hover:shadow-orange-300"
                          disabled={profileLoading}
                        >
                          {profileLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                              <span className="ml-2">Sauvegarde...</span>
                            </div>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Sauvegarder
                            </>
                          )}
                        </Button>
                      )}
                    </form>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="achievements">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Accomplissements</h3>
                    {isEditing && (
                      <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                        Ajouter
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {profileData?.achievements?.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-4 rounded-lg border-l-4 border-orange-500 shadow-sm flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <Trophy className="h-8 w-8 text-orange-500 mr-4" />
                          <div>
                            <h4 className="text-gray-800 font-medium">{achievement.title}</h4>
                            <p className="text-gray-500 text-sm">{achievement.year}</p>
                          </div>
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {(!profileData?.achievements || profileData.achievements.length === 0) && (
                      <div className="text-center py-8 text-gray-500">Aucun accomplissement enregistré</div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800">Statistiques</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center mb-4">
                        <Trophy className="h-6 w-6 text-orange-500 mr-2" />
                        <h4 className="text-gray-800 font-medium">Tournois</h4>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-4xl font-bold text-gray-800">{profileData?.stats?.tournaments || 0}</div>
                        <div className="text-sm text-gray-500">Participations</div>
                      </div>
                      <div className="mt-2 text-orange-600">
                        <span className="font-bold">{profileData?.stats?.wins || 0}</span> victoires
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center mb-4">
                        <User className="h-6 w-6 text-orange-500 mr-2" />
                        <h4 className="text-gray-800 font-medium">Élèves</h4>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-4xl font-bold text-gray-800">{profileData?.stats?.students || 0}</div>
                        <div className="text-sm text-gray-500">Actifs</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center mb-4">
                        <Award className="h-6 w-6 text-orange-500 mr-2" />
                        <h4 className="text-gray-800 font-medium">Expérience</h4>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-4xl font-bold text-gray-800">{profileData?.stats?.yearsOfPractice || 0}</div>
                        <div className="text-sm text-gray-500">Années de pratique</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center mb-4">
                        <Star className="h-6 w-6 text-orange-500 mr-2" />
                        <h4 className="text-gray-800 font-medium">Classement</h4>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-4xl font-bold text-gray-800">A+</div>
                        <div className="text-sm text-gray-500">Niveau national</div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-gray-800 font-medium mb-4">Activité récente</h4>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500 shadow-sm">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                          <div>
                            <h5 className="text-gray-800">Tournoi International de Shanghai</h5>
                            <p className="text-gray-600 text-sm">Participation confirmée</p>
                            <p className="text-orange-600 text-xs mt-1">15 Juin 2023</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500 shadow-sm">
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                          <div>
                            <h5 className="text-gray-800">Promotion de ceinture</h5>
                            <p className="text-gray-600 text-sm">Passage au niveau supérieur</p>
                            <p className="text-orange-600 text-xs mt-1">3 Mai 2023</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
   
  )
}