"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { MySchoolCheck } from "../components/my-school-check"
import { schoolAdminService } from "../services/school-admin.service"

// Mock data for payments
const mockPayments = [
  {
    id: "1",
    studentName: "Alex Johnson",
    studentId: "ST001",
    amount: 250,
    date: "2024-03-15",
    dueDate: "2024-03-10",
    status: "paid",
    paymentMethod: "Credit Card",
    description: "Monthly Tuition - March",
  },
  {
    id: "2",
    studentName: "Maria Garcia",
    studentId: "ST002",
    amount: 250,
    date: "",
    dueDate: "2024-03-10",
    status: "overdue",
    paymentMethod: "",
    description: "Monthly Tuition - March",
  },
  {
    id: "3",
    studentName: "James Wilson",
    studentId: "ST003",
    amount: 350,
    date: "2024-03-05",
    dueDate: "2024-03-10",
    status: "paid",
    paymentMethod: "Bank Transfer",
    description: "Monthly Tuition + Equipment Fee",
  },
  {
    id: "4",
    studentName: "Sarah Lee",
    studentId: "ST004",
    amount: 250,
    date: "",
    dueDate: "2024-03-20",
    status: "pending",
    paymentMethod: "",
    description: "Monthly Tuition - March",
  },
]

// Mock data for students
const mockStudents = [
  { id: "ST001", name: "Alex Johnson" },
  { id: "ST002", name: "Maria Garcia" },
  { id: "ST003", name: "James Wilson" },
  { id: "ST004", name: "Sarah Lee" },
  { id: "ST005", name: "David Chen" },
  { id: "ST006", name: "Emma Brown" },
]

const paymentFormSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  amount: z.string().min(1, "Amount is required"),
  dueDate: z.string().min(1, "Due date is required"),
  description: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

export default function PaymentManagement() {
  const [payments, setPayments] = useState(mockPayments)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isMarkAsPaidDialogOpen, setIsMarkAsPaidDialogOpen] = useState(false)
  const [currentPayment, setCurrentPayment] = useState<any>(null)
  const [hasSchool, setHasSchool] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      studentId: "",
      amount: "",
      dueDate: "",
      description: "",
    },
  })

  useEffect(() => {
    const checkSchool = async () => {
      try {
        setLoading(true)
        await schoolAdminService.getMySchool()
        setHasSchool(true)
      } catch (err: any) {
        if (err.statusCode === 404) {
          // No school yet
          setHasSchool(false)
        } else {
          toast({
            title: "Error",
            description: err.message || "Failed to check school status",
            variant: "destructive",
          })
        }
      } finally {
        setLoading(false)
      }
    }

    checkSchool()
  }, [toast])

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "paid") return matchesSearch && payment.status === "paid"
    if (activeTab === "pending") return matchesSearch && payment.status === "pending"
    if (activeTab === "overdue") return matchesSearch && payment.status === "overdue"

    return matchesSearch
  })

  const handleAddPayment = (data: PaymentFormValues) => {
    const student = mockStudents.find((s) => s.id === data.studentId)
    const newPayment = {
      id: (payments.length + 1).toString(),
      studentName: student?.name || "Unknown Student",
      studentId: data.studentId,
      amount: Number.parseFloat(data.amount),
      date: "",
      dueDate: data.dueDate,
      status: "pending",
      paymentMethod: "",
      description: data.description || "Monthly Tuition",
    }
    setPayments([...payments, newPayment])
    setIsAddDialogOpen(false)
    form.reset()
    toast({
      title: "Payment Added",
      description: `Payment for ${student?.name} has been added.`,
    })
  }

  const handleEditPayment = (data: PaymentFormValues) => {
    const student = mockStudents.find((s) => s.id === data.studentId)
    const updatedPayments = payments.map((payment) =>
      payment.id === currentPayment.id
        ? {
            ...payment,
            studentName: student?.name || payment.studentName,
            studentId: data.studentId,
            amount: Number.parseFloat(data.amount),
            dueDate: data.dueDate,
            description: data.description || payment.description,
          }
        : payment,
    )
    setPayments(updatedPayments)
    setIsEditDialogOpen(false)
    toast({
      title: "Payment Updated",
      description: `Payment for ${student?.name} has been updated.`,
    })
  }

  const handleDeletePayment = () => {
    const updatedPayments = payments.filter((payment) => payment.id !== currentPayment.id)
    setPayments(updatedPayments)
    setIsDeleteDialogOpen(false)
    toast({
      title: "Payment Deleted",
      description: `Payment for ${currentPayment.studentName} has been deleted.`,
    })
  }

  const handleMarkAsPaid = () => {
    const today = new Date().toISOString().split("T")[0]
    const updatedPayments = payments.map((payment) =>
      payment.id === currentPayment.id
        ? {
            ...payment,
            status: "paid",
            date: today,
            paymentMethod: "Manual Entry",
          }
        : payment,
    )
    setPayments(updatedPayments)
    setIsMarkAsPaidDialogOpen(false)
    toast({
      title: "Payment Marked as Paid",
      description: `Payment for ${currentPayment.studentName} has been marked as paid.`,
    })
  }

  const openEditDialog = (payment: any) => {
    setCurrentPayment(payment)
    form.reset({
      studentId: payment.studentId,
      amount: payment.amount.toString(),
      dueDate: payment.dueDate,
      description: payment.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (payment: any) => {
    setCurrentPayment(payment)
    setIsDeleteDialogOpen(true)
  }

  const openMarkAsPaidDialog = (payment: any) => {
    setCurrentPayment(payment)
    setIsMarkAsPaidDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Overdue
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (hasSchool === false) {
    return <MySchoolCheck />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <Button
          onClick={() => {
            form.reset()
            setIsAddDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {payments
                .filter((p) => p.status === "paid")
                .reduce((sum, p) => sum + p.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {payments.filter((p) => p.status === "paid").length} payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {payments
                .filter((p) => p.status === "pending")
                .reduce((sum, p) => sum + p.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {payments.filter((p) => p.status === "pending").length} payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              $
              {payments
                .filter((p) => p.status === "overdue")
                .reduce((sum, p) => sum + p.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {payments.filter((p) => p.status === "overdue").length} payments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>Manage student payments and track payment status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search payments..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="ml-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                        <p>No payments found</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => {
                            form.reset()
                            setIsAddDialogOpen(true)
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Payment
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="font-medium">{payment.studentName}</div>
                          <div className="text-xs text-muted-foreground">{payment.studentId}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{payment.description}</TableCell>
                        <TableCell>
                          <div className="font-medium">${payment.amount.toFixed(2)}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {payment.dueDate}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {payment.status !== "paid" && (
                                <DropdownMenuItem onClick={() => openMarkAsPaidDialog(payment)}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark as Paid
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => openEditDialog(payment)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(payment)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
            <DialogDescription>Add a new payment record for a student.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddPayment)} className="space-y-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="250.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Monthly Tuition" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Payment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>Update payment information.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditPayment)} className="space-y-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Payment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Mark as Paid Dialog */}
      <Dialog open={isMarkAsPaidDialogOpen} onOpenChange={setIsMarkAsPaidDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Payment as Paid</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this payment as paid? This will record today's date as the payment date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Student:</p>
                <p className="text-sm">{currentPayment?.studentName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount:</p>
                <p className="text-sm">${currentPayment?.amount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Description:</p>
                <p className="text-sm">{currentPayment?.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Due Date:</p>
                <p className="text-sm">{currentPayment?.dueDate}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMarkAsPaidDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkAsPaid}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment record for {currentPayment?.studentName}? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePayment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

