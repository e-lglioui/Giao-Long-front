"use client"

import { useState } from "react"
import { FileText, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { openDocument } from "../utils/instructor-utils"
import { useToast } from "@/hooks/use-toast"

interface DocumentViewerProps {
  documentUrl?: string
  documentName: string
  documentType?: string
}

export function DocumentViewer({ documentUrl, documentName, documentType = "Document" }: DocumentViewerProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const { toast } = useToast()

  if (!documentUrl) {
    return (
      <div className="text-gray-500 italic flex items-center">
        <FileText className="h-4 w-4 mr-2 opacity-50" />
        Non disponible
      </div>
    )
  }

  const handleOpenDocument = async () => {
    const showError = (message: string) => {
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      })
    }

    await openDocument(documentUrl, showError)
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = documentUrl
    link.download = `${documentName.replace(/\s+/g, "-").toLowerCase()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-800 p-0"
          onClick={handleOpenDocument}
        >
          <Eye className="h-4 w-4 mr-1" />
          Voir
        </Button>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 p-0" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          Télécharger
        </Button>
      </div>
    </>
  )
}

