"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";

// Define user type
interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string ) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const initialAuthContext: AuthContextType = {
    user: null,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    loading: true
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);  // Set to `true` initially
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        setLoading(true);
        axios
          .get<{ user: User }>(`${process.env.NEXT_PUBLIC_API_URL}auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setUser(res.data.user))
          .catch((error) => localStorage.removeItem("token"))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }, []);
  
    const login = async (email: string, password: string) => {
      try {
        const res = await axios.post<{ token: string; user: User }>(
          `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
          { email, password }
        );
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
    };
  
    const register = async (email: string, password: string) => {
      try {
        const res = await axios.post<{ token: string; user: User }>(
          `${process.env.NEXT_PUBLIC_API_URL}auth/register`,
          { email, password }
        );
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Registration failed");
      }
    };
  
    const logout = () => {
      localStorage.removeItem("token");
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ user, login, register, logout, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth = () => useContext(AuthContext);