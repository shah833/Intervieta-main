import { apiRequest } from "@/lib/api";

const ACCESS_TOKEN_KEY = "intervieta_access_token";

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export async function fetchCurrentUser(accessToken) {
  return apiRequest("/auth/me", { method: "GET" }, accessToken);
}
