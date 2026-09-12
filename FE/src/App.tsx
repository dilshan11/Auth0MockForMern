import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchProducts, type Product } from './api/products'
import './App.css'

function App() {
  const {
    isLoading,
    isAuthenticated,
    error: authError,
    loginWithRedirect: login,
    logout: auth0Logout,
    user,
  } = useAuth0()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const signup = () => login({ authorizationParams: { screen_hint: 'signup' } })
  const logout = () => auth0Logout({ logoutParams: { returnTo: window.location.origin } })

  if (isLoading) return 'Loading...'

  return (
    <section id="center">
      <div className="auth-bar">
        {isAuthenticated ? (
          <>
            <span>Logged in as {user?.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            {authError && <p>Error: {authError.message}</p>}
            <button onClick={signup}>Signup</button>
            <button onClick={() => login()}>Login</button>
          </>
        )}
      </div>

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
