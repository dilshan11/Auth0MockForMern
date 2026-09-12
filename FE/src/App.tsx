import { useEffect, useState } from 'react'
import { fetchProducts, type Product } from './api/products'
import './App.css'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="center">
      <h1>Products</h1>

      {loading && <p>Loading products...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <ul className="product-list">
          {products.map((product) => (
            <li key={product.id} className="product-card">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <strong>${product.price.toFixed(2)}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default App
