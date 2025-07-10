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
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...options.headers,
      },
      mode: "cors",
    });
    
    if (response.redirected) {
      window.location.href = response.url;
      return;
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }));
      throw new Error(error.message || "Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
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

      if (data.user && typeof data.user === 'object') {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser().catch(() => setIsLoading(false));

    const intervalId = setInterval(() => {
      if (isAuthenticated) {
        refreshUser().catch(() => {});
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

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
