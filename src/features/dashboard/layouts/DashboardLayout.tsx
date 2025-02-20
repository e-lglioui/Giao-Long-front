import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  School,
  DollarSign,
  MessageCircle,
  Video,
  Settings,
  LogOut,
  Menu,
  CheckCircle,
  FileText,
  Award,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

// Définition du type User
interface User {
  id: string;
  username?: string;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Événements",
    icon: Calendar,
    path: "/dashboard/events",
  },
  {
    title: "Écoles",
    icon: School,
    path: "/dashboard/schools",
  },
  {
    title: "Élèves",
    icon: Users,
    path: "/dashboard/students",
  },
  {
    title: "Cours",
    icon: Calendar,
    path: "/dashboard/classes",
  },
  {
    title: "Attendance",
    icon: CheckCircle,
    path: "/dashboard/attendance",
  },
  {
    title: "Progress Report",
    icon: FileText,
    path: "/dashboard/progress-report",
  },
  {
    title: "Certification",
    icon: Award,
    path: "/dashboard/certification",
  },
  {
    title: "Messagerie",
    icon: MessageCircle,
    path: "/dashboard/chat",
  },
  {
    title: "Visioconférence",
    icon: Video,
    path: "/dashboard/video-call",
  },
  {
    title: "Finances",
    icon: DollarSign,
    path: "/dashboard/finance",
  },
  {
    title: "Paramètres",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <>
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
              <h1 className="text-xl font-bold">Gestion Kung-fu</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
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
                );
              })}
            </nav>

            {/* User Section */}
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{user?.username}</p>
                </div>
                <Button onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className={`${isSidebarOpen ? "ml-64" : "ml-0"}`}>
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center bg-white px-4 shadow">
            <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </header>

          {/* Page Content */}
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
}
