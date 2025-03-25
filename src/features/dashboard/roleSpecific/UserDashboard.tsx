"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, User, MessageSquare, Bell, Settings } from "lucide-react"

const UserDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.username}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to Kung Fu Manager</CardTitle>
          <CardDescription>Your martial arts management platform</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            You're currently logged in as a standard user. To access more features, please contact your administrator to
            assign you a specific role.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link to="/dashboard/profile" className="flex flex-col items-start">
                <User className="h-5 w-5 mb-1" />
                <span className="text-sm font-medium">My Profile</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link to="/dashboard/messages" className="flex flex-col items-start">
                <MessageSquare className="h-5 w-5 mb-1" />
                <span className="text-sm font-medium">Messages</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link to="/dashboard/notifications" className="flex flex-col items-start">
                <Bell className="h-5 w-5 mb-1" />
                <span className="text-sm font-medium">Notifications</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Courses</CardTitle>
            <CardDescription>Browse martial arts courses you can enroll in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Discover Kung Fu courses and training opportunities available in the system.</p>
              <Button asChild>
                <Link to="/dashboard/courses/browse">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Courses
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Update your profile information and account settings.</p>
              <Button asChild variant="outline">
                <Link to="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserDashboard

