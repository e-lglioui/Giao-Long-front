"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, School, BookOpen, Calendar, UserCog, GraduationCap, Award, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCard } from "../StatsCard"

interface SchoolSummary {
  id: string
  name: string
  staffCount: number
  instructorCount: number
  studentCount: number
  classCount: number
  style: string
}

const SchoolAdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const [schools, setSchools] = useState<SchoolSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in a real app, fetch this from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSchools([
        {
          id: "1",
          name: "Golden Dragon Kung Fu Academy",
          staffCount: 8,
          instructorCount: 12,
          studentCount: 180,
          classCount: 24,
          style: "Wing Chun",
        },
        {
          id: "2",
          name: "Silver Tiger Martial Arts Center",
          staffCount: 5,
          instructorCount: 7,
          studentCount: 120,
          classCount: 15,
          style: "Tai Chi & Shaolin",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kung Fu School Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/dashboard/schools/create">
              <School className="mr-2 h-4 w-4" />
              Manage School
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/staff/create">
              <UserCog className="mr-2 h-4 w-4" />
              Add Staff
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="instructors">Masters & Instructors</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Staff"
              metric={isLoading ? "Loading..." : schools.reduce((acc, school) => acc + school.staffCount, 0).toString()}
              progress={85}
              target="Capacity"
            />
            <StatsCard
              title="Total Masters & Instructors"
              metric={
                isLoading ? "Loading..." : schools.reduce((acc, school) => acc + school.instructorCount, 0).toString()
              }
              progress={70}
              target="Capacity"
            />
            <StatsCard
              title="Total Students"
              metric={
                isLoading ? "Loading..." : schools.reduce((acc, school) => acc + school.studentCount, 0).toString()
              }
              progress={90}
              target="Capacity"
            />
            <StatsCard
              title="Active Classes"
              metric={isLoading ? "Loading..." : schools.reduce((acc, school) => acc + school.classCount, 0).toString()}
              progress={65}
              target="Capacity"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schools.map((school) => (
              <Card key={school.id}>
                <CardHeader>
                  <CardTitle>{school.name}</CardTitle>
                  <CardDescription>Style: {school.style}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Staff</p>
                          <p className="font-medium">{school.staffCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Masters & Instructors</p>
                          <p className="font-medium">{school.instructorCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Students</p>
                          <p className="font-medium">{school.studentCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Classes</p>
                          <p className="font-medium">{school.classCount}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/dashboard/schools/${school.id}`}>Manage School</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
              <CardDescription>Manage your Kung Fu school staff members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Administrative Staff</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">6</div>
                    <div className="text-sm text-gray-500">Staff members</div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/dashboard/staff?type=administrative">Manage</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Support Staff</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <div className="text-sm text-gray-500">Staff members</div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/dashboard/staff?type=support">Manage</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Equipment Staff</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-gray-500">Staff members</div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/dashboard/staff?type=equipment">Manage</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex justify-end">
                <Button asChild>
                  <Link to="/dashboard/staff/create">
                    <UserCog className="mr-2 h-4 w-4" />
                    Add New Staff Member
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Masters & Instructors Management</CardTitle>
              <CardDescription>Manage your Kung Fu masters and instructors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Grand Masters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-gray-500">Masters</div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/dashboard/instructors?type=grandmaster">Manage</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Sifu (Masters)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-gray-500">Masters</div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/dashboard/instructors?type=master">Manage</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Assistant Instructors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">9</div>
                    <div className="text-sm text-gray-500">Instructors</div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/dashboard/instructors?type=assistant">Manage</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex justify-end">
                <Button asChild>
                  <Link to="/dashboard/instructors/create">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Add New Instructor
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Management</CardTitle>
              <CardDescription>Manage your Kung Fu classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Active Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <div className="text-sm text-gray-500">Classes in session</div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/dashboard/classes?status=active">View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Upcoming Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">6</div>
                    <div className="text-sm text-gray-500">Classes scheduled</div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/dashboard/classes?status=upcoming">View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Full Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-sm text-gray-500">At capacity</div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/dashboard/classes?status=full">View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Low Enrollment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-gray-500">Need attention</div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/dashboard/classes?status=low">View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex justify-end">
                <Button asChild>
                  <Link to="/dashboard/classes/create">
                    <Calendar className="mr-2 h-4 w-4" />
                    Create New Class
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions in your Kung Fu schools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New black belt awarded", time: "2 hours ago", school: "Golden Dragon Kung Fu Academy" },
                {
                  action: "Tournament registration opened",
                  time: "4 hours ago",
                  school: "Silver Tiger Martial Arts Center",
                },
                { action: "Student promotion ceremony", time: "Yesterday", school: "Golden Dragon Kung Fu Academy" },
                { action: "Payment processed", time: "2 days ago", school: "Silver Tiger Martial Arts Center" },
                { action: "New advanced class created", time: "3 days ago", school: "Golden Dragon Kung Fu Academy" },
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-start pb-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.school}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
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
                <Link to="/dashboard/staff/create" className="flex flex-col items-start">
                  <UserCog className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Add Staff</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/instructors/create" className="flex flex-col items-start">
                  <GraduationCap className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Add Instructor</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/classes/create" className="flex flex-col items-start">
                  <Calendar className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Create Class</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/rankings" className="flex flex-col items-start">
                  <Award className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Belt Rankings</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/tournaments" className="flex flex-col items-start">
                  <Star className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Tournaments</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to="/dashboard/reports" className="flex flex-col items-start">
                  <TrendingUp className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Reports</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SchoolAdminDashboard

