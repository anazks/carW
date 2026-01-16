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
import { getProfile } from "../../Api/Auth";

/* ================= TYPES ================= */
type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= FETCH USER PROFILE ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();

      console.log("Profile response:", response);

      // ✅ FIXED: correct API response key
      setUser(response.user);
    } catch (error) {
      console.error("Profile fetch error:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  /* ================= NAV LINKS ================= */
  const baseNavLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/services", label: "Services", icon: Droplet },
  ];

  const userNavLinks = user
    ? [
        { path: "/history", label: "History", icon: History },
        { path: "/profile", label: "Profile", icon: User },
      ]
    : [];

  const navLinks = [...baseNavLinks, ...userNavLinks];

  const isActive = (path: string) => location.pathname === path;

  /* ================= LOADING STATE ================= */
  if (loading) {
    return <div className="fixed top-0 w-full h-16 bg-white z-50" />;
  }

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg py-2" : "bg-white py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">

            {/* ================= LOGO ================= */}
            <div
              onClick={() => navigate("/")}
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
                <p className="text-xs text-gray-500 -mt-1">
                  Premium Car Wash
                </p>
              </div>
            </div>

            {/* ================= DESKTOP NAV ================= */}
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
                        ? "text-[#D4AF37] bg-[#FFF8DC]"
                        : "text-gray-700 hover:bg-[#FFF8DC]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* ================= DESKTOP RIGHT ================= */}
            <div className="hidden lg:flex gap-3 items-center">
              {user ? (
                <>
                  <span className="text-gray-700 font-medium">
                    {user.firstName} {user.lastName}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>

                  <button
                    onClick={() => navigate("/services")}
                    className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white rounded-lg font-semibold"
                  >
                    Book Now
                  </button>
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
                    className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white rounded-lg font-semibold"
                  >
                    Book Now
                  </button>
                </>
              )}
            </div>

            {/* ================= MOBILE MENU BUTTON ================= */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {isOpen && (
          <div className="lg:hidden bg-white px-4 pb-4 border-t">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-[#FFF8DC]"
              >
                {link.label}
              </button>
            ))}

            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-600 border-t">
                  Welcome, {user.firstName}
                </div>

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

      {/* OFFSET FOR FIXED NAV */}
      <div className="pt-20" />
    </>
  );
}
