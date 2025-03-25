"use client"

import type React from "react"

import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FooterProps {
  logo?: React.ReactNode
  description?: string
  showNewsletter?: boolean
  showSocials?: boolean
  children?: React.ReactNode
}

interface FooterColumnProps {
  title: string
  children: React.ReactNode
}

interface FooterLinkProps {
  href: string
  children: React.ReactNode
}

export function Footer({
  logo,
  description = "La plateforme dédiée aux écoles de Kung Fu et aux maîtres d'arts martiaux.",
  showNewsletter = true,
  showSocials = true,
  children,
}: FooterProps) {
  const defaultLogo = (
    <>
      <h3 className="text-xl font-bold mb-4 text-amber-400">Master's Portal</h3>
      <p className="text-gray-400 mb-4">{description}</p>
    </>
  )

  return (
    <footer className="bg-gray-900 py-12 border-t border-amber-600/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            {logo || defaultLogo}

            {showSocials && (
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            )}
          </div>

          {children}

          {showNewsletter && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-400">Newsletter</h3>
              <p className="text-gray-400 mb-4">Abonnez-vous pour recevoir les dernières actualités et mises à jour.</p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="bg-gray-800 border-amber-600 text-white focus:ring-amber-500"
                />
                <Button className="ml-2 bg-amber-500 hover:bg-amber-600 text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} Master's Portal. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-amber-400">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  )
}

export function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <li>
      <Link to={href} className="text-gray-400 hover:text-amber-400 transition-colors">
        {children}
      </Link>
    </li>
  )
}

