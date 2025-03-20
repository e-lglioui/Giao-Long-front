"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../auth/hooks/useAuth"
import { School, Users, BarChart, Settings, Shield, FileText } from "lucide-react"

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Grand Master Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.username}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* School Management Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <h2 className="text-xl font-semibold mb-4">School Management</h2>
          <p className="text-gray-600 mb-4">Create and manage Kung Fu schools in the system</p>
          <div className="space-y-2">
            <Link to="/dashboard/schools" className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
              <School className="h-4 w-4 mr-2" />
              View All Schools
            </Link>
            <Link
              to="/dashboard/schools/create"
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <School className="h-4 w-4 mr-2" />
              Create New School
            </Link>
          </div>
        </div>

        {/* School Admin Management Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <h2 className="text-xl font-semibold mb-4">School Master Management</h2>
          <p className="text-gray-600 mb-4">Create and assign Kung Fu school masters</p>
          <div className="space-y-2">
            <Link
              to="/dashboard/school-admins"
              className="flex items-center text-green-600 hover:text-green-800 font-medium"
            >
              <Shield className="h-4 w-4 mr-2" />
              View All School Masters
            </Link>
            <Link
              to="/dashboard/school-admins/create"
              className="flex items-center text-green-600 hover:text-green-800 font-medium"
            >
              <Shield className="h-4 w-4 mr-2" />
              Create New School Master
            </Link>
          </div>
        </div>

        {/* System Settings Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <p className="text-gray-600 mb-4">Configure global system settings</p>
          <div className="space-y-2">
            <Link
              to="/dashboard/settings/general"
              className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
            >
              <Settings className="h-4 w-4 mr-2" />
              General Settings
            </Link>
            <Link
              to="/dashboard/settings/security"
              className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
            >
              <Settings className="h-4 w-4 mr-2" />
              Security Settings
            </Link>
          </div>
        </div>

        {/* User Management Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-600 mb-4">Manage all users in the system</p>
          <div className="space-y-2">
            <Link to="/dashboard/users" className="flex items-center text-red-600 hover:text-red-800 font-medium">
              <Users className="h-4 w-4 mr-2" />
              View All Users
            </Link>
            <Link to="/dashboard/users/roles" className="flex items-center text-red-600 hover:text-red-800 font-medium">
              <Users className="h-4 w-4 mr-2" />
              Manage User Roles
            </Link>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
          <h2 className="text-xl font-semibold mb-4">System Analytics</h2>
          <p className="text-gray-600 mb-4">View system-wide analytics and reports</p>
          <div className="space-y-2">
            <Link
              to="/dashboard/analytics/dashboard"
              className="flex items-center text-yellow-600 hover:text-yellow-800 font-medium"
            >
              <BarChart className="h-4 w-4 mr-2" />
              Analytics Dashboard
            </Link>
            <Link
              to="/dashboard/analytics/reports"
              className="flex items-center text-yellow-600 hover:text-yellow-800 font-medium"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Reports
            </Link>
          </div>
        </div>

        {/* Support Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
          <h2 className="text-xl font-semibold mb-4">System Support</h2>
          <p className="text-gray-600 mb-4">Access support tools and logs</p>
          <div className="space-y-2">
            <Link
              to="/dashboard/support/logs"
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <FileText className="h-4 w-4 mr-2" />
              System Logs
            </Link>
            <Link
              to="/dashboard/support/tickets"
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <FileText className="h-4 w-4 mr-2" />
              Support Tickets
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard

