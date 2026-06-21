export type Condition = 'new_tag' | 'new' | 'like_new' | 'used'
export type StoreType = 'oficial' | 'feria'
export type SortOption = 'newest' | 'price_asc' | 'price_desc'

export interface Seller {
  id: string
  name: string
  avatar: string
  rating: number
  sales_count: number
}

export interface Product {
  id: string
  title: string
  description: string
  brand: string
  price: number
  images: string[]
  sizes: string[]
  condition: Condition
  store_type: StoreType
  seller: Seller
  accepts_offers: boolean
  created_at: string
}

export interface CartItem {
  productId: string
  title: string
  price: number
  image: string
  size: string
  store_type: StoreType
}

export interface Filters {
  category: string
  size: string
  condition: string
  priceMax: number
  sort: SortOption
}
