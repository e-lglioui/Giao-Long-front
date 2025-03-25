"use client"

import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarIcon, MapPinIcon, UserIcon, BookOpenIcon, StarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Slider from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { schoolService } from "@/features/schools/services/school.service"
import { eventService } from "@/features/events/services/event.service"
import { useToast } from "@/components/ui/use-toast"
import type { School as SchoolType } from "@/features/schools/types/school.types"
import type { Event as EventType } from "@/features/events/types/event.types"

// Imaginez que ces imports pointent vers des images réelles dans votre projet
import heroImage from "@/assets/hero-kungfu.jpg"
import historyImage from "@/assets/history-kungfu.jpg"
import gallery1 from "@/assets/gallery1.jpg"
import gallery2 from "@/assets/gallery2.jpg"
import gallery3 from "@/assets/gallery3.jpg"
import gallery4 from "@/assets/gallery4.jpg"

// Types for our UI components
interface SchoolUI {
  id: string
  name: string
  location: string | { latitude: number; longitude: number }
  style: string
  instructors: number
  rating: number
  image: string
  address?: string
  distance?: number
  latitude?: number
  longitude?: number
  imageUrl?: string
}

interface EventUI {
  id: string
  title: string
  date: string
  description: string
  image: string
  imageUrl?: string
}

// Export both as named export (HomePage) and default export (for flexibility)
export function Homepage() {
  // État pour la navigation fixe
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate();
  // État pour le slider de la galerie
  const [currentSlide, setCurrentSlide] = useState(0)
  const galleryImages = [gallery1, gallery2, gallery3, gallery4]

  const [showMap, setShowMap] = useState(false)

  // États pour les filtres
  const [filterStyle, setFilterStyle] = useState("")
  const [filterLevel, setFilterLevel] = useState("")
  const [filterDistance, setFilterDistance] = useState(50)

  // États pour les données dynamiques
  const [schools, setSchools] = useState<SchoolUI[]>([])
  const [filteredSchools, setFilteredSchools] = useState<SchoolUI[]>([])
  const [events, setEvents] = useState<EventUI[]>([])
  const [isLoading, setIsLoading] = useState({
    schools: false,
    events: false,
  })

  const { toast } = useToast()

  // Fonction pour gérer les changements de filtres
  const handleFilterChange = (type: string, value: string) => {
    if (type === "style") setFilterStyle(value)
    if (type === "level") setFilterLevel(value)
  }

  const applyFilters = () => {
    const filtered = schools.filter((school) => {
      const styleMatch = !filterStyle || school.style === filterStyle
      const levelMatch = !filterLevel || true // Pas de niveau dans les données actuelles
      const distanceMatch = !school.distance || school.distance <= filterDistance

      return styleMatch && levelMatch && distanceMatch
    })

    setFilteredSchools(filtered)
  }

  // Effet pour détecter le défilement
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

  // Charger les écoles
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, schools: true }))
        const schoolsData = await schoolService.getAllSchools()

        // Transformer les données pour correspondre à notre interface
        const formattedSchools: SchoolUI[] = schoolsData.map((school: SchoolType) => ({
          id: school._id,
          name: school.name,
          location:
            school.address ||
            (typeof school.location === "object" && school.location
              ? `${school.location.latitude}, ${school.location.longitude}`
              : "Location not specified"),
          style: "Traditional", // Default value since it's not in the School type
          instructors: school.instructors?.length || 0,
          rating: 4.5, // Default value since it's not in the School type
          image: school.images?.[0] || "/placeholder.svg?height=192&width=384",
          latitude: school.location?.latitude,
          longitude: school.location?.longitude,
        }))

        setSchools(formattedSchools)
        setFilteredSchools(formattedSchools)
      } catch (error) {
        console.error("Failed to fetch schools:", error)
        toast({
          title: "Error",
          description: "Failed to load schools. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading((prev) => ({ ...prev, schools: false }))
      }
    }

    fetchSchools()
  }, [toast])

  // Charger les événements
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, events: true }))
        const eventsData = await eventService.getAllEvents()

        // Transformer les données pour correspondre à notre interface
        const formattedEvents: EventUI[] = eventsData.map((event: EventType) => {
          // Formater la date
          const eventDate = new Date(event.startDate || Date.now())
          const formattedDate = eventDate.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })

          return {
            id: event._id,
            title: event.title,
            date: formattedDate,
            description: event.description || "No description available",
            image: gallery1, // Utiliser une image par défaut si aucune n'est fournie
          }
        })

        setEvents(formattedEvents)
      } catch (error) {
        console.error("Failed to fetch events:", error)
        toast({
          title: "Error",
          description: "Failed to load events. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading((prev) => ({ ...prev, events: false }))
      }
    }

    fetchEvents()
  }, [toast])

  // Animation au défilement
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }
  const handleRedirect = (schoolId: string) => {
    navigate(`/detail/${schoolId}`)
  }
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/90 shadow-lg shadow-amber-600/20" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent"
            >
              Master's Portal
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-amber-400 hover:text-red-400 transition-colors duration-200">
                Accueil
              </Link>
              <Link to="/login" className="text-amber-400 hover:text-red-400 transition-colors duration-200">
                Connexion
              </Link>
              <Link to="/register" className="text-amber-400 hover:text-red-400 transition-colors duration-200">
                Inscription
              </Link>
              <Button className="bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 hover:from-amber-600 hover:via-red-600 hover:to-amber-600 text-white font-semibold transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50">
                Commencer
              </Button>
            </nav>
            <div className="md:hidden">
              {/* Bouton menu mobile */}
              <Button variant="ghost" className="text-amber-400">
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
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full absolute inset-0"
          >
            {/* Image d'arrière-plan */}
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />

            {/* Overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

            {/* Effet d'énergie */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-red-500/10 to-amber-500/10"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
              La voie du Maître commence ici
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Gérez votre école de Kung Fu, vos élèves et vos événements avec une plateforme conçue par et pour les
              maîtres.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 hover:from-amber-600 hover:via-red-600 hover:to-amber-600 text-white text-lg font-semibold py-6 px-8 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50">
                Rejoindre le temple
              </Button>
              <Button
                variant="outline"
                className="border-2 border-amber-500 text-amber-400 hover:text-red-400 hover:border-red-400 text-lg font-semibold py-6 px-8 transition-all duration-300"
              >
                Explorer les écoles
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
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
            className="text-amber-400"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-900/90">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
              Maîtrisez la gestion, concentrez-vous sur l'enseignement
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Notre plateforme permet aux maîtres et aux écoles de Kung Fu de se concentrer sur ce qui compte :
              transmettre l'art et la philosophie.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-gray-800/50 p-8 rounded-lg border-2 border-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="mb-4 w-16 h-16 bg-gradient-to-br from-amber-500 to-red-500 rounded-full flex items-center justify-center">
                <UserIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Gestion des élèves</h3>
              <p className="text-gray-300">
                Suivez les progrès de vos élèves, gérez leurs inscriptions et leurs parcours d'apprentissage en quelques
                clics.
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-800/50 p-8 rounded-lg border-2 border-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <div className="mb-4 w-16 h-16 bg-gradient-to-br from-amber-500 to-red-500 rounded-full flex items-center justify-center">
                <CalendarIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Organisation d'événements</h3>
              <p className="text-gray-300">
                Créez et gérez des compétitions, des séminaires et des démonstrations avec un système complet de gestion
                d'événements.
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-800/50 p-8 rounded-lg border-2 border-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <div className="mb-4 w-16 h-16 bg-gradient-to-br from-amber-500 to-red-500 rounded-full flex items-center justify-center">
                <BookOpenIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Programme d'entraînement</h3>
              <p className="text-gray-300">
                Structurez vos cours et vos programmes d'entraînement, et partagez des ressources pédagogiques avec vos
                élèves.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
              L'art du Kung Fu en action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez la beauté et la puissance du Kung Fu à travers notre galerie d'images.
            </p>
          </motion.div>

          <div className="relative">
            {/* Slider principal */}
            <div className="overflow-hidden rounded-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  className="w-full h-96 relative"
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${galleryImages[currentSlide]})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation du slider */}
            <div className="flex justify-center mt-6 space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-amber-500 w-6" : "bg-gray-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Flèches de navigation */}
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-amber-500 transition-colors duration-300"
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
              aria-label="Previous slide"
            >
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
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-amber-500 transition-colors duration-300"
              onClick={() => setCurrentSlide((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
              aria-label="Next slide"
            >
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Miniatures */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                className={`h-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                  currentSlide === index ? "ring-2 ring-amber-500" : ""
                }`}
                onClick={() => setCurrentSlide(index)}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${image})` }}
                  aria-label={`Thumbnail ${index + 1}`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-gray-900/90">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
                L'héritage millénaire du Kung Fu
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Le Kung Fu trouve ses racines dans l'ancienne Chine, où il était à l'origine une méthode d'autodéfense
                et un système d'entraînement militaire. Au fil des siècles, il s'est transformé en un art martial
                complet qui allie force physique, agilité, stratégie et philosophie.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                Les moines du temple Shaolin ont joué un rôle crucial dans le développement et la préservation de cet
                art. Leur pratique a évolué pour englober non seulement des techniques de combat, mais aussi une
                philosophie de vie basée sur la discipline, le respect et la recherche constante de l'amélioration de
                soi.
              </p>
              <p className="text-lg text-gray-300">
                Aujourd'hui, le Kung Fu est pratiqué dans le monde entier, perpétuant une tradition qui transcende les
                frontières culturelles et temporelles. Chaque mouvement raconte une histoire, chaque forme est un
                héritage vivant transmis de maître à élève.
              </p>
            </motion.div>

            <motion.div
              className="lg:w-1/2 relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="rounded-lg overflow-hidden border-2 border-amber-600 shadow-xl shadow-amber-500/20">
                <img src={historyImage || "/placeholder.svg"} alt="Histoire du Kung Fu" className="w-full h-auto" />
              </div>

              {/* Effet d'énergie */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-amber-500/20 via-red-500/20 to-amber-500/20 blur-xl" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
              Événements à venir
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Participez aux prochains événements et perfectionnez votre art auprès des plus grands maîtres.
            </p>
          </motion.div>

          {isLoading.events ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.length > 0 ? (
                  events.slice(0, 3).map((event, index) => (
                    <motion.div
                      key={event.id}
                      className="bg-gray-800/50 rounded-lg overflow-hidden border-2 border-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.6, delay: index * 0.1 },
                        },
                      }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="h-48 relative">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${event.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 bg-amber-500 text-black font-semibold px-3 py-1 rounded">
                          {event.date}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 text-amber-400">{event.title}</h3>
                        <p className="text-gray-300 mb-4">{event.description}</p>
                        <Button className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-semibold transition-all duration-300">
                          En savoir plus
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-400 text-lg">Aucun événement à venir pour le moment.</p>
                  </div>
                )}
              </div>

              {events.length > 0 && (
                <div className="text-center mt-12">
                  <Button className="bg-transparent border-2 border-amber-500 text-amber-400 hover:text-red-400 hover:border-red-400 font-semibold py-2 px-6 transition-all duration-300">
                    Voir tous les événements
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Schools Section */}
      <section className="py-20 bg-gray-900/90">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
              Écoles partenaires
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez les écoles de Kung Fu qui font confiance à notre plateforme pour leur gestion quotidienne.
            </p>
          </motion.div>

          {isLoading.schools ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSchools.length > 0 ? (
                  filteredSchools.slice(0, 3).map((school, index) => (
                    <motion.div
                      key={school.id}
                      className="bg-gray-800/50 rounded-lg overflow-hidden border-2 border-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.6, delay: index * 0.1 },
                        },
                      }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="h-48 relative">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${school.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute top-4 right-4 bg-amber-500 text-black font-semibold px-3 py-1 rounded-full flex items-center">
                          <StarIcon size={16} className="mr-1" />
                          {school.rating}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-amber-400">{school.name}</h3>
                        <div className="flex items-center text-gray-300 mb-1">
                          <MapPinIcon size={16} className="mr-1" />
                          <span>{school.location}</span>
                        </div>
                        <div className="flex items-center text-gray-300 mb-3">
                          <span className="font-semibold mr-2">Style:</span>
                          <span>{school.style}</span>
                        </div>
                        <div className="flex items-center text-gray-300 mb-4">
                          <UserIcon size={16} className="mr-1" />
                          <span>{school.instructors} Instructeurs</span>
                        </div>
                        <Button 
 onClick={() => handleRedirect(school.id)}
      className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-semibold transition-all duration-300"
    >
      Voir l'école
    </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-400 text-lg">Aucune école trouvée avec les critères sélectionnés.</p>
                  </div>
                )}
              </div>

              {filteredSchools.length > 0 && (
                <div className="text-center mt-12">
                  <Button className="bg-transparent border-2 border-amber-500 text-amber-400 hover:text-red-400 hover:border-red-400 font-semibold py-2 px-6 transition-all duration-300">
                    Découvrir toutes les écoles
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
              Trouvez une école près de chez vous
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explorez la carte interactive pour découvrir les écoles de Kung Fu disponibles dans votre région.
            </p>
          </motion.div>

          <motion.div
            className="relative h-96 rounded-lg overflow-hidden border-2 border-amber-600 shadow-xl shadow-amber-500/20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {/* Placeholder pour la carte - Dans une vraie application, vous utiliseriez une bibliothèque comme Google Maps ou Mapbox */}
            <div className="absolute inset-0 bg-gray-800">
              {showMap ? (
                <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                  <p className="text-amber-400 text-lg">Carte en cours de chargement...</p>
                  {/* Ici, vous intégreriez votre composant de carte réel */}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-900 bg-opacity-80">
                  <div className="text-center p-8">
                    <MapPinIcon className="text-amber-500 text-6xl mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4 text-amber-400">Découvrez les écoles sur la carte</h3>
                    <p className="text-gray-300 mb-6 max-w-md mx-auto">
                      Visualisez l'emplacement de toutes les écoles de Kung Fu et trouvez celle qui vous convient le
                      mieux.
                    </p>
                    <button
                      onClick={() => setShowMap(true)}
                      className="px-8 py-3 bg-gradient-to-r from-amber-500 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:from-amber-600 hover:to-red-600 transition-all transform hover:scale-105"
                    >
                      Afficher la carte
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Filtres pour la carte */}
          {showMap && (
            <motion.div
              className="mt-6 bg-gray-900 p-6 rounded-lg border border-amber-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-wrap gap-4 justify-center">
                <div>
                  <label className="block text-amber-400 mb-2">Style de Kung Fu</label>
                  <Select onValueChange={(value) => handleFilterChange("style", value)}>
                    <SelectTrigger className="bg-gray-800 text-white border-amber-500 focus:ring-amber-500 w-[200px]">
                      <SelectValue placeholder="Tous les styles" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-amber-500">
                      <SelectItem value="all">Tous les styles</SelectItem>
                      <SelectItem value="Wing Chun">Wing Chun</SelectItem>
                      <SelectItem value="Shaolin">Shaolin</SelectItem>
                      <SelectItem value="Wushu">Wushu</SelectItem>
                      <SelectItem value="Tai Chi">Tai Chi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-amber-400 mb-2">Niveau</label>
                  <Select onValueChange={(value) => handleFilterChange("level", value)}>
                    <SelectTrigger className="bg-gray-800 text-white border-amber-500 focus:ring-amber-500 w-[200px]">
                      <SelectValue placeholder="Tous les niveaux" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-amber-500">
                      <SelectItem value="all">Tous les niveaux</SelectItem>
                      <SelectItem value="Débutant">Débutant</SelectItem>
                      <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                      <SelectItem value="Avancé">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-auto">
                  <label className="block text-amber-400 mb-2">Distance (km): {filterDistance}</label>
                  <Slider
                    value={[filterDistance]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setFilterDistance(value[0])}
                    className="w-full md:w-[200px] h-2"
                  />
                </div>

                <div className="self-end">
                  <Button
                    className="px-6 py-2 bg-amber-500 text-black font-bold rounded-md hover:bg-amber-600 transition-colors"
                    onClick={applyFilters}
                  >
                    Appliquer les filtres
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Liste des écoles à proximité */}
          {showMap && filteredSchools.length > 0 && (
            <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <h3 className="text-2xl font-bold mb-6 text-center text-amber-400">
                Écoles à proximité ({filteredSchools.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchools.map((school) => (
                  <div
                    key={school.id}
                    className="bg-gray-900 rounded-lg overflow-hidden border border-amber-600 hover:border-amber-400 transition-colors"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={school.image || "/placeholder.svg"}
                        alt={school.name}
                        className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-xl font-bold mb-2 text-amber-400">{school.name}</h4>
                      <p className="text-gray-300 text-sm mb-2">
                        <MapPinIcon className="inline mr-1 h-4 w-4" /> {school.location}
                      </p>
                      <p className="text-gray-300 text-sm mb-4">
                        <span className="bg-amber-500 text-black px-2 py-1 rounded-full text-xs font-bold mr-2">
                          {school.style}
                        </span>
                        {school.distance && (
                          <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">
                            {school.distance} km
                          </span>
                        )}
                      </p>
                      <Button className="w-full py-2 bg-gradient-to-r from-amber-500 to-red-500 text-white font-semibold rounded-md hover:from-amber-600 hover:to-red-600 transition-colors">
                        Voir les détails
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-amber-600/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-amber-400">Master's Portal</h3>
              <p className="text-gray-400 mb-4">
                La plateforme dédiée aux écoles de Kung Fu et aux maîtres d'arts martiaux.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-400">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                    Écoles
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                    Événements
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-400">Ressources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                    Tutoriels
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-400">Newsletter</h3>
              <p className="text-gray-400 mb-4">Abonnez-vous pour recevoir les dernières actualités et mises à jour.</p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="bg-gray-800 border-amber-600 text-white focus:ring-amber-500"
                />
                <Button className="ml-2 bg-amber-500 hover:bg-amber-600 text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} Master's Portal. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


export default Homepage;