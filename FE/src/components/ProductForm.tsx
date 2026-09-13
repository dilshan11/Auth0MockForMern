import { useState, type FormEvent } from 'react'
import type { Product, ProductInput } from '../api/products'

interface ProductFormProps {
  initial?: Product | null
  submitting: boolean
  onSubmit: (input: ProductInput) => void
  onCancel: () => void
}

function ProductForm({ initial, submitting, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [price, setPrice] = useState(initial ? String(initial.price) : '')
  const [image, setImage] = useState(initial?.image ?? '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      image: image.trim(),
    })
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{initial ? 'Edit product' : 'Add product'}</h2>

      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>

      <label>
        Price
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>

      <label>
        Image URL
        <input value={image} onChange={(e) => setImage(e.target.value)} required />
      </label>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : initial ? 'Save changes' : 'Add product'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
