import { apiFetch } from "./client";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export type ProductInput = Omit<Product, "id">;

export function fetchProducts(token: string): Promise<Product[]> {
  return apiFetch<Product[]>("/products", { token });
}

export function fetchProduct(id: number, token: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, { token });
}

export function createProduct(input: ProductInput, token: string): Promise<Product> {
  return apiFetch<Product>("/products", { method: "POST", body: input, token });
}

export function updateProduct(id: number, input: ProductInput, token: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, { method: "PUT", body: input, token });
}

export function deleteProduct(id: number, token: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, { method: "DELETE", token });
}
