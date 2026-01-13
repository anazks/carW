"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LogOut, Home, Calendar, User, Clock } from "lucide-react"

export default function OwnerNavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { label: "Dashboard", path: "/owner", icon: <Home size={16} /> },
    { label: "Services", path: "/owner/services", icon: <User size={16} /> },
    { label: "Time Slots", path: "/owner/TimeSlots", icon: <Clock size={16} /> },
    { label: "Bookings", path: "/owner/bookings", icon: <Calendar size={16} /> },
    { label: "Profile", path: "/owner/profile", icon: <User size={16} /> },
  ]

  const handleLogout = () => {
    navigate("/owner/login")
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LOGO */}
          <div className="flex-shrink-0 font-bold text-xl text-[#D4AF37] cursor-pointer">Sparkle Car Wash</div>

          {/* MENU ITEMS */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100 ${
                  location.pathname === item.path ? "bg-[#FFF4D6] text-[#D4AF37]" : "text-gray-700"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2 hover:bg-gray-100 ${
                location.pathname === item.path ? "bg-[#FFF4D6] text-[#D4AF37]" : "text-gray-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
