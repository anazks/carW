import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { getProfile } from "../Api/Auth";

/* ================= USER TYPE ================= */

interface User {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

/* ================= CONTEXT TYPE ================= */

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAdmin: boolean;
  isOwner: boolean;
  loading: boolean;
  login: (token: string, user?: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsOwner: (isOwner: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= RESTORE TOKEN ================= */

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  /* ================= RESTORE USER ================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAdmin(parsed.role === "admin");
        setIsOwner(parsed.role === "owner");
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  /* ================= LOGIN ================= */

  const login = useCallback((newToken: string, userData?: User) => {

    // ✅ Save token directly (NO ENCRYPTION)
    localStorage.setItem("token", newToken);

    setToken(newToken);

    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    if (userData) {
      setUser(userData);
      setIsAdmin(userData.role === "admin");
      setIsOwner(userData.role === "owner");
      localStorage.setItem("user", JSON.stringify(userData));
    }

  }, []);

  /* ================= LOGOUT ================= */

  const logout = useCallback(() => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setIsAdmin(false);
    setIsOwner(false);

    delete axios.defaults.headers.common["Authorization"];

    window.location.href = "/login"; // optional redirect

  }, []);

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      // Don't fetch profile if we're on the login page to prevent redirect loops
      if (window.location.pathname === '/login') return;

      try {
        const profile = await getProfile();

        setUser(profile);
        setIsAdmin(profile.role === "admin");
        setIsOwner(profile.role === "owner");
        localStorage.setItem("user", JSON.stringify(profile));

      } catch (error: any) {
        if (error.response?.status === 401) {
          logout();
        }
      }
    };

    fetchProfile();
  }, [token, logout]);

  /* ================= CONTEXT VALUE ================= */

  const value = useMemo(
    () => ({
      token,
      user,
      isAdmin,
      isOwner,
      loading,
      login,
      logout,
      setUser,
      setIsAdmin,
      setIsOwner,
    }),
    [token, user, isAdmin, isOwner, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ================= CUSTOM HOOK ================= */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default AuthProvider;