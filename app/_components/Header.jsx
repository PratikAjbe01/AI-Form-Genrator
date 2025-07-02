"use client"

import { Button } from "@/components/ui/button"
import { SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppUser } from "../_context/UserContext"
import { useState, useEffect } from "react"

function Header() {
  const { appUser, loading } = useAppUser()
  const { isSignedIn } = useUser()
  const path = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Only show sidebar toggle on dashboard pages
  const isDashboard = path.startsWith("/dashboard")

  // Reset sidebar state when navigating away from dashboard
  useEffect(() => {
    if (!isDashboard) {
      setIsSidebarOpen(false)
    }
  }, [isDashboard])

  // Function to toggle sidebar
  const toggleSidebar = () => {
    const newState = !isSidebarOpen
    setIsSidebarOpen(newState)

    // Dispatch custom event for dashboard sidebar
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("toggleSidebar", {
          detail: { isOpen: newState },
        }),
      )
    }
  }

  // Don't render on aiform pages
  if (path.includes("aiform")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Sidebar button */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle Button - Only show on dashboard pages */}
            {isDashboard && (
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 hover:bg-gray-100"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
              </Button>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Image
                  src="/logo1.jpg"
                  width={40}
                  height={40}
                  alt="logo"
                  className="rounded-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Forms
              </span>
            </Link>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                {/* User greeting - hidden on mobile */}
                {!loading && appUser && (
                  <span key={appUser} className="hidden md:block mr-2 text-sm font-medium text-gray-700">
                    Welcome, <span className="text-blue-600">{appUser}</span>
                  </span>
                )}

                {/* Dashboard button */}
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-blue-200 ml-2 text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 bg-transparent"
                  >
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">Dash</span>
                  </Button>
                </Link>

                {/* User button */}
                <div className="relative">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 ring-2 ring-blue-100 hover:ring-blue-200 transition-all",
                      },
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Sign In link - hidden on mobile */}
                <Link
                  href="/sign-in"
                  className="hidden sm:block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>

                {/* Get Started button */}
                <SignUpButton>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Start</span>
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional: Add a subtle gradient line at the bottom */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
    </header>
  )
}

export default Header
