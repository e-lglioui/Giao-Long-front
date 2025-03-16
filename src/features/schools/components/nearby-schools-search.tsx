"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { MapPin, Search } from "lucide-react"

interface NearbySchoolsSearchProps {
  onSearch: (latitude: number, longitude: number, maxDistance: number) => void
  isLoading: boolean
}

export function NearbySchoolsSearch({ onSearch, isLoading }: NearbySchoolsSearchProps) {
  const [latitude, setLatitude] = useState<number | string>("")
  const [longitude, setLongitude] = useState<number | string>("")
  const [maxDistance, setMaxDistance] = useState<number>(5000)
  const { toast } = useToast()

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
        },
        (error) => {
          toast({
            title: "Error",
            description: `Failed to get your location: ${error.message}`,
            variant: "destructive",
          })
        },
      )
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      })
    }
  }

  const handleSearch = () => {
    if (!latitude || !longitude) {
      toast({
        title: "Error",
        description: "Please enter both latitude and longitude",
        variant: "destructive",
      })
      return
    }

    onSearch(Number(latitude), Number(longitude), maxDistance)
  }

  return (
    <div className="space-y-4 p-4 border rounded-md bg-background">
      <h3 className="text-lg font-medium">Find Nearby Schools</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="0.0001"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="e.g. 40.7128"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="0.0001"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="e.g. -74.0060"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="maxDistance">Max Distance (meters): {maxDistance}</Label>
        </div>
        <Slider
          id="maxDistance"
          min={1000}
          max={20000}
          step={1000}
          value={[maxDistance]}
          onValueChange={(values) => setMaxDistance(values[0])}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1km</span>
          <span>20km</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" className="flex-1" onClick={handleUseCurrentLocation}>
          <MapPin className="w-4 h-4 mr-2" />
          Use My Location
        </Button>

        <Button className="flex-1" onClick={handleSearch} disabled={isLoading || !latitude || !longitude}>
          <Search className="w-4 h-4 mr-2" />
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
    </div>
  )
}

