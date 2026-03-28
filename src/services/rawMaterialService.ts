import { apiFetch } from "./api";

export function getRawMaterials() {
  return apiFetch("/api/raw-materials");
}

export function getRawMaterialById(id: number) {
  return apiFetch(`/api/raw-materials/${id}`);
}

export function createRawMaterial(rawMaterial: any) {
  return apiFetch("/api/raw-materials", {
    method: "POST",
    body: JSON.stringify(rawMaterial),
  });
}

export function updateRawMaterial(id: number, rawMaterial: any) {
  return apiFetch(`/api/raw-materials/${id}`, {
    method: "PUT",
    body: JSON.stringify(rawMaterial),
  });
}

export function deleteRawMaterial(id: number) {
  return apiFetch(`/api/raw-materials/${id}`, {
    method: "DELETE",
  });
}