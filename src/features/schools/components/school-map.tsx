"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { SchoolIcon } from "lucide-react"
import type { School } from "../types/school.types"
import { schoolService } from "../services/school.service"
import { getImageUrl } from "../utils/image-utils"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Custom school marker icon
const schoolIcon = new L.Icon({
  iconUrl: "/school-marker.svg", // You'll need to create this SVG or use a different icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

interface SchoolMapProps {
  schools?: School[]
}

export function SchoolMap({ schools: propSchools }: SchoolMapProps) {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]) // Default to Paris
  const [mapZoom, setMapZoom] = useState(5)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (propSchools) {
      setSchools(propSchools)
      setIsLoading(false)

      // If we have schools with location data, center the map on the first one
      if (propSchools.length > 0 && propSchools[0].location) {
        setMapCenter([propSchools[0].location.latitude, propSchools[0].location.longitude])
        setMapZoom(12) // Zoom in closer for nearby schools
      }
    } else {
      loadSchoolsForMap()
    }

    // Try to get user's location for better initial map position
    if (navigator.geolocation && !propSchools) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude])
          setMapZoom(10)
        },
        (error) => {
          console.error("Error getting user location:", error)
        },
      )
    }
  }, [propSchools])

  const loadSchoolsForMap = async () => {
    try {
      setIsLoading(true)
      const data = await schoolService.getSchoolsForMap()
      setSchools(data)

      // If we have schools with location data, center the map on the first one
      if (data.length > 0 && data[0].location) {
        setMapCenter([data[0].location.latitude, data[0].location.longitude])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load schools for map",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSchoolClick = (schoolId: string) => {
    navigate(`/dashboard/schools/${schoolId}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <SchoolIcon className="mx-auto h-12 w-12 mb-4 text-gray-400" />
        <p>No schools with location data available</p>
      </div>
    )
  }

  return (
    <div className="h-[600px] w-full rounded-md overflow-hidden">
      <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {schools.map((school) => (
          <Marker key={school._id} position={[school.location.latitude, school.location.longitude]} icon={schoolIcon}>
            <Popup>
              <div className="w-64">
                {school.images && school.images.length > 0 && (
                  <img
                    src={getImageUrl(school.images[0]) || "/placeholder.svg"}
                    alt={school.name}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />
                )}
                <h3 className="font-bold text-lg">{school.name}</h3>
                <p className="text-sm text-gray-600">{school.address}</p>
                {school.contactNumber && <p className="text-sm text-gray-600">Tel: {school.contactNumber}</p>}
                <Button className="w-full mt-2" size="sm" onClick={() => handleSchoolClick(school._id)}>
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

