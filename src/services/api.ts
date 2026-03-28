export const API_URL = "http://localhost:8080";

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("Erro na requisição");
  }

  return response.json();
}
