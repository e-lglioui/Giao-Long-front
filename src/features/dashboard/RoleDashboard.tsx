"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../auth/hooks/useAuth"
import { Role } from "../auth/types/roles"
import SuperAdminDashboard from "./roleSpecific/SuperAdminDashboard"
import SchoolAdminDashboard from "./roleSpecific/SchoolAdminDashboard"
import InstructorDashboard from "./roleSpecific/InstructorDashboard"
import StudentDashboard from "./roleSpecific/StudentDashboard"
import StaffDashboard from "./roleSpecific/StaffDashboard"
import UserDashboard from "./roleSpecific/UserDashboard"

const RoleDashboard = () => {
  const { user, hasRole, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (user || !isAuthenticated()) {
      console.log("User authenticated:", user)
      setLoading(false)
    }
  }, [user, isAuthenticated])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Render dashboard based on user role
  if (hasRole(Role.SUPER_ADMIN)) {
    console.log("Rendering SuperAdminDashboard")
    return <SuperAdminDashboard />
  }

  if (hasRole(Role.SCHOOL_ADMIN)) {
    console.log("Rendering SchoolAdminDashboard")
    return <SchoolAdminDashboard />
  }

  if (hasRole(Role.INSTRUCTOR)) {
    console.log("Rendering InstructorDashboard")
    return <InstructorDashboard />
  }

  if (hasRole(Role.STAFF)) {
    console.log("Rendering StaffDashboard")
    return <StaffDashboard />
  }

  if (hasRole(Role.STUDENT)) {
    console.log("Rendering StudentDashboard")
    return <StudentDashboard />
  }

  // Default dashboard for regular users
  console.log("Rendering UserDashboard")
  return <UserDashboard />
}

export default RoleDashboard

