"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { ApiError, apiRequest } from "@/lib/api";
import {
  clearAccessToken,
  fetchCurrentUser,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const clearError = useCallback(() => setError(null), []);

  const refreshSession = useCallback(async () => {
    try {
      const refreshed = await apiRequest("/auth/refresh", { method: "POST" });
      setAccessToken(refreshed.access_token);
      return refreshed.access_token;
    } catch {
      clearAccessToken();
      setUser(null);
      return null;
    }
  }, []);

  const loadUser = useCallback(async () => {
    const storedToken = getAccessToken();
    if (!storedToken) {
      const refreshed = await refreshSession();
      if (!refreshed) {
        setLoading(false);
        return;
      }
      try {
        const refreshedUser = await fetchCurrentUser(refreshed);
        setUser(refreshedUser);
      } catch {
        clearAccessToken();
        setUser(null);
      }
      setLoading(false);
      return;
    }

    try {
      const currentUser = await fetchCurrentUser(storedToken);
      setUser(currentUser);
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 500;
      if (status === 401) {
        const refreshed = await refreshSession();
        if (refreshed) {
          try {
            const refreshedUser = await fetchCurrentUser(refreshed);
            setUser(refreshedUser);
          } catch {
            clearAccessToken();
            setUser(null);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, [refreshSession]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      void refreshSession();
    }, 1000 * 60 * 12);
    return () => clearInterval(interval);
  }, [refreshSession]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user && pathname?.startsWith("/dashboard")) {
      router.push("/login");
    }
  }, [loading, pathname, router, user]);

  const register = useCallback(async (payload) => {
    setError(null);
    try {
      const result = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return result.message;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Unable to register";
      setError(message);
      throw err;
    }
  }, []);

  const login = useCallback(async (payload) => {
    setError(null);
    try {
      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setAccessToken(result.access_token);
      const currentUser = await fetchCurrentUser(result.access_token);
      setUser(currentUser);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Unable to login";
      setError(message);
      throw err;
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" }, getAccessToken());
    } finally {
      clearAccessToken();
      setUser(null);
      router.push("/");
    }
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      register,
      login,
      logout,
      refreshSession,
      clearError,
    }),
    [user, loading, error, register, login, logout, refreshSession, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
