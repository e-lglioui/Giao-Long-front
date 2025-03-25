"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  BarChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCard } from "../StatsCard"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ClassSummary {
  id: string
  name: string
  schedule: string
  students: number
  capacity: number
  status: "active" | "upcoming" | "completed"
}

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth()
  const [classes, setClasses] = useState<ClassSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in a real app, fetch this from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClasses([
        {
          id: "1",
          name: "Advanced Mathematics",
          schedule: "Mon, Wed, Fri - 10:00 AM",
          students: 18,
          capacity: 25,
          status: "active",
        },
        {
          id: "2",
          name: "Introduction to Physics",
          schedule: "Tue, Thu - 2:00 PM",
          students: 22,
          capacity: 25,
          status: "active",
        },
        {
          id: "3",
          name: "Chemistry Lab",
          schedule: "Wed - 3:30 PM",
          students: 15,
          capacity: 20,
          status: "upcoming",
        },
        {
          id: "4",
          name: "Biology 101",
          schedule: "Mon, Fri - 9:00 AM",
          students: 20,
          capacity: 20,
          status: "active",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>
      case "completed":
        return <Badge className="bg-gray-500">Completed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const activeClasses = classes.filter((c) => c.status === "active").length
  const upcomingClasses = classes.filter((c) => c.status === "upcoming").length
  const totalStudents = classes.reduce((acc, c) => acc + c.students, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/dashboard/classes/schedule">
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/classes/create">
              <BookOpen className="mr-2 h-4 w-4" />
              Create Class
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Active Classes"
          metric={isLoading ? "Loading..." : activeClasses.toString()}
          progress={activeClasses > 0 ? 100 : 0}
          target="Classes"
        />
        <StatsCard
          title="Upcoming Classes"
          metric={isLoading ? "Loading..." : upcomingClasses.toString()}
          progress={upcomingClasses > 0 ? 100 : 0}
          target="Classes"
        />
        <StatsCard
          title="Total Students"
          metric={isLoading ? "Loading..." : totalStudents.toString()}
          progress={totalStudents > 0 ? 100 : 0}
          target="Students"
        />
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today's Classes</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
          <TabsTrigger value="all">All Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Classes you're teaching today</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading classes...</div>
              ) : classes.filter((c) => c.status === "active").length > 0 ? (
                <div className="space-y-4">
                  {classes
                    .filter((c) => c.status === "active")
                    .map((cls) => (
                      <Card key={cls.id} className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">{cls.name}</h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                {cls.schedule}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {cls.students}/{cls.capacity} Students
                                </span>
                              </div>
                              <Progress value={(cls.students / cls.capacity) * 100} className="h-2 w-24" />
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/dashboard/classes/${cls.id}`}>Manage Class</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No classes scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>Your upcoming teaching schedule</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading classes...</div>
              ) : classes.filter((c) => c.status === "upcoming").length > 0 ? (
                <div className="space-y-4">
                  {classes
                    .filter((c) => c.status === "upcoming")
                    .map((cls) => (
                      <Card key={cls.id} className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">{cls.name}</h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                {cls.schedule}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {cls.students}/{cls.capacity} Students
                                </span>
                              </div>
                              <Progress value={(cls.students / cls.capacity) * 100} className="h-2 w-24" />
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/dashboard/classes/${cls.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No upcoming classes scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Classes</CardTitle>
              <CardDescription>Complete list of your classes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading classes...</div>
              ) : classes.length > 0 ? (
                <div className="space-y-4">
                  {classes.map((cls) => (
                    <Card key={cls.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{cls.name}</h3>
                              {getStatusBadge(cls.status)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {cls.schedule}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">
                                {cls.students}/{cls.capacity} Students
                              </span>
                            </div>
                            <Progress value={(cls.students / cls.capacity) * 100} className="h-2 w-24" />
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/dashboard/classes/${cls.id}`}>Manage Class</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No classes found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
            <CardDescription>Recent assessment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Advanced Mathematics</h3>
                  <p className="text-sm text-gray-500">Last assessment: 2 days ago</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Avg. Score: 78%</p>
                  <p className="text-sm text-gray-500">18 students</p>
                </div>
              </div>
              <Progress value={78} className="h-2" />

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Introduction to Physics</h3>
                  <p className="text-sm text-gray-500">Last assessment: 5 days ago</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Avg. Score: 82%</p>
                  <p className="text-sm text-gray-500">22 students</p>
                </div>
              </div>
              <Progress value={82} className="h-2" />

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Biology 101</h3>
                  <p className="text-sm text-gray-500">Last assessment: 1 week ago</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Avg. Score: 75%</p>
                  <p className="text-sm text-gray-500">20 students</p>
                </div>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div className="mt-6 flex justify-end">
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard/assessments">
                  <BarChart className="mr-2 h-4 w-4" />
                  View All Assessments
                </Link>
              </Button>
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
                <Link to="/dashboard/attendance" className="flex flex-col items-start">
                  <CheckCircle className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Take Attendance</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/assessments/create" className="flex flex-col items-start">
                  <FileText className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Create Assessment</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/materials" className="flex flex-col items-start">
                  <BookOpen className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Upload Materials</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/messages" className="flex flex-col items-start">
                  <MessageSquare className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Message Students</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/reports" className="flex flex-col items-start">
                  <BarChart className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Generate Reports</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/issues" className="flex flex-col items-start">
                  <AlertCircle className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Report Issues</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default InstructorDashboard

