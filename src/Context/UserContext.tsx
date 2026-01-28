import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from "react";
import CryptoJS from "crypto-js";
import { getProfile } from '../Api/Auth';

// Use environment variable for security (replace with your actual env var)
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "your_secret_key_123"; // Fallback for dev

// TypeScript interfaces for better type safety (assuming TypeScript usage)
interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string; // e.g., 'admin', 'user'
  // Add other user fields as needed
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean; // Added for better UX during fetch
  login: (token: string, user?: User) => void; // Unified login setter
  logout: () => void;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  // Decrypt token on init (runs only once on mount)
  const getDecryptedToken = useCallback((): string | null => {
    const encryptedToken = localStorage.getItem("token");
    if (!encryptedToken) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedToken || null;
    } catch (error) {
      console.error("Error decrypting token:", error); // Keep for dev; remove in prod
      localStorage.removeItem("token"); // Clean up invalid token
      return null;
    }
  }, []);

  const [token, setTokenInternal] = useState<string | null>(() => getDecryptedToken());
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Track fetch loading state

  // Encrypt and store token (memoized for stability)
  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      const encryptedToken = CryptoJS.AES.encrypt(newToken, SECRET_KEY).toString();
      localStorage.setItem("token", encryptedToken);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Clean up related data
    }
    setTokenInternal(newToken);
  }, []);

  // Unified login function (combines token set + optional immediate user set)
  const login = useCallback((newToken: string, immediateUser?: User) => {
    setToken(newToken);
    if (immediateUser) {
      setUser(immediateUser);
      localStorage.setItem("user", JSON.stringify(immediateUser)); // Persist user for quick restore
    }
  }, [setToken]);

  // Logout function (clear all auth state)
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    setLoading(false);
    // Clear axios header
    delete axios.defaults.headers.common["Authorization"];
  }, [setToken]);

  // Set axios auth header (debounced via useEffect dependency)
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Fetch user info on token change (with loading & error handling)
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      setLoading(true);
      try {
        const response = await getProfile();
        const fetchedUser: User = response.data;
        setUser(fetchedUser);

        // Auto-set isAdmin based on user role (example logic; adjust as needed)
        setIsAdmin(fetchedUser.role === 'admin');

        // Persist user in localStorage for offline/quick restore
        localStorage.setItem("user", JSON.stringify(fetchedUser));
      } catch (error: any) {
        console.error("Error fetching user info:", error);
        // Handle auth errors (e.g., 401/403) by logging out
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [token, logout]); // Added logout as dep for error handling

  // Restore user from localStorage on mount (if token exists)
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAdmin(parsedUser.role === 'admin'); // Restore admin state
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
        }
      }
    }
  }, []); // Empty dep: runs only on mount

  // Memoized context value (stable, avoids unnecessary re-renders)
  const contextValue = useMemo<AuthContextType>(
    () => ({
      token,
      user,
      isAdmin,
      loading,
      login,
      logout,
      setUser,
      setIsAdmin,
    }),
    [token, user, isAdmin, loading, login, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Typed custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;