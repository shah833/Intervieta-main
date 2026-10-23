"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

export function useTokens() {
  const { getToken } = useAuth();
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTokens = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:8000/interview/tokens", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tokens");
      const data = await res.json();
      setTokens(data);
    } catch {
      setTokens(null);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return { tokens, loading, refetch: fetchTokens };
}