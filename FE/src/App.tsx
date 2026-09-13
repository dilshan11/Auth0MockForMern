import { useCallback, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
  type Product,
  type ProductInput,
} from './api/products'
import ProductForm from './components/ProductForm'
import ProductList from './components/ProductList'
import './App.css'

function App() {
  const {
    isLoading,
    isAuthenticated,
    error: authError,
    loginWithRedirect: login,
    logout: auth0Logout,
    getAccessTokenSilently,
    user,
  } = useAuth0()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadProducts = useCallback(() => {
    if (!isAuthenticated) {
      setProducts([])
      return
    }

    setLoading(true)
    setError(null)

    getAccessTokenSilently()
      .then(fetchProducts)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [isAuthenticated, getAccessTokenSilently])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const signup = () => login({ authorizationParams: { screen_hint: 'signup' } })
  const logout = () => auth0Logout({ logoutParams: { returnTo: window.location.origin } })

  const openAddForm = () => {
    setEditingProduct(null)
    setFormError(null)
    setFormOpen(true)
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setFormError(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingProduct(null)
    setFormError(null)
  }

  const handleSubmit = async (input: ProductInput) => {
    setSubmitting(true)
    setFormError(null)
    try {
      const token = await getAccessTokenSilently()
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, input, token)
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      } else {
        const created = await createProduct(input, token)
        setProducts((prev) => [...prev, created])
      }
      closeForm()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return

    setDeletingId(product.id)
    setError(null)
    try {
      const token = await getAccessTokenSilently()
      await deleteProduct(product.id, token)
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
    } finally {
      setDeletingId(null)
    }
  }

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

      <div className="products-header">
        <h1>Products</h1>
        {isAuthenticated && !formOpen && (
          <button className="btn-primary" onClick={openAddForm}>
            + Add product
          </button>
        )}
      </div>

      {!isAuthenticated && <p>Log in to view products.</p>}

      {isAuthenticated && formOpen && (
        <>
          <ProductForm
            key={editingProduct?.id ?? 'new'}
            initial={editingProduct}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
          {formError && <p className="error-text">Error: {formError}</p>}
        </>
      )}

      {loading && <p>Loading products...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {isAuthenticated && !loading && !error && (
        <ProductList
          products={products}
          deletingId={deletingId}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      )}
    </section>
  )
}

export default App
