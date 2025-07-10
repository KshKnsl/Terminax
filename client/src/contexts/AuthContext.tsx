import { createContext, useState, useEffect, useContext, type ReactNode } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

interface User {
  _id: string;
  id: string;
  username: string;
  displayName?: string | null;
  avatar?: string | null;
  email?: string;
  provider: string;
  githubId?: string;
  accessToken?: string;
  plan?: {
    name: string;
    maxApps: number;
    maxSessions: number;
    features: string[];
  };
  stats?: {
    totalApps: number;
    activeSessions: number;
    totalSessions: number;
  };
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  try {
    console.log("Fetching:", url);
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", [...response.headers.entries()]);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }));
      throw new Error(error.message || "Network response was not ok");
    }

    const data = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const data = await fetchWithAuth(`${SERVER_URL}/auth/status`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (data.isAuthenticated && data.user) {
        console.log(data);
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const logout = async () => {
    try {
      await fetchWithAuth(`${SERVER_URL}/auth/logout`);
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/";
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    logout,
    refreshUser,
  };
  console.log(value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
