export const API_URL = "http://localhost:8080";

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Sessão expirada");
  }

  if (!response.ok) {
    throw new Error("Erro na requisição");
  }

  if (response.status === 204) return null;

  return response.json();
}