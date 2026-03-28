import { apiFetch } from "./api";

export function getProducts() {
  return apiFetch("/api/products");
}

export function createProduct(product: any) {
  return apiFetch("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}
