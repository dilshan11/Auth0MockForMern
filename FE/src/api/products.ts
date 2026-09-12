export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const API_BASE_URL = "http://localhost:4000/api";

export async function fetchProducts(token: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  return res.json();
}
