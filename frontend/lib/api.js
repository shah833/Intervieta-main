const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest(
  endpoint,
  options = {},
  accessToken,
) {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiError(
      `Unable to reach API at ${API_BASE_URL}. Ensure backend is running and NEXT_PUBLIC_API_URL is correct.`,
      0,
    );
  }

  const raw = await response.text();
  let data = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const payload = data;
    const message = payload?.detail ?? payload?.message ?? "Request failed";
    throw new ApiError(message, response.status);
  }

  return data;
}
