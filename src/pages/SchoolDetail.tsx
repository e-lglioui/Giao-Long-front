"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { MapPin, Phone, Clock, Calendar, ChevronLeft, ChevronRight, Star, Loader } from "lucide-react"
import { schoolService } from "../features/schools/services/school.service"
import type { School } from "../features/schools/types/school.types"
import { Navbar, NavItem, NavCTA } from "@/components/ui/navbar"
import { Footer, FooterColumn, FooterLink } from "@/components/ui/footer"

// Données factices pour les témoignages et événements (ces données ne sont pas dans l'API)
const testimonials = [
  {
    id: 1,
    name: "Ahmed Berrada",
    text: "L'enseignement ici est exceptionnel. J'ai progressé plus en 6 mois qu'en 3 ans ailleurs.",
    rating: 5,
  },
  {
    id: 2,
    name: "Yasmina Kaddouri",
    text: "Mes enfants adorent leurs cours. Les instructeurs sont patients et professionnels.",
    rating: 5,
  },
  {
    id: 3,
    name: "Omar Benjelloun",
    text: "Une école qui respecte les traditions tout en étant moderne dans son approche pédagogique.",
    rating: 4,
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Démonstration de Kung Fu",
    date: "15 Avril 2025",
    description: "Venez assister à une démonstration de nos élèves et maîtres",
  },
  {
    id: 2,
    title: "Stage intensif Wing Chun",
    date: "22-23 Mai 2025",
    description: "Un weekend pour perfectionner vos techniques avec Maître Hassan",
  },
  {
    id: 3,
    title: "Compétition nationale",
    date: "12 Juin 2025",
    description: "Notre école participera à la compétition nationale de Kung Fu",
  },
]

interface SchoolDetailPageProps {
  schoolId?: string // ID de l'école à afficher
}

const SchoolDetail: React.FC<SchoolDetailPageProps> = () => {
  // Use useParams to get the ID from the URL
  const { id: schoolId } = useParams<{ id: string }>()

  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  // Effect to detect scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Charger les données de l'école depuis l'API
  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        if (!schoolId) {
          setError("Aucun ID d'école fourni")
          setLoading(false)
          return
        }

        setLoading(true)
        const data = await schoolService.getSchoolById(schoolId)
        setSchool(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Une erreur s'est produite lors du chargement des données de l'école")
        console.error("Erreur lors du chargement de l'école:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSchoolData()
  }, [schoolId])

  const nextImage = () => {
    if (school?.images && school.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % school.images.length)
    }
  }

  const prevImage = () => {
    if (school?.images && school.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + school.images.length) % school.images.length)
    }
  }

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="mt-4 text-gray-600">Chargement des informations de l'école...</p>
      </div>
    )
  }

  // Afficher un message d'erreur si le chargement a échoué
  if (error || !school) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar>
          <NavItem href="/">Accueil</NavItem>
          <NavItem href="/schools" isActive>
            Écoles
          </NavItem>
          <NavItem href="/events">Événements</NavItem>
          <NavItem href="/contact">Contact</NavItem>
          <NavCTA href="/login">Connexion</NavCTA>
        </Navbar>

        <div className="flex-1 flex items-center justify-center p-4 mt-16">
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-lg max-w-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Erreur</h2>
            <p>{error || "Impossible de charger les détails de l'école"}</p>
            <button
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Préparer les images de placeholder si aucune image n'est disponible
  const images =
    school.images && school.images.length > 0 ? school.images : ["/api/placeholder/800/500", "/api/placeholder/800/500"]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <Navbar transparent={!isScrolled}>
        <NavItem href="/">Accueil</NavItem>
        <NavItem href="/schools" isActive>
          Écoles
        </NavItem>
        <NavItem href="/events">Événements</NavItem>
        <NavItem href="/contact">Contact</NavItem>
        <NavCTA href="/login">Connexion</NavCTA>
      </Navbar>

      {/* Banner Section */}
      <div className="relative h-96 mt-16 bg-gray-900 overflow-hidden">
        <img
          src={images[0] || "/placeholder.svg"}
          alt={school.name}
          className="absolute w-full h-full object-cover opacity-70"
          style={{ filter: "blur(2px)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{school.name}</h1>
          <p className="text-xl text-gray-200 max-w-xl mb-8">Excellence et tradition dans l'enseignement du Kung Fu</p>
          <button
            className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition w-max"
            onClick={() => {
              // Ouvrir Google Maps avec les coordonnées si disponibles
              if (school.location) {
                window.open(
                  `https://maps.google.com/?q=${school.location.latitude},${school.location.longitude}`,
                  "_blank",
                )
              }
            }}
          >
            <MapPin className="mr-2" size={20} />
            Afficher sur la carte
          </button>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* School Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">À propos de notre école</h2>
              <p className="text-gray-700 mb-6">{school.description || "Information sur l'école non disponible."}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <MapPin className="text-orange-500 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Adresse</h4>
                    <p className="text-gray-600">{school.address}</p>
                  </div>
                </div>

                {school.contactNumber && (
                  <div className="flex items-start">
                    <Phone className="text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Contact</h4>
                      <p className="text-gray-600">{school.contactNumber}</p>
                    </div>
                  </div>
                )}

                {school.schedule && (
                  <div className="flex items-start">
                    <Clock className="text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Horaires</h4>
                      <p className="text-gray-600">
                        {school.schedule.openingTime || "N/A"} - {school.schedule.closingTime || "N/A"}
                        <br />
                        {school.schedule.operatingDays && school.schedule.operatingDays.length > 0
                          ? school.schedule.operatingDays.join(", ")
                          : "Horaires non spécifiés"}
                      </p>
                    </div>
                  </div>
                )}

                {school.maxStudents && (
                  <div className="flex items-start">
                    <div className="text-orange-500 mr-2 mt-1 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Capacité</h4>
                      <p className="text-gray-600">{school.maxStudents} étudiants maximum</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructors Section */}
        {school.instructors && school.instructors.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Nos Maîtres</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {school.instructors.map((instructor, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                  <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <img src="/api/placeholder/96/96" alt={instructor.name} className="rounded-full" />
                  </div>
                  <h3 className="font-bold text-xl text-center text-gray-800">{instructor.name}</h3>
                  <p className="text-center text-orange-600 font-medium">{instructor.specialty}</p>
                  <p className="text-center text-gray-600">{instructor.experience} d'expérience</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {images.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Notre École en Images</h2>
            <div className="relative">
              <div className="overflow-hidden rounded-lg h-64 md:h-96">
                <img
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt="Gallery"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${currentImageIndex === index ? "bg-orange-500" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            className="bg-white hover:bg-gray-50 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center transition"
            onClick={() => {
              if (school.contactNumber) {
                window.location.href = `tel:${school.contactNumber}`
              }
            }}
          >
            <Phone size={32} className="text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Contacter l'école</h3>
            <p className="text-gray-600 text-center mt-2">Prenez contact avec nous pour plus d'informations</p>
          </button>

          <button className="bg-red-600 hover:bg-red-700 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center text-white transition">
            <Calendar size={32} className="mb-4" />
            <h3 className="text-xl font-bold">S'inscrire</h3>
            <p className="text-center mt-2">Rejoignez notre école et commencez votre parcours</p>
          </button>

          <button
            className="bg-white hover:bg-gray-50 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center transition"
            onClick={() => {
              if (school.location) {
                window.open(
                  `https://maps.google.com/?q=${school.location.latitude},${school.location.longitude}`,
                  "_blank",
                )
              }
            }}
          >
            <MapPin size={32} className="text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Afficher sur la carte</h3>
            <p className="text-gray-600 text-center mt-2">Localisez notre école et planifiez votre visite</p>
          </button>
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ce que disent nos élèves</h2>
          <div className="relative">
            <div className="min-h-32 md:min-h-40 p-8 bg-gray-50 rounded-lg">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                  <Star key={i} fill="#f97316" color="#f97316" size={24} />
                ))}
              </div>
              <p className="text-gray-700 text-center text-lg italic mb-4">"{testimonials[testimonialIndex].text}"</p>
              <p className="text-center font-semibold text-gray-800">- {testimonials[testimonialIndex].name}</p>
            </div>
            <button
              onClick={prevTestimonial}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex justify-center mt-4 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setTestimonialIndex(index)}
                className={`w-3 h-3 rounded-full ${testimonialIndex === index ? "bg-orange-500" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Événements à venir</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition">
                <div className="h-40 bg-orange-100 relative">
                  <img src="/api/placeholder/400/160" alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute top-0 right-0 bg-orange-500 text-white py-2 px-4 rounded-bl-lg">
                    {event.date}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600">{event.description}</p>
                  <button className="mt-4 text-orange-500 font-medium hover:text-orange-600 transition">
                    En savoir plus →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer>
        <FooterColumn title="Liens rapides">
          <FooterLink href="/">Accueil</FooterLink>
          <FooterLink href="/schools">Nos écoles</FooterLink>
          <FooterLink href="/events">Événements</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/register">S'inscrire</FooterLink>
        </FooterColumn>

        <FooterColumn title="Horaires">
          {school.schedule && school.schedule.operatingDays ? (
            <>
              <li className="text-gray-400">
                {school.schedule.operatingDays.join(", ")}: {school.schedule.openingTime || "N/A"} -{" "}
                {school.schedule.closingTime || "N/A"}
              </li>
              <li className="text-gray-400">Dimanche: Fermé</li>
            </>
          ) : (
            <p className="text-gray-400">Contactez-nous pour plus d'informations sur nos horaires</p>
          )}
        </FooterColumn>
      </Footer>
    </div>
  )
}

export default SchoolDetail

