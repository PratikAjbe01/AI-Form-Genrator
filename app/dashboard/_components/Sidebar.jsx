"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@clerk/nextjs"
import { LibraryBig, LineChart, MessageSquare, Shield, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useAppStore } from "@/app/_context/store"

function SideNav() {
  const menuList = [
    { id: 1, name: "My Forms", icon: LibraryBig, path: "/dashboard" },
    { id: 2, name: "Responses", icon: MessageSquare, path: "/dashboard/responses" },
    { id: 3, name: "Analytics", icon: LineChart, path: "/dashboard/analytics" },
    { id: 4, name: "Upgrade", icon: Shield, path: "/dashboard/upgrades" },
  ]

  const { user } = useUser()
  const path = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { appUser, forms, fetchForms, fetchUser } = useAppStore()
  const [PercFileCreated, setPercFileCreated] = useState(0)

  // Listen for sidebar toggle events from header
  useEffect(() => {
    const handleToggle = (event) => {
      setIsOpen(event.detail.isOpen)
    }
    window.addEventListener("toggleSidebar", handleToggle)
    return () => window.removeEventListener("toggleSidebar", handleToggle)
  }, [])

  useEffect(() => {
    if (user) {
      fetchUser(user.primaryEmailAddress.emailAddress)
      fetchForms(user.primaryEmailAddress.emailAddress)
    }
  }, [user, fetchUser, fetchForms])

  useEffect(() => {
    // Calculate percentage of forms created (assuming 5 is the max for free tier)
    if (typeof appUser === 'number') {
      const remaining = Number(appUser)
      const used = 5 - remaining
      const perc = (used / 5) * 100
      setPercFileCreated(perc)
    }
  }, [appUser])

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      setIsOpen(false)
    }
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />}

      {/* Sidebar */}
      <div
        className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto lg:top-0 lg:h-screen
      `}
      >
        {/* Mobile Close Button */}
        {isOpen && (
          <div className="lg:hidden flex justify-end p-4 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={closeSidebar} className="p-2 hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        )}

        {/* Navigation Menu - Flexible container */}
        <div className="flex-1 px-4 pb-4 pt-4 min-h-0">
          <div className="space-y-2">
            {menuList.map((menu, index) => (
              <Link
                href={menu.path}
                key={index}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200 text-sm font-medium
                  hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50
                  hover:text-blue-700 hover:shadow-sm
                  ${
                    path === menu.path
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:text-blue-700"
                  }
                `}
              >
                <menu.icon className="w-5 h-5" />
                {menu.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Section - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 bg-gradient-to-t from-gray-50 to-transparent border-t border-gray-100">
          <div className="space-y-4">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              onClick={handleLinkClick}
            >
              + Create Form
            </Button>
            <div className="space-y-3">
              <Progress value={PercFileCreated} className="h-2 bg-gray-200" />
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold text-blue-600">{5 - appUser}</span> out of{" "}
                  <span className="font-semibold">5</span> forms created
                </p>
                <p className="text-gray-500">Upgrade your plan for unlimited AI form builds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideNav
