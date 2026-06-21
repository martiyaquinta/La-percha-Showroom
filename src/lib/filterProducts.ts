import type { Product, Filters } from './types'

export function filterProducts(products: Product[], filters: Filters): Product[] {
  return products
    .filter(p => {
      if (filters.category === 'all' || !filters.category) return true
      return p.store_type === filters.category
    })
    .filter(p => {
      if (!filters.size) return true
      return p.sizes.includes(filters.size)
    })
    .filter(p => {
      if (!filters.condition) return true
      return p.condition === filters.condition
    })
    .filter(p => {
      if (!filters.priceMax || filters.priceMax === 0) return true
      return p.price <= filters.priceMax
    })
    .sort((a, b) => {
      if (filters.sort === 'price_asc') return a.price - b.price
      if (filters.sort === 'price_desc') return b.price - a.price
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
}
