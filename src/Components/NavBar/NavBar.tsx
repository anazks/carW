import { useState, useEffect } from "react";
import {
  Droplet,
  Menu,
  X,
  Home,
  History,
  User,
  LogIn,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/UserContext";
// import path from "path";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { token, user, logout, loading: authLoading } = useAuth();

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ================= NAV LINKS ================= */
  const baseNavLinks = [
    { path: "/home", label: "Home", icon: Home },
    { path: "/services", label: "Services", icon: Droplet },
  ];

  const userNavLinks = token && !user?.role || user?.role === 'user'
    ? [
        { path: "/history", label: "History", icon: History },
        { path: "/profile", label: "Profile", icon: User },
      ]
    : [];

  const ownerNavLinks = token && user?.role === 'owner'
    ? [
        { path: "/owner", label: "Dashboard", icon: Home },
        { path: "/owner/bookings", label: "Bookings", icon: History },
        { path: "/owner/services", label: "My Services", icon: Droplet },
        { path: "/owner/profile", label: "Shop Profile", icon: User },
      ]
    : [];

  const navLinks = [...baseNavLinks, ...userNavLinks, ...ownerNavLinks];

  /* ================= ACTIVE ROUTE CHECK ================= */
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  /* ================= LOADING STATE ================= */
  if (authLoading) {
    return <div className="fixed top-0 w-full h-16 bg-white z-50" />;
  }

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg py-2" : "bg-white py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">

            {/* LOGO */}
            <div
              onClick={() => navigate("/home")}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-[#D4AF37] to-[#FFD700] p-2 rounded-full">
                <Droplet className="w-6 h-6 text-white" fill="white" />
              </div>

              <div>
                <h1
                  style={{ fontFamily: "'Bodoni Moda', serif" }}
                  className="text-2xl font-bold text-[#D4AF37]"
                >
                  Mycarwash
                </h1>
                  <h1>
                      {
                        token ? "" : ""
                      }
                    </h1>
                <p className="text-xs text-gray-500 -mt- 1">
                  Premium Car Wash
                </p>
              </div>
            </div>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      active
                        ? "text-[#D4AF37] bg-[#FFF8DC] font-semibold"
                        : "text-gray-700 hover:bg-[#FFF8DC]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* DESKTOP RIGHT */}
            <div className="hidden lg:flex gap-3 items-center">

              {token ? (
                <>
                  {user && (
                    <span className="text-gray-700 font-medium">
                      {user.firstName || ""} {user.lastName || ""}
                    </span>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-red-500 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                  
                  {user?.role !== 'owner' && user?.role !== 'admin' && (
                    <button
                      onClick={() => navigate("/services")}
                      className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white rounded-lg font-semibold hover:opacity-90 transition"
                    >
                      Book Now
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-[#D4AF37]"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </button>

                  <button
                    onClick={() => navigate("/services")}
                    className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Book Now
                  </button>
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2"
            >
              {isOpen ? <X /> : <Menu />}
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="lg:hidden bg-white px-4 pb-4 border-t">

            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg transition ${
                  isActive(link.path)
                    ? "bg-[#FFF8DC] text-[#D4AF37] font-semibold"
                    : "hover:bg-[#FFF8DC]"
                }`}
              >
                {link.label}
              </button>
            ))}

            {token ? (
              <>
                {user && (
                  <div className="px-4 py-2 text-sm text-gray-600 border-t">
                    Welcome,
                     {user.firstName || "User"}
                  </div>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-[#FFF8DC] border-t"
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>

      {/* NAVBAR OFFSET */}
      <div className="pt-20" />
    </>
  );
}