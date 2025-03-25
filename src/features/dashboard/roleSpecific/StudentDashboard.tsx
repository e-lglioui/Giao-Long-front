"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Clock, CheckCircle, FileText, MessageSquare, CreditCard, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface EnrollmentSummary {
  id: string
  className: string
  instructorName: string
  instructorAvatar?: string
  schedule: string
  progress: number
  nextClass: string
  status: "active" | "completed" | "pending"
}

interface Assignment {
  id: string
  title: string
  className: string
  dueDate: string
  status: "completed" | "pending" | "overdue"
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<EnrollmentSummary[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in a real app, fetch this from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEnrollments([
        {
          id: "1",
          className: "Advanced Mathematics",
          instructorName: "Dr. Smith",
          instructorAvatar: "/placeholder.svg?height=40&width=40",
          schedule: "Mon, Wed, Fri - 10:00 AM",
          progress: 65,
          nextClass: "Tomorrow, 10:00 AM",
          status: "active",
        },
        {
          id: "2",
          className: "Introduction to Physics",
          instructorName: "Prof. Johnson",
          instructorAvatar: "/placeholder.svg?height=40&width=40",
          schedule: "Tue, Thu - 2:00 PM",
          progress: 42,
          nextClass: "Thursday, 2:00 PM",
          status: "active",
        },
        {
          id: "3",
          className: "Biology 101",
          instructorName: "Dr. Williams",
          instructorAvatar: "/placeholder.svg?height=40&width=40",
          schedule: "Mon, Fri - 9:00 AM",
          progress: 78,
          nextClass: "Friday, 9:00 AM",
          status: "active",
        },
      ])

      setAssignments([
        {
          id: "1",
          title: "Calculus Problem Set",
          className: "Advanced Mathematics",
          dueDate: "Tomorrow",
          status: "pending",
        },
        {
          id: "2",
          title: "Physics Lab Report",
          className: "Introduction to Physics",
          dueDate: "Next Week",
          status: "pending",
        },
        {
          id: "3",
          title: "Cell Structure Essay",
          className: "Biology 101",
          dueDate: "Yesterday",
          status: "overdue",
        },
        {
          id: "4",
          title: "Algebra Quiz",
          className: "Advanced Mathematics",
          dueDate: "Last Week",
          status: "completed",
        },
      ])

      setIsLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "completed":
        return <Badge className="bg-gray-500">Completed</Badge>
      case "pending":
        return <Badge className="bg-blue-500">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-500">Overdue</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/dashboard/schedule">
              <Calendar className="mr-2 h-4 w-4" />
              My Schedule
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/courses/browse">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Courses
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="enrollments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrollments">My Enrollments</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="progress">Academic Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Enrollments</CardTitle>
              <CardDescription>Classes you're currently enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading enrollments...</div>
              ) : enrollments.length > 0 ? (
                <div className="space-y-6">
                  {enrollments.map((enrollment) => (
                    <Card key={enrollment.id} className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 border">
                              <AvatarImage src={enrollment.instructorAvatar} alt={enrollment.instructorName} />
                              <AvatarFallback>{enrollment.instructorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{enrollment.className}</h3>
                              <p className="text-sm text-gray-500">Instructor: {enrollment.instructorName}</p>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                {enrollment.schedule}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">Course Progress: {enrollment.progress}%</span>
                            </div>
                            <Progress value={enrollment.progress} className="h-2 w-32 mb-2" />
                            <p className="text-xs text-gray-500">Next class: {enrollment.nextClass}</p>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/dashboard/enrollments/${enrollment.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>You're not enrolled in any classes</p>
                  <Button asChild className="mt-4">
                    <Link to="/dashboard/courses/browse">Browse Courses</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Your current and upcoming assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading assignments...</div>
              ) : assignments.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Due Soon</h3>
                    {assignments
                      .filter((a) => a.status === "pending")
                      .map((assignment) => (
                        <Card key={assignment.id} className="bg-blue-50 border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{assignment.title}</h3>
                                <p className="text-sm text-gray-500">{assignment.className}</p>
                              </div>
                              <div className="text-right">
                                <div>{getStatusBadge(assignment.status)}</div>
                                <p className="text-sm text-gray-500 mt-1">Due: {assignment.dueDate}</p>
                              </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <Button asChild variant="outline" size="sm">
                                <Link to={`/dashboard/assignments/${assignment.id}`}>View Assignment</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  {assignments.filter((a) => a.status === "overdue").length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
                      {assignments
                        .filter((a) => a.status === "overdue")
                        .map((assignment) => (
                          <Card key={assignment.id} className="bg-red-50 border-red-200">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{assignment.title}</h3>
                                  <p className="text-sm text-gray-500">{assignment.className}</p>
                                </div>
                                <div className="text-right">
                                  <div>{getStatusBadge(assignment.status)}</div>
                                  <p className="text-sm text-gray-500 mt-1">Due: {assignment.dueDate}</p>
                                </div>
                              </div>
                              <div className="flex justify-end mt-4">
                                <Button asChild variant="outline" size="sm">
                                  <Link to={`/dashboard/assignments/${assignment.id}`}>Submit Now</Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}

                  {assignments.filter((a) => a.status === "completed").length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                      {assignments
                        .filter((a) => a.status === "completed")
                        .map((assignment) => (
                          <Card key={assignment.id} className="bg-gray-50 border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{assignment.title}</h3>
                                  <p className="text-sm text-gray-500">{assignment.className}</p>
                                </div>
                                <div className="text-right">
                                  <div>{getStatusBadge(assignment.status)}</div>
                                  <p className="text-sm text-gray-500 mt-1">Due: {assignment.dueDate}</p>
                                </div>
                              </div>
                              <div className="flex justify-end mt-4">
                                <Button asChild variant="outline" size="sm">
                                  <Link to={`/dashboard/assignments/${assignment.id}`}>View Feedback</Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No assignments found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>Your performance across all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{enrollment.className}</h3>
                      <span className="text-sm font-medium">{enrollment.progress}% Complete</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                ))}

                <div className="mt-6 flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/dashboard/progress">View Detailed Progress</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Classes and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="bg-blue-100 text-blue-700 rounded p-2 flex-shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Advanced Mathematics</p>
                  <p className="text-sm text-gray-500">Tomorrow, 10:00 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="bg-red-100 text-red-700 rounded p-2 flex-shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Calculus Problem Set Due</p>
                  <p className="text-sm text-gray-500">Tomorrow, 11:59 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="bg-green-100 text-green-700 rounded p-2 flex-shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Physics Mid-term Exam</p>
                  <p className="text-sm text-gray-500">Next Monday, 2:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-700 rounded p-2 flex-shrink-0">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Course Registration Opens</p>
                  <p className="text-sm text-gray-500">Next Friday, 9:00 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/courses/browse" className="flex flex-col items-start">
                  <BookOpen className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Browse Courses</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/schedule" className="flex flex-col items-start">
                  <Calendar className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">View Schedule</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/assignments" className="flex flex-col items-start">
                  <FileText className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Assignments</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/messages" className="flex flex-col items-start">
                  <MessageSquare className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Messages</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/payments" className="flex flex-col items-start">
                  <CreditCard className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Payments</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/profile" className="flex flex-col items-start">
                  <User className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">My Profile</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StudentDashboard

