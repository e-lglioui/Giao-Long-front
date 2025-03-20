"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, Outlet } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Calendar,
  School,
  DollarSign,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  CheckCircle,
  FileText,
  Award,
  UserCircle,
  GraduationCap,
  Shield,
  Star,
  ClipboardList,
} from "lucide-react"
import { useAuth } from "../auth/hooks/useAuth"
import { Role } from "../auth/types/roles"
import { Button } from "@/components/ui/button"
import RoleDashboard from "./RoleDashboard"

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { logout, user, hasRole, isAuthenticated } = useAuth()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if authentication is complete
    if (user || !isAuthenticated()) {
      setIsLoading(false)
    }
  }, [user, isAuthenticated])

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { title: "Messages", icon: MessageCircle, path: "/dashboard/messages" },
      { title: "Profile", icon: UserCircle, path: "/dashboard/profile" },
      { title: "Settings", icon: Settings, path: "/dashboard/settings" },
    ]

    const superAdminItems = [
      { title: "Schools", icon: School, path: "/dashboard/schools" },
      { title: "User Management", icon: Users, path: "/dashboard/users" },
      { title: "System Analytics", icon: FileText, path: "/dashboard/analytics" },
    ]

    const schoolAdminItems = [
      { title: "Staff Management", icon: Users, path: "/dashboard/staff" },
      { title: "Masters & Instructors", icon: GraduationCap, path: "/dashboard/instructors" },
      { title: "Students", icon: Users, path: "/dashboard/students" },
      { title: "Belt Rankings", icon: Award, path: "/dashboard/rankings" },
      { title: "Payments", icon: DollarSign, path: "/dashboard/payments" },
    ]

    const instructorItems = [
      { title: "My Classes", icon: Calendar, path: "/dashboard/classes" },
      { title: "Training Schedule", icon: Calendar, path: "/dashboard/schedule" },
      { title: "My Students", icon: Users, path: "/dashboard/students" },
      { title: "Belt Promotions", icon: Award, path: "/dashboard/rankings" },
    ]

    const studentItems = [
      { title: "My Training", icon: Calendar, path: "/dashboard/enrollments" },
      { title: "Class Schedule", icon: Calendar, path: "/dashboard/schedule" },
      { title: "My Belt Progress", icon: Award, path: "/dashboard/progress" },
      { title: "Tournaments", icon: Star, path: "/dashboard/tournaments" },
    ]

    const staffItems = [
      { title: "Tasks", icon: ClipboardList, path: "/dashboard/tasks" },
      { title: "Student Records", icon: Users, path: "/dashboard/students" },
      { title: "Belt Rankings", icon: Award, path: "/dashboard/rankings" },
      { title: "Tournaments", icon: Star, path: "/dashboard/tournaments" },
      { title: "Help & Support", icon: CheckCircle, path: "/dashboard/help" },
    ]

    // Combine base items with role-specific items
    if (hasRole(Role.SUPER_ADMIN)) {
      return [...baseItems, ...superAdminItems]
    } else if (hasRole(Role.SCHOOL_ADMIN)) {
      return [...baseItems, ...schoolAdminItems]
    } else if (hasRole(Role.INSTRUCTOR)) {
      return [...baseItems, ...instructorItems]
    } else if (hasRole(Role.STUDENT)) {
      return [...baseItems, ...studentItems]
    } else if (hasRole(Role.STAFF)) {
      return [...baseItems, ...staffItems]
    }

    return baseItems
  }

  // Determine which dashboard to render based on path
  const renderDashboard = () => {
    if (window.location.pathname === "/dashboard" || window.location.pathname === "/dashboard/") {
      return <RoleDashboard />
    }

    // For other routes, render the Outlet
    return <Outlet />
  }

  const menuItems = getMenuItems()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-white transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b">
            <Shield className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">Kung Fu Manager</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
                    isActive ? "bg-gray-100 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-gray-500">
                  {hasRole(Role.SUPER_ADMIN)
                    ? "Grand Master"
                    : hasRole(Role.SCHOOL_ADMIN)
                      ? "School Master"
                      : hasRole(Role.INSTRUCTOR)
                        ? "Sifu"
                        : hasRole(Role.STUDENT)
                          ? "Student"
                          : hasRole(Role.STAFF)
                            ? "Staff"
                            : "User"}
                </p>
              </div>
              <Button onClick={logout} variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-4 shadow">
          <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <MessageCircle className="h-5 w-5 cursor-pointer" />
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/profile">
                <UserCircle className="h-5 w-5 mr-2" />
                Profile
              </Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{renderDashboard()}</main>
      </div>
    </div>
  )
}

export default DashboardLayout

