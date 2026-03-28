import { apiFetch } from "./api";

export function getProducts() {
  return apiFetch("/api/products");
}

export function getProductById(id: number) {
  return apiFetch(`/api/products/${id}`);
}

export function createProduct(product: any) {
  return apiFetch("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProduct(id: number, product: any) {
  return apiFetch(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id: number) {
  return apiFetch(`/api/products/${id}`, {
    method: "DELETE",
  });
}

export function getProductionAvailability() {
  return apiFetch("/api/products/production-availability");
}