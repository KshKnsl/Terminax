import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

interface User {
  id: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
  refreshUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    console.log("Attempting to refresh user status...");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${SERVER_URL}/auth/status`, {
        method: 'GET',
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (data.isAuthenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    
    // Fallback timer to ensure loading state doesn't get stuck
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 6000); // Slightly longer than the fetch timeout
    
    return () => clearTimeout(fallbackTimer);
  }, []);

  const logout = () => {
    window.location.href = `${SERVER_URL}/auth/logout`;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
