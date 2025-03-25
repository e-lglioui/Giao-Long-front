"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  transparent?: boolean
  logo?: React.ReactNode
  mobileMenuItems?: React.ReactNode
  children?: React.ReactNode
}

export function Navbar({ transparent = false, logo, mobileMenuItems, children }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Effect to detect scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const defaultLogo = (
    <Link
      to="/"
      className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent"
    >
      Master's Portal
    </Link>
  )

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || !transparent ? "bg-black/90 shadow-lg shadow-amber-600/20" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {logo || defaultLogo}

          <nav className="hidden md:flex items-center space-x-8">{children}</nav>

          <div className="md:hidden">
            <Button variant="ghost" className="text-amber-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-black/95 border-t border-amber-600/20"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">{mobileMenuItems || children}</div>
          </div>
        </motion.div>
      )}
    </header>
  )
}

export function NavItem({
  children,
  href,
  isActive = false,
}: { children: React.ReactNode; href: string; isActive?: boolean }) {
  return (
    <Link
      to={href}
      className={`${isActive ? "text-amber-500" : "text-amber-400"} hover:text-red-400 transition-colors duration-200`}
    >
      {children}
    </Link>
  )
}

export function NavCTA({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Button
      asChild
      className="bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 hover:from-amber-600 hover:via-red-600 hover:to-amber-600 text-white font-semibold transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
    >
      <Link to={href}>{children}</Link>
    </Button>
  )
}

