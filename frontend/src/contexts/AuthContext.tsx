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

function clearStoredSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem(DASHBOARD_CACHE_KEY);
}

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken) {
      clearStoredSession();
      setIsAuthLoading(false);
      return;
    }

    setToken(storedToken);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearStoredSession();
        setToken(null);
        setUser(null);
      }
    }

    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === "token" && !event.newValue) {
        setToken(null);
        setUser(null);
        sessionStorage.removeItem(DASHBOARD_CACHE_KEY);
      }

      if (event.key === "user") {
        if (!event.newValue) {
          setUser(null);
          return;
        }

        try {
          setUser(JSON.parse(event.newValue));
        } catch {
          clearStoredSession();
          setToken(null);
          setUser(null);
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
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
    clearStoredSession();
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