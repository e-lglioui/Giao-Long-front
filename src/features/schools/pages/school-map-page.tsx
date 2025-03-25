"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { MapPin } from "lucide-react"
import { SchoolMap } from "../components/school-map"
import { NearbySchoolsSearch } from "../components/nearby-schools-search"
import { schoolService } from "../services/school.service"
import type { School } from "../types/school.types"

export function SchoolMapPage() {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nearbySchools, setNearbySchools] = useState<School[] | null>(null)
  const { toast } = useToast()

  const handleNearbySearch = async (latitude: number, longitude: number, maxDistance: number) => {
    try {
      setIsLoading(true)
      const schools = await schoolService.getNearbySchools(latitude, longitude, maxDistance)
      setNearbySchools(schools)
      setActiveTab("nearby")

      if (schools.length === 0) {
        toast({
          title: "No schools found",
          description: `No schools found within ${maxDistance} meters of your location.`,
        })
      } else {
        toast({
          title: "Schools found",
          description: `Found ${schools.length} schools near your location.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch nearby schools",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">School Map</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <NearbySchoolsSearch onSearch={handleNearbySearch} isLoading={isLoading} />
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                School Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Schools</TabsTrigger>
                  <TabsTrigger value="nearby" disabled={!nearbySchools}>
                    Nearby Schools
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <SchoolMap />
                </TabsContent>

                <TabsContent value="nearby">{nearbySchools && <SchoolMap schools={nearbySchools} />}</TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

