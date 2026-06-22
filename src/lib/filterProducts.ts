import type { Product, Filters } from './types'

export function filterProducts(products: Product[], filters: Filters): Product[] {
  return products
    .filter(p => {
      const cat = filters.category
      if (!cat || cat === 'all') return true
      if (cat === 'tienda_percha') return p.store_type === 'oficial'
      if (cat === 'promos') return p.accepts_offers === true
      return p.category === cat
    })
    .filter(p => {
      if (!filters.subcategory) return true
      return p.subcategory === filters.subcategory
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
    .filter(p => {
      if (!filters.search) return true
      const q = filters.search.toLowerCase()
      return p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (filters.sort === 'price_asc') return a.price - b.price
      if (filters.sort === 'price_desc') return b.price - a.price
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
}
