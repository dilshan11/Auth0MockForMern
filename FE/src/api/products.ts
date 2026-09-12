export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const API_BASE_URL = "http://localhost:4000/api";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  return res.json();
}
