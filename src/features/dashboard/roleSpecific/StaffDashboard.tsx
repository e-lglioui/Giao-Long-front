"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ClipboardList,
  School,
  Calendar,
  CheckCircle,
  Clock,
  Users,
  FileText,
  MessageSquare,
  Bell,
  HelpCircle,
  Phone,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCard } from "../StatsCard"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed"
  assignedBy: string
}

interface SchoolInfo {
  id: string
  name: string
  address: string
  contactNumber: string
  adminName: string
  adminAvatar?: string
}

const StaffDashboard: React.FC = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in a real app, fetch this from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTasks([
        {
          id: "1",
          title: "Update student records",
          description: "Update contact information for new students",
          dueDate: "Today",
          priority: "high",
          status: "in-progress",
          assignedBy: "Sarah Johnson",
        },
        {
          id: "2",
          title: "Prepare monthly attendance report",
          description: "Compile attendance data for all classes",
          dueDate: "Tomorrow",
          priority: "medium",
          status: "pending",
          assignedBy: "Michael Chen",
        },
        {
          id: "3",
          title: "Organize parent-teacher meeting",
          description: "Book rooms and prepare schedule",
          dueDate: "Next Week",
          priority: "medium",
          status: "pending",
          assignedBy: "Sarah Johnson",
        },
        {
          id: "4",
          title: "Process new enrollment applications",
          description: "Review and process pending applications",
          dueDate: "Yesterday",
          priority: "high",
          status: "completed",
          assignedBy: "Michael Chen",
        },
        {
          id: "5",
          title: "Update school calendar",
          description: "Add upcoming events to the school calendar",
          dueDate: "3 days ago",
          priority: "low",
          status: "completed",
          assignedBy: "Sarah Johnson",
        },
      ])

      setSchoolInfo({
        id: "1",
        name: "Westside Academy",
        address: "123 Education St, Springfield",
        contactNumber: "(555) 123-4567",
        adminName: "Sarah Johnson",
        adminAvatar: "/placeholder.svg?height=40&width=40",
      })

      setIsLoading(false)
    }, 1000)
  }, [])

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>
      case "low":
        return <Badge className="bg-green-500">Low</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-500">Pending</Badge>
      case "in-progress":
        return <Badge className="bg-purple-500">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/dashboard/tasks">
              <ClipboardList className="mr-2 h-4 w-4" />
              View All Tasks
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/tasks/create">
              <CheckCircle className="mr-2 h-4 w-4" />
              Create Task
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Tasks"
          metric={isLoading ? "Loading..." : pendingTasks.toString()}
          progress={pendingTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0}
          target={`of ${totalTasks} tasks`}
        />
        <StatsCard
          title="In Progress"
          metric={isLoading ? "Loading..." : inProgressTasks.toString()}
          progress={inProgressTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}
          target={`of ${totalTasks} tasks`}
        />
        <StatsCard
          title="Completed"
          metric={isLoading ? "Loading..." : completedTasks.toString()}
          progress={completedTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}
          target={`of ${totalTasks} tasks`}
        />
        <StatsCard
          title="Completion Rate"
          metric={isLoading ? "Loading..." : `${completionRate}%`}
          progress={completionRate}
          target="Overall"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Tasks</TabsTrigger>
              <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Tasks</CardTitle>
                  <CardDescription>Tasks that need your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">Loading tasks...</div>
                  ) : tasks.filter((task) => task.status !== "completed").length > 0 ? (
                    <div className="space-y-4">
                      {tasks
                        .filter((task) => task.status !== "completed")
                        .map((task) => (
                          <Card
                            key={task.id}
                            className={
                              task.priority === "high"
                                ? "bg-red-50 border-red-200"
                                : task.priority === "medium"
                                  ? "bg-yellow-50 border-yellow-200"
                                  : "bg-green-50 border-green-200"
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">{task.title}</h3>
                                    {getPriorityBadge(task.priority)}
                                    {getStatusBadge(task.status)}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                  <div className="flex items-center text-sm text-gray-500 mt-2">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Due: {task.dueDate}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">Assigned by: {task.assignedBy}</div>
                                </div>
                                <div className="flex items-center gap-2 mt-2 md:mt-0">
                                  {task.status === "pending" ? (
                                    <Button size="sm">Start Task</Button>
                                  ) : (
                                    <Button size="sm">Complete Task</Button>
                                  )}
                                  <Button asChild variant="outline" size="sm">
                                    <Link to={`/dashboard/tasks/${task.id}`}>View Details</Link>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No active tasks found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Tasks</CardTitle>
                  <CardDescription>Tasks you've already completed</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">Loading tasks...</div>
                  ) : tasks.filter((task) => task.status === "completed").length > 0 ? (
                    <div className="space-y-4">
                      {tasks
                        .filter((task) => task.status === "completed")
                        .map((task) => (
                          <Card key={task.id} className="bg-gray-50 border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">{task.title}</h3>
                                    {getPriorityBadge(task.priority)}
                                    {getStatusBadge(task.status)}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                  <div className="flex items-center text-sm text-gray-500 mt-2">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Due: {task.dueDate}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">Assigned by: {task.assignedBy}</div>
                                </div>
                                <div className="flex items-center gap-2 mt-2 md:mt-0">
                                  <Button asChild variant="outline" size="sm">
                                    <Link to={`/dashboard/tasks/${task.id}`}>View Details</Link>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No completed tasks found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Tasks</CardTitle>
                  <CardDescription>Complete list of your tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">Loading tasks...</div>
                  ) : tasks.length > 0 ? (
                    <div className="space-y-4">
                      {tasks.map((task) => (
                        <Card
                          key={task.id}
                          className={
                            task.status === "completed"
                              ? "bg-gray-50 border-gray-200"
                              : task.priority === "high"
                                ? "bg-red-50 border-red-200"
                                : task.priority === "medium"
                                  ? "bg-yellow-50 border-yellow-200"
                                  : "bg-green-50 border-green-200"
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">{task.title}</h3>
                                  {getPriorityBadge(task.priority)}
                                  {getStatusBadge(task.status)}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Due: {task.dueDate}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Assigned by: {task.assignedBy}</div>
                              </div>
                              <div className="flex items-center gap-2 mt-2 md:mt-0">
                                {task.status !== "completed" &&
                                  (task.status === "pending" ? (
                                    <Button size="sm">Start Task</Button>
                                  ) : (
                                    <Button size="sm">Complete Task</Button>
                                  ))}
                                <Button asChild variant="outline" size="sm">
                                  <Link to={`/dashboard/tasks/${task.id}`}>View Details</Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ClipboardList className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No tasks found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {schoolInfo && (
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
                <CardDescription>Your assigned school</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{schoolInfo.name}</h3>
                    <p className="text-sm text-gray-500">{schoolInfo.address}</p>
                    <p className="text-sm text-gray-500">{schoolInfo.contactNumber}</p>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">School Administrator</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={schoolInfo.adminAvatar} alt={schoolInfo.adminName} />
                        <AvatarFallback>{schoolInfo.adminName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{schoolInfo.adminName}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/dashboard/schools/${schoolInfo.id}`}>View School Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" className="h-auto py-3 justify-start">
                  <Link to="/dashboard/students" className="flex flex-col items-start">
                    <Users className="h-5 w-5 mb-1" />
                    <span className="text-sm font-medium">Student Records</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto py-3 justify-start">
                  <Link to="/dashboard/calendar" className="flex flex-col items-start">
                    <Calendar className="h-5 w-5 mb-1" />
                    <span className="text-sm font-medium">School Calendar</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto py-3 justify-start">
                  <Link to="/dashboard/reports" className="flex flex-col items-start">
                    <FileText className="h-5 w-5 mb-1" />
                    <span className="text-sm font-medium">Generate Reports</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto py-3 justify-start">
                  <Link to="/dashboard/messages" className="flex flex-col items-start">
                    <MessageSquare className="h-5 w-5 mb-1" />
                    <span className="text-sm font-medium">Messages</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>School calendar events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="bg-blue-100 text-blue-700 rounded p-2 flex-shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Parent-Teacher Meeting</p>
                    <p className="text-sm text-gray-500">Tomorrow, 4:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="bg-purple-100 text-purple-700 rounded p-2 flex-shrink-0">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">End of Term</p>
                    <p className="text-sm text-gray-500">Next Friday</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 text-green-700 rounded p-2 flex-shrink-0">
                    <School className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">School Assembly</p>
                    <p className="text-sm text-gray-500">Monday, 9:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Resources</CardTitle>
          <CardDescription>Help and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <HelpCircle className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Help Center</h3>
                  <p className="text-sm text-gray-500 mt-1">Access tutorials and FAQs</p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link to="/dashboard/help">View Help Center</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Phone className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">IT Support</h3>
                  <p className="text-sm text-gray-500 mt-1">Call (555) 987-6543</p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <a href="tel:5559876543">Call Support</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Mail className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-sm text-gray-500 mt-1">support@edumanage.com</p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <a href="mailto:support@edumanage.com">Send Email</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StaffDashboard

