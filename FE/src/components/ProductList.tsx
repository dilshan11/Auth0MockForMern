import type { Product } from '../api/products'

interface ProductListProps {
  products: Product[]
  deletingId: number | null
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

function ProductList({ products, deletingId, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return <p>No products yet. Add your first one above.</p>
  }

  return (
    <ul className="product-list">
      {products.map((product) => (
        <li key={product.id} className="product-card">
          {product.image && (
            <img src={product.image} alt={product.name} className="product-image" />
          )}
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <strong>${product.price.toFixed(2)}</strong>
          <div className="product-actions">
            <button className="btn-secondary" onClick={() => onEdit(product)}>
              Edit
            </button>
            <button
              className="btn-danger"
              onClick={() => onDelete(product)}
              disabled={deletingId === product.id}
            >
              {deletingId === product.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ProductList
