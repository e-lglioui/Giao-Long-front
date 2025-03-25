"use client"

import { useState } from "react"
import { ChevronRight, Download, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { handleImageError } from "../utils/instructor-utils"

interface ProfileImageGalleryProps {
  images: string[]
  name: string
  currentImage?: string
  onSelectImage?: (imageUrl: string) => void
}

export function ProfileImageGallery({ images, name, currentImage, onSelectImage }: ProfileImageGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter out any undefined or null images
  const validImages = images.filter(Boolean)

  // Ajoutons un log pour déboguer les URLs d'images
  const debugImageUrl = (url: string) => {
    console.log(`Trying to load image: ${url}`)
    return url
  }

  if (!validImages.length) {
    return null
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
  }

  const handleSelectImage = (imageUrl: string) => {
    if (onSelectImage) {
      onSelectImage(imageUrl)
    }
    setGalleryOpen(false)
  }

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `${name.replace(/\s+/g, "-").toLowerCase()}-profile-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Button variant="outline" size="sm" className="mt-2" onClick={() => setGalleryOpen(true)}>
        Voir toutes les photos ({validImages.length})
      </Button>

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Photos de profil de {name}</DialogTitle>
            <DialogClose />
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {validImages.map((imageUrl, index) => (
              <Card key={index} className="overflow-hidden group relative">
                <CardContent className="p-0">
                  <img
                    src={debugImageUrl(imageUrl || "/placeholder.svg?height=150&width=150")}
                    alt={`${name} - Photo ${index + 1}`}
                    className="w-full h-40 object-cover cursor-pointer"
                    onClick={() => setFullscreenImage(imageUrl)}
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white"
                      onClick={() => handleSelectImage(imageUrl)}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white"
                      onClick={() => setFullscreenImage(imageUrl)}
                    >
                      <Maximize2 className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-white" onClick={() => handleDownload(imageUrl)}>
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!fullscreenImage} onOpenChange={() => setFullscreenImage(null)}>
        <DialogContent className="sm:max-w-[90vw] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Photo de profil</DialogTitle>
            <DialogClose />
          </DialogHeader>

          <div className="flex-1 flex items-center justify-center relative">
            {fullscreenImage && (
              <img
                src={debugImageUrl(fullscreenImage || "/placeholder.svg?height=400&width=400")}
                alt={`${name} - Photo en plein écran`}
                className="max-h-full max-w-full object-contain"
                onError={handleImageError}
              />
            )}

            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4">
              <Button variant="outline" size="sm" onClick={() => handleSelectImage(fullscreenImage!)}>
                Utiliser comme photo principale
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload(fullscreenImage!)}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

