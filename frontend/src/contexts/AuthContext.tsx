import { createContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import type { LoginData, Profile } from "../types";

const DASHBOARD_CACHE_KEY = "Arquivapp:dashboardInitCache";

type LoginResponse = {
  token: string;
  user: Profile;
};

type AuthContextType = {
  token: string | null;
  user: Profile | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  setUser: (user: Profile | null) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    setIsAuthLoading(false);
  }, []);

  async function login(data: LoginData) {
    const response = await api.post<LoginResponse>("/auth/login", data);
    const receivedToken = response.data.token;
    const receivedUser = response.data.user;

    localStorage.setItem("token", receivedToken);
    localStorage.setItem("user", JSON.stringify(receivedUser));
    sessionStorage.removeItem(DASHBOARD_CACHE_KEY);

    setToken(receivedToken);
    setUser(receivedUser);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem(DASHBOARD_CACHE_KEY);

    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAuthLoading,
      login,
      logout,
      setUser,
    }),
    [token, user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
