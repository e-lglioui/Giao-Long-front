"use client"

import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../auth/hooks/useAuth"
import { Role } from "../auth/types/roles"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  School,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  User,
  BarChart,
  FileText,
  MessageSquare,
  Bell,
} from "lucide-react"

interface SidebarProps {
  children: React.ReactNode
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ children }) => {
  const { user, logout, hasRole } = useAuth()
  const location = useLocation()

  const isSuperAdmin = hasRole(Role.SUPER_ADMIN)
  const isSchoolAdmin = hasRole(Role.SCHOOL_ADMIN)
  const isInstructor = hasRole(Role.INSTRUCTOR)
  const isStudent = hasRole(Role.STUDENT)
  const isStaff = hasRole(Role.STAFF)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2">
              <School className="h-6 w-6" />
              <div className="font-bold text-xl">EduManage</div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/dashboard"}>
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Super Admin Links */}
              {isSuperAdmin && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/schools")}>
                      <Link to="/dashboard/schools">
                        <School className="h-5 w-5" />
                        <span>Schools</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/users")}>
                      <Link to="/dashboard/users">
                        <Users className="h-5 w-5" />
                        <span>User Management</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/analytics")}>
                      <Link to="/dashboard/analytics">
                        <BarChart className="h-5 w-5" />
                        <span>System Analytics</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {/* School Admin Links */}
              {isSchoolAdmin && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/staff")}>
                      <Link to="/dashboard/staff">
                        <Users className="h-5 w-5" />
                        <span>Staff Management</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/instructors")}>
                      <Link to="/dashboard/instructors">
                        <GraduationCap className="h-5 w-5" />
                        <span>Instructors</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/students")}>
                      <Link to="/dashboard/students">
                        <Users className="h-5 w-5" />
                        <span>Students</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {/* Instructor Links */}
              {isInstructor && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/classes")}>
                      <Link to="/dashboard/classes">
                        <BookOpen className="h-5 w-5" />
                        <span>My Classes</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/schedule")}>
                      <Link to="/dashboard/schedule">
                        <Calendar className="h-5 w-5" />
                        <span>Schedule</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/assessments")}>
                      <Link to="/dashboard/assessments">
                        <FileText className="h-5 w-5" />
                        <span>Assessments</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {/* Student Links */}
              {isStudent && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/enrollments")}>
                      <Link to="/dashboard/enrollments">
                        <BookOpen className="h-5 w-5" />
                        <span>My Enrollments</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/schedule")}>
                      <Link to="/dashboard/schedule">
                        <Calendar className="h-5 w-5" />
                        <span>Schedule</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/assignments")}>
                      <Link to="/dashboard/assignments">
                        <FileText className="h-5 w-5" />
                        <span>Assignments</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {/* Common Links for All Users */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/messages")}>
                  <Link to="/dashboard/messages">
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/notifications")}>
                  <Link to="/dashboard/notifications">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {(isSchoolAdmin || isSuperAdmin) && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/payments")}>
                    <Link to="/dashboard/payments">
                      <CreditCard className="h-5 w-5" />
                      <span>Payments</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.includes("/dashboard/settings")}>
                  <Link to="/dashboard/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t">
            <div className="p-2">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.username || "User"} />
                    <AvatarFallback>{user?.username ? getInitials(user.username) : "U"}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-xs text-gray-500">
                      {isSuperAdmin
                        ? "Super Admin"
                        : isSchoolAdmin
                          ? "School Admin"
                          : isInstructor
                            ? "Instructor"
                            : isStudent
                              ? "Student"
                              : isStaff
                                ? "Staff"
                                : "User"}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <div className="p-4 flex items-center justify-between border-b">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <Bell className="h-5 w-5 cursor-pointer" />
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard/profile">
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Link>
              </Button>
            </div>
          </div>
          <main>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardSidebar

