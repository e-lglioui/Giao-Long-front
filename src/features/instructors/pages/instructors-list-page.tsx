"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Edit, Trash2, Search, UserPlus, User } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchInstructors, deleteInstructor } from "../instructorSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { Instructor } from "../services/instructor.service"

export function InstructorsListPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Add a fallback for the instructors state
  const instructorsState = useAppSelector((state) => state.instructors) || {
    instructors: [],
    loading: false,
    error: null,
  }

  const { instructors, loading, error } = instructorsState

  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [instructorToDelete, setInstructorToDelete] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchInstructors())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleDeleteClick = (id: string) => {
    setInstructorToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (instructorToDelete) {
      try {
        await dispatch(deleteInstructor(instructorToDelete)).unwrap()
        setDeleteDialogOpen(false)
        setInstructorToDelete(null)
        toast({
          title: "Succès",
          description: "Instructeur supprimé avec succès",
        })
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

  const filteredInstructors = instructors.filter(
    (instructor: Instructor) =>
      instructor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      instructor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      instructor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      instructor.specialties?.some((specialty: string) =>
        specialty?.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      false,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Instructeurs</h1>
        <Button onClick={() => navigate("/dashboard/instructors/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Instructeur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Instructeurs</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom, email ou spécialité..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Spécialités</TableHead>
                  <TableHead>Expérience</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun instructeur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInstructors.map((instructor: Instructor) => (
                    <TableRow key={instructor.id}>
                      <TableCell>
                        <Link to={`/dashboard/instructors/${instructor.id}`} className="font-medium hover:underline">
                          {instructor.firstName} {instructor.lastName}
                        </Link>
                      </TableCell>
                      <TableCell>{instructor.email}</TableCell>
                      <TableCell>{instructor.phone}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {instructor.specialties?.map((specialty: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {specialty}
                            </Badge>
                          )) || null}
                        </div>
                      </TableCell>
                      <TableCell>{instructor.yearsOfExperience} ans</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/dashboard/instructors/${instructor.id}/full-profile`)}
                            title="Voir le profil complet"
                          >
                            <User className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/dashboard/instructors/${instructor.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteClick(instructor.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/dashboard/schools/select/instructor/${instructor.id}`)}
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet instructeur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

