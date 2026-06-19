import { createContext, useContext, useState, useCallback } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const persistSession = useCallback((data) => {
    // data: { token, userId, name, email, role }
    const sessionUser = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(sessionUser));
    setToken(data.token);
    setUser(sessionUser);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const { data } = await authApi.login(credentials);
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const register = useCallback(
    async (details) => {
      const { data } = await authApi.register(details);
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
