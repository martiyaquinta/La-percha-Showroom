import { create } from 'zustand'
import type { CartItem, Filters } from '@/lib/types'

interface ShopStore {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  cartCount: () => number
  cartTotal: () => number

  favorites: string[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean

  filters: Filters
  setFilter: (key: keyof Filters, value: string | number) => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: Filters = {
  category: 'all',
  size: '',
  condition: '',
  priceMax: 0,
  sort: 'newest',
}

export const useShopStore = create<ShopStore>()((set, get) => ({
  cart: [],
  addToCart: (item) => set((s) => {
    const exists = s.cart.find(i => i.productId === item.productId)
    if (exists) return s
    return { cart: [...s.cart, item] }
  }),
  removeFromCart: (productId) =>
    set((s) => ({ cart: s.cart.filter(i => i.productId !== productId) })),
  clearCart: () => set({ cart: [] }),
  cartCount: () => get().cart.length,
  cartTotal: () => get().cart.reduce((sum, i) => sum + i.price, 0),

  favorites: [],
  toggleFavorite: (productId) => set((s) => ({
    favorites: s.favorites.includes(productId)
      ? s.favorites.filter(id => id !== productId)
      : [...s.favorites, productId],
  })),
  isFavorite: (productId) => get().favorites.includes(productId),

  filters: DEFAULT_FILTERS,
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}))
