import React, { createContext, useContext, useState } from "react";
import { type components } from "~/lib/types";

type User = components["schemas"]["User"];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<User | null>(null);

export function AuthProvider({ children, initialUser }: { children: any, initialUser: User | null }) {
  const [user, setUser] = useState(initialUser);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => useContext(AuthContext);