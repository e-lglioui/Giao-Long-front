"use client"

import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import type { RootState } from "@/store"
import { authService } from "../services/auth.service"
import { Role } from "../types/roles"
import { setUser, setLoading, setError } from "../authSlice"

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth)

  // Initialize user from storage on component mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        dispatch(setLoading(true))
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          console.log("Initializing auth with user:", currentUser)
          dispatch(setUser(currentUser))
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        dispatch(setError((error as Error).message))
      } finally {
        dispatch(setLoading(false))
      }
    }

    if (!user) {
      initializeAuth()
    }
  }, [dispatch, user])

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true))
      const result = await authService.login({ email, password })
      console.log("Login successful, user:", result.user)
      dispatch(setUser(result.user))
      return result
    } catch (error) {
      console.error("Login error:", error)
      dispatch(setError((error as Error).message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

  const logout = () => {
    authService.logout()
    dispatch(setUser(null))
  }

  const hasRole = (role: Role) => {
    if (!user) return false
    console.log(`Checking if user has role ${role}, user role: ${user.role}`)
    return user.role === role
  }

  const hasPermission = (action: string, subject: string) => {
    if (!user) return false

    // Get permissions for the user's role
    const permissions = authService.getPermissionsForRole(user.role)

    // Check if the user has the required permission
    return permissions.some(
      (permission) =>
        (permission.action === action || permission.action === "manage") &&
        (permission.subject === subject || permission.subject === "all"),
    )
  }

  const isSuperAdmin = () => hasRole(Role.SUPER_ADMIN)
  const isSchoolAdmin = () => hasRole(Role.SCHOOL_ADMIN)
  const isInstructor = () => hasRole(Role.INSTRUCTOR)
  const isStudent = () => hasRole(Role.STUDENT)
  const isStaff = () => hasRole(Role.STAFF)
  const isAuthenticated = () => !!user || authService.isAuthenticated()

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    hasRole,
    hasPermission,
    isSuperAdmin,
    isSchoolAdmin,
    isInstructor,
    isStudent,
    isStaff,
    isAuthenticated,
  }
}

