const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  const res = await fetch(url, config);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Request failed");
  }

  return res.json();
}
