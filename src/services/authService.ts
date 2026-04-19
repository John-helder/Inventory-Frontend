import { API_URL } from "./api";

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || "Erro ao fazer login");
}

if (!data.token) {
  throw new Error("Token não recebido");
}

localStorage.setItem("token", data.token);
localStorage.setItem("username", data.username);
localStorage.setItem("role", data.role);

return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "/login";
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function getUsername() {
  return localStorage.getItem("username");
}
