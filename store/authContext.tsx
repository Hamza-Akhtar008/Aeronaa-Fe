// store/authContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getAuth, setAuth, clearAuth } from "@/lib/auth";

export type Role = 'admin' | 'vendor' | 'user'|'support' |'umrah'| 'carrental'|"property"|"agent";
// Define the shape of your auth data
type AuthData = {
  access_token: string;
  role: Role;
  id: number;
  Permissions?: string[];
};

// Define the shape of the context
type AuthContextType = {
  auth: AuthData | null;
  login: (data: AuthData) => void;
  logout: () => void;
  loading: boolean;
};

// Create context with default `undefined` (safer than null)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props type for the provider
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuthState] = useState<AuthData | null>(null);
 const [loading, setLoading] = useState(true);

useEffect(() => {
    const stored = getAuth();
    if (stored) setAuthState(stored);
    setLoading(false);
  }, []);

  const login = (data: AuthData) => {
  // Only store token, role, and id
  const authData = {
    access_token: data.access_token,
    role: data.role,
    id: data.id,
    Permissions: data.Permissions || []
  };
  setAuth(authData); // Persist to localStorage
  setAuthState(authData); // Update state
};

  const logout = () => {
    clearAuth();
    setAuthState(null);
  };

  return (
   <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook with error fallback
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
