# Bloque 1 — Flujo de Compra: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar Home con filtros funcionales, detalle de producto con talle obligatorio, carrito y checkout 3 pasos — todo con mock data y Zustand.

**Architecture:** Un store Zustand global maneja carrito + favoritos + filtros. Los datos viven en `src/lib/placeholder-products.ts`. Los filtros son funciones puras en `src/lib/filterProducts.ts`. Las páginas leen el store y llaman acciones; los componentes son presentacionales salvo cuando necesitan el store directamente.

**Tech Stack:** Next.js 16 · Tailwind v4 · TypeScript · Zustand · lucide-react · mock data (Unsplash URLs)

## Global Constraints

- Breakpoint único `lg` (1024px) — nunca usar `sm:` ni `md:`
- `max-w-107.5` (430px) como contenedor universal mobile
- `--nav-h: 4rem` via `(--nav-h)` en Tailwind v4
- CTA mobile: `fixed bottom-20 inset-x-0 mx-auto w-full max-w-107.5` → `lg:static`
- Todos los colores usan tokens del design system (ej: `bg-brand`, `text-text-muted`)
- Nunca `w-[18px]` — usar `w-4.5`; nunca `h-[52px]` — usar `h-13`
- `"use client"` solo cuando hay hooks o interactividad

---

## Task 1: Fundación — Tipos + Mock Data + filterProducts

**Files:**
- Create: `src/lib/types.ts`
- Replace: `src/lib/placeholder-products.ts`
- Create: `src/lib/filterProducts.ts`

**Interfaces:**
- Produces: tipos `Product`, `CartItem`, `Seller`, `Filters` usados por todas las tareas siguientes
- Produces: `PRODUCTS: Product[]` (12 items) consumido por Home y Producto
- Produces: `filterProducts(products, filters): Product[]` consumido por Home

- [ ] **Step 1: Crear src/lib/types.ts**

```ts
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
```

- [ ] **Step 2: Reemplazar src/lib/placeholder-products.ts con 12 productos completos**

```ts
import type { Product } from './types'

const SELLER_MARIA: Product['seller'] = {
  id: 's1', name: 'María G.', avatar: 'https://i.pravatar.cc/40?img=47',
  rating: 4.9, sales_count: 32,
}
const SELLER_SOF: Product['seller'] = {
  id: 's2', name: 'Sofía R.', avatar: 'https://i.pravatar.cc/40?img=48',
  rating: 4.7, sales_count: 18,
}
const SELLER_LARA: Product['seller'] = {
  id: 's3', name: 'Lara M.', avatar: 'https://i.pravatar.cc/40?img=44',
  rating: 4.8, sales_count: 51,
}
const SELLER_OFICIAL: Product['seller'] = {
  id: 's0', name: 'La Percha Oficial', avatar: 'https://i.pravatar.cc/40?img=10',
  rating: 5.0, sales_count: 200,
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1', title: 'Vestido lino sage', brand: 'Jazmín Chebar', price: 24900,
    description: 'Vestido midi en lino color sage. Escote V, manga corta, cintura marcada con tiro bajo. Ideal para el verano. Usado una sola vez, impecable.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop',
    ],
    sizes: ['XS','S','M'], condition: 'like_new', store_type: 'feria',
    seller: SELLER_MARIA, accepts_offers: true, created_at: '2026-06-20T10:00:00Z',
  },
  {
    id: 'p2', title: 'Blazer crema oversize', brand: 'Rapsodia', price: 18900,
    description: 'Blazer oversize en color crema. Tela de gabardina liviana, ideal para primavera. Nunca usado, con etiqueta.',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4e6f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
    ],
    sizes: ['S','M','L'], condition: 'new_tag', store_type: 'feria',
    seller: SELLER_SOF, accepts_offers: false, created_at: '2026-06-19T14:00:00Z',
  },
  {
    id: 'p3', title: 'Camisa bordada off-white', brand: 'Awada', price: 14500,
    description: 'Camisa de algodón off-white con bordados florales en el cuello. Talle único amplio. Estado impecable.',
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
    ],
    sizes: ['S','M','L','XL'], condition: 'like_new', store_type: 'feria',
    seller: SELLER_LARA, accepts_offers: true, created_at: '2026-06-18T09:00:00Z',
  },
  {
    id: 'p4', title: 'Falda midi taupe', brand: 'La Percha', price: 16200,
    description: 'Falda midi en color taupe, corte A. Tela fluida, elástico en cintura. Nueva con etiqueta, de la colección otoño.',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5974ca0cfe?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1603344797033-f0f4f587ab60?w=600&h=800&fit=crop',
    ],
    sizes: ['XS','S','M','L'], condition: 'new_tag', store_type: 'oficial',
    seller: SELLER_OFICIAL, accepts_offers: false, created_at: '2026-06-17T11:00:00Z',
  },
  {
    id: 'p5', title: 'Top crochet mint', brand: 'Kosiuko', price: 9800,
    description: 'Top tejido al crochet en color menta. Sin forro, ideal sobre bikini. Talle único, queda de XS a M.',
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=800&fit=crop',
    ],
    sizes: ['Único'], condition: 'new', store_type: 'feria',
    seller: SELLER_MARIA, accepts_offers: true, created_at: '2026-06-16T16:00:00Z',
  },
  {
    id: 'p6', title: 'Pantalón palazzo lino', brand: 'La Percha', price: 21300,
    description: 'Pantalón palazzo de lino natural. Corte amplio, cintura alta con lazo. Nuevo con etiqueta.',
    images: [
      'https://images.unsplash.com/photo-1594938374182-a57c6a4d99db?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&h=800&fit=crop',
    ],
    sizes: ['S','M','L','XL'], condition: 'new_tag', store_type: 'oficial',
    seller: SELLER_OFICIAL, accepts_offers: false, created_at: '2026-06-15T10:00:00Z',
  },
  {
    id: 'p7', title: 'Cardigan sage tejido', brand: 'Vitamina', price: 12400,
    description: 'Cardigan largo en punto fino, color sage. Cierre con botones de nácar. Usado, muy buen estado.',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=800&fit=crop',
    ],
    sizes: ['S','M'], condition: 'used', store_type: 'feria',
    seller: SELLER_SOF, accepts_offers: true, created_at: '2026-06-14T13:00:00Z',
  },
  {
    id: 'p8', title: 'Vestido satinado nude', brand: 'Prune', price: 31500,
    description: 'Vestido midi de satén en tono nude. Escote asimétrico, corte sesgado. Perfecto para eventos. Usado una vez.',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&h=800&fit=crop',
    ],
    sizes: ['XS','S'], condition: 'like_new', store_type: 'feria',
    seller: SELLER_LARA, accepts_offers: true, created_at: '2026-06-13T10:00:00Z',
  },
  {
    id: 'p9', title: 'Jeans straight tiro alto', brand: 'Levi\'s', price: 17800,
    description: 'Jeans straight tiro alto en denim azul medio. Talle 27. Sin desgastes, casi nuevos.',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&h=800&fit=crop',
    ],
    sizes: ['36','38','40'], condition: 'like_new', store_type: 'feria',
    seller: SELLER_MARIA, accepts_offers: false, created_at: '2026-06-12T09:00:00Z',
  },
  {
    id: 'p10', title: 'Remera oversized blanca', brand: 'La Percha', price: 7200,
    description: 'Remera oversized 100% algodón. Cuello redondo, largo por debajo de la cadera. Nueva colección.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
    ],
    sizes: ['XS','S','M','L','XL'], condition: 'new_tag', store_type: 'oficial',
    seller: SELLER_OFICIAL, accepts_offers: false, created_at: '2026-06-11T14:00:00Z',
  },
  {
    id: 'p11', title: 'Campera de cuero marrón', brand: '47 Street', price: 42000,
    description: 'Campera de cuero genuino en marrón tostado. Muy buen estado, sin rayaduras. Talle M.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1547975736-16ea77e3853c?w=600&h=800&fit=crop',
    ],
    sizes: ['M','L'], condition: 'used', store_type: 'feria',
    seller: SELLER_SOF, accepts_offers: true, created_at: '2026-06-10T10:00:00Z',
  },
  {
    id: 'p12', title: 'Conjunto lino natural', brand: 'La Percha', price: 28600,
    description: 'Conjunto de pantalón y top en lino natural. Piezas separadas, se venden juntas. Nuevo con etiqueta.',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop',
    ],
    sizes: ['XS','S','M'], condition: 'new_tag', store_type: 'oficial',
    seller: SELLER_OFICIAL, accepts_offers: false, created_at: '2026-06-09T11:00:00Z',
  },
]
```

- [ ] **Step 3: Crear src/lib/filterProducts.ts**

```ts
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
```

- [ ] **Step 4: Verificar en browser**

Navegar a http://localhost:3000/home — debe mostrar 12 productos (si la home ya importa PRODUCTS). Si hay error de tipos, corregirlo antes de continuar.

- [ ] **Step 5: Commit**

```bash
git add src/lib/types.ts src/lib/placeholder-products.ts src/lib/filterProducts.ts
git commit -m "feat: tipos, 12 productos mock y función filterProducts"
```

---

## Task 2: Zustand Store

**Files:**
- Create: `src/store/useShopStore.ts`

**Interfaces:**
- Consumes: `CartItem`, `Filters` de `src/lib/types.ts`
- Produces: hook `useShopStore` consumido por Navbar, ProductCard, Home, Producto, Carrito, Checkout

- [ ] **Step 1: Instalar Zustand**

```bash
bun add zustand
```

Verificar que aparece en package.json.

- [ ] **Step 2: Crear src/store/useShopStore.ts**

```ts
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
```

- [ ] **Step 3: Verificar que compila**

```bash
# El servidor de Next.js ya está corriendo. Ver que no hay error en la consola.
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/home
# Debe devolver 200
```

- [ ] **Step 4: Commit**

```bash
git add src/store/useShopStore.ts package.json bun.lockb
git commit -m "feat: zustand store (carrito + favoritos + filtros)"
```

---

## Task 3: Toast Component

**Files:**
- Create: `src/components/Toast.tsx`

**Interfaces:**
- Produces: `<Toast message={string} onClose={() => void} />` consumido por ProductoPage

- [ ] **Step 1: Crear src/components/Toast.tsx**

```tsx
"use client"
import { useEffect } from "react"
import { Check } from "lucide-react"

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export function Toast({ message, onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  return (
    <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50
      flex items-center gap-2 px-4 py-2.5 rounded-full
      bg-surface-inverse text-text-on-dark text-sm font-semibold
      shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
      <Check className="w-4 h-4 text-success-500 shrink-0" />
      {message}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Toast.tsx
git commit -m "feat: componente Toast"
```

---

## Task 4: ProductCard con heart toggle

**Files:**
- Modify: `src/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `useShopStore` para `toggleFavorite` e `isFavorite`
- Consumes: `Product` de `src/lib/types.ts`

- [ ] **Step 1: Reemplazar src/components/ProductCard.tsx**

```tsx
"use client"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useShopStore } from "@/store/useShopStore"
import type { Product } from "@/lib/types"

const CONDITION_LABEL: Record<string, string> = {
  new_tag: 'Nuevo c/etiqueta',
  new: 'Nuevo',
  like_new: 'Como nuevo',
  used: 'Usado',
}

export function ProductCard({ product }: { product: Product }) {
  const toggleFavorite = useShopStore(s => s.toggleFavorite)
  const isFav = useShopStore(s => s.isFavorite(product.id))

  return (
    <div className="relative group">
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative aspect-[3/4] rounded-lg bg-surface-sunken overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.condition && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-card text-text-muted">
              {CONDITION_LABEL[product.condition] ?? product.condition}
            </span>
          )}
        </div>
        <div className="mt-1.5 px-0.5 pr-7">
          <p className="text-xs text-text-muted uppercase tracking-wide">
            {product.store_type === 'oficial' ? 'Tienda Oficial' : 'Feria'}
          </p>
          <h3 className="text-sm font-semibold text-text-strong truncate mt-0.5">{product.title}</h3>
          <p className="text-sm font-bold text-price mt-0.5">
            $ {product.price.toLocaleString('es-AR')}
          </p>
        </div>
      </Link>

      <button
        onClick={(e) => { e.preventDefault(); toggleFavorite(product.id) }}
        aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-card/80
          backdrop-blur-sm flex items-center justify-center transition-transform
          active:scale-90"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${isFav ? 'fill-error-500 text-error-500' : 'text-text-muted'}`}
        />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verificar en browser**

Ir a http://localhost:3000/home — el corazón de cada card debe togglear entre rojo y gris al clickear. No debe navegar al producto.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProductCard.tsx
git commit -m "feat: ProductCard con heart toggle conectado al store"
```

---

## Task 5: ClienteNavbar — badge carrito desde store

**Files:**
- Modify: `src/components/ClienteNavbar.tsx`

**Interfaces:**
- Consumes: `useShopStore` → `cartCount()`

- [ ] **Step 1: Agregar badge al ícono de carrito en ClienteNavbar.tsx**

Reemplazar el archivo completo:

```tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Home, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useShopStore } from "@/store/useShopStore"

export default function ClienteNavbar() {
  const [hidratado, setHidratado] = useState(false)
  useEffect(() => { setHidratado(true) }, [])
  const pathname = usePathname()
  const cartCount = useShopStore(s => s.cartCount())
  const isHome = pathname === "/" || pathname === "/home"
  const isCart = pathname === "/carrito"

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 h-(--nav-h)
        bg-bg-page border-b border-border-subtle z-50
        items-center justify-between px-8">
        <Link href="/home" className="font-display text-xl text-text-strong">
          La Percha
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/home"
            className={`text-sm font-semibold transition-colors ${isHome ? 'text-text-strong' : 'text-text-muted hover:text-text-strong'}`}>
            Catálogo
          </Link>
          <Link href="/carrito" className="relative">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5 text-text-on-brand" />
            </div>
            {hidratado && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full
                bg-surface-inverse flex items-center justify-center
                text-[9px] font-bold text-text-on-dark">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 mx-auto
        w-full max-w-107.5 h-20 bg-bg-page border-t border-border-subtle
        flex items-center justify-between px-8 z-50">
        <Link href="/home"
          className="flex flex-col items-center gap-1 w-14 h-14 justify-center">
          <Home className={`w-5.5 h-5.5 ${isHome ? 'text-text-strong' : 'text-text-muted'}`} />
          <span className={`text-[10px] ${isHome ? 'text-text-strong font-semibold' : 'text-text-muted'}`}>
            Home
          </span>
        </Link>
        <Link href="/carrito"
          className="relative flex flex-col items-center w-14 h-14 justify-center">
          <div className={`w-12.5 h-12.5 rounded-full flex items-center justify-center
            ${isCart ? 'bg-brand ring-2 ring-surface-card' : 'bg-brand'}`}>
            <ShoppingBag className="w-5.5 h-5.5 text-text-on-brand" />
          </div>
          {hidratado && cartCount > 0 && (
            <span className="absolute -top-1 right-0 w-4.5 h-4.5 rounded-full
              bg-surface-inverse flex items-center justify-center
              text-[9px] font-bold text-text-on-dark">
              {cartCount}
            </span>
          )}
        </Link>
        <Link href="/perfil"
          className="flex flex-col items-center gap-1 w-14 h-14 justify-center">
          <User className="w-5.5 h-5.5 text-text-muted" />
          <span className="text-[10px] text-text-muted">Perfil</span>
        </Link>
      </nav>
    </>
  )
}
```

- [ ] **Step 2: Verificar en browser**

Agregar un producto al carrito desde cualquier página → el badge debe aparecer con el número correcto en la navbar.

- [ ] **Step 3: Commit**

```bash
git add src/components/ClienteNavbar.tsx
git commit -m "feat: badge carrito en navbar conectado al store"
```

---

## Task 6: Filtros — FilterSidebar + FilterBottomSheet + SortDropdown

**Files:**
- Create: `src/components/FilterSidebar.tsx`
- Create: `src/components/FilterBottomSheet.tsx`
- Create: `src/components/SortDropdown.tsx`

**Interfaces:**
- Consumes: `useShopStore` → `filters`, `setFilter`, `resetFilters`
- Produces: componentes consumidos por Home page (Task 7)

- [ ] **Step 1: Crear src/components/FilterSidebar.tsx**

```tsx
"use client"
import { useShopStore } from "@/store/useShopStore"

const SIZES = ['XS','S','M','L','XL']
const CONDITIONS = [
  { value: '', label: 'Todos' },
  { value: 'new_tag', label: 'Nuevo c/etiqueta' },
  { value: 'new', label: 'Nuevo' },
  { value: 'like_new', label: 'Como nuevo' },
  { value: 'used', label: 'Usado' },
]
const CATS = [
  { value: 'all', label: 'Todo' },
  { value: 'oficial', label: 'Tienda Oficial' },
  { value: 'feria', label: 'Feria de Ropa' },
]

export function FilterSidebar() {
  const { filters, setFilter, resetFilters } = useShopStore()
  const hasFilters = filters.category !== 'all' || filters.size !== '' || filters.condition !== ''

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0
      border-r border-border-subtle px-4 py-6 gap-6
      sticky top-(--nav-h) self-start max-h-[calc(100vh-var(--nav-h))] overflow-y-auto">

      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-text-strong">Filtros</h2>
        {hasFilters && (
          <button onClick={resetFilters}
            className="text-xs text-text-muted hover:text-brand transition-colors">
            Limpiar
          </button>
        )}
      </div>

      {/* Categoría */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Categoría</p>
        {CATS.map(c => (
          <button key={c.value} onClick={() => setFilter('category', c.value)}
            className={`w-full text-left px-2.5 py-2 rounded-md text-sm font-medium transition-colors
              ${filters.category === c.value
                ? 'bg-sage-100 text-sage-800'
                : 'text-text-body hover:bg-surface-sunken'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Talle */}
      <div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Talle</p>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map(s => (
            <button key={s} onClick={() => setFilter('size', filters.size === s ? '' : s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors
                ${filters.size === s
                  ? 'bg-brand border-brand text-text-on-brand'
                  : 'border-border-default text-text-body hover:border-brand hover:text-brand'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Condición */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Estado</p>
        {CONDITIONS.map(c => (
          <label key={c.value} className="flex items-center gap-2 cursor-pointer py-1">
            <input type="radio" name="condition"
              checked={filters.condition === c.value}
              onChange={() => setFilter('condition', c.value)}
              className="accent-brand" />
            <span className="text-sm text-text-body">{c.label}</span>
          </label>
        ))}
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Crear src/components/FilterBottomSheet.tsx**

```tsx
"use client"
import { useShopStore } from "@/store/useShopStore"
import { X } from "lucide-react"

const SIZES = ['XS','S','M','L','XL']
const CONDITIONS = [
  { value: '', label: 'Todos' },
  { value: 'new_tag', label: 'Nuevo c/etiqueta' },
  { value: 'new', label: 'Nuevo' },
  { value: 'like_new', label: 'Como nuevo' },
  { value: 'used', label: 'Usado' },
]

interface Props {
  open: boolean
  onClose: () => void
}

export function FilterBottomSheet({ open, onClose }: Props) {
  const { filters, setFilter, resetFilters } = useShopStore()

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      <div className="fixed bottom-20 inset-x-0 mx-auto w-full max-w-107.5
        bg-surface-card rounded-t-2xl z-50 lg:hidden
        max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border-subtle">
          <h3 className="font-semibold text-text-strong">Filtros</h3>
          <div className="flex items-center gap-3">
            <button onClick={() => { resetFilters(); onClose() }}
              className="text-xs text-text-muted hover:text-brand transition-colors">
              Limpiar
            </button>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center">
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Talle */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Talle</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button key={s} onClick={() => setFilter('size', filters.size === s ? '' : s)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors
                    ${filters.size === s
                      ? 'bg-brand border-brand text-text-on-brand'
                      : 'border-border-default text-text-body hover:border-brand'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Condición */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Estado</p>
            {CONDITIONS.map(c => (
              <label key={c.value} className="flex items-center gap-3 cursor-pointer py-1.5">
                <input type="radio" name="condition_bs"
                  checked={filters.condition === c.value}
                  onChange={() => setFilter('condition', c.value)}
                  className="accent-brand w-4 h-4" />
                <span className="text-sm text-text-body">{c.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="px-5 pb-6">
          <button onClick={onClose}
            className="w-full h-13 bg-brand hover:bg-brand-hover
              text-text-on-brand font-semibold rounded-lg transition-colors">
            Ver resultados
          </button>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Crear src/components/SortDropdown.tsx**

```tsx
"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useShopStore } from "@/store/useShopStore"
import type { SortOption } from "@/lib/types"

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
]

export function SortDropdown() {
  const [open, setOpen] = useState(false)
  const { filters, setFilter } = useShopStore()
  const current = OPTIONS.find(o => o.value === filters.sort) ?? OPTIONS[0]

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
          border-border-default text-sm text-text-body hover:border-brand
          transition-colors bg-surface-card">
        {current.label}
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-44
            bg-surface-card border border-border-subtle rounded-lg shadow-lg overflow-hidden">
            {OPTIONS.map(o => (
              <button key={o.value}
                onClick={() => { setFilter('sort', o.value); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                  ${filters.sort === o.value
                    ? 'bg-sage-50 text-brand font-semibold'
                    : 'text-text-body hover:bg-surface-sunken'}`}>
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/FilterSidebar.tsx src/components/FilterBottomSheet.tsx src/components/SortDropdown.tsx
git commit -m "feat: FilterSidebar, FilterBottomSheet y SortDropdown"
```

---

## Task 7: Home page completa

**Files:**
- Replace: `src/app/(cliente)/home/page.tsx`

**Interfaces:**
- Consumes: `PRODUCTS` de placeholder-products
- Consumes: `filterProducts` de filterProducts
- Consumes: `useShopStore` → `filters`, `setFilter`
- Consumes: `FilterSidebar`, `FilterBottomSheet`, `SortDropdown`, `ProductCard`

- [ ] **Step 1: Reemplazar src/app/(cliente)/home/page.tsx**

```tsx
"use client"
import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { PRODUCTS } from "@/lib/placeholder-products"
import { filterProducts } from "@/lib/filterProducts"
import { useShopStore } from "@/store/useShopStore"
import { ProductCard } from "@/components/ProductCard"
import { FilterSidebar } from "@/components/FilterSidebar"
import { FilterBottomSheet } from "@/components/FilterBottomSheet"
import { SortDropdown } from "@/components/SortDropdown"

const CAT_CHIPS = [
  { value: 'all', label: 'Todo' },
  { value: 'oficial', label: 'Tienda Oficial' },
  { value: 'feria', label: 'Feria de Ropa' },
]

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const { filters, setFilter } = useShopStore()
  const products = filterProducts(PRODUCTS, filters)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header mobile */}
      <header className="lg:hidden h-16 flex items-center justify-between px-5
        bg-bg-page border-b border-border-subtle sticky top-0 z-10">
        <h1 className="font-display text-xl text-text-strong">La Percha</h1>
        <button className="w-9 h-9 rounded-full bg-surface-sunken
          flex items-center justify-center">
          <Search className="w-4.5 h-4.5 text-text-muted" />
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        <FilterSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Chips categoría — mobile */}
          <div className="lg:hidden px-4 pt-3 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CAT_CHIPS.map(c => (
                <button key={c.value}
                  onClick={() => setFilter('category', c.value)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold
                    whitespace-nowrap transition-colors
                    ${filters.category === c.value
                      ? 'bg-brand text-text-on-brand'
                      : 'bg-surface-sunken text-text-body'}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Barra filtros/ordenar */}
          <div className="flex items-center justify-between px-4 lg:px-6 py-2 gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSheetOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                  border border-border-default text-sm text-text-body
                  hover:border-brand transition-colors bg-surface-card">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filtros
              </button>
              <p className="text-xs text-text-muted">
                {products.length} prenda{products.length !== 1 ? 's' : ''}
              </p>
            </div>
            <SortDropdown />
          </div>

          <div className="mx-4 lg:mx-6 h-px bg-border-subtle" />

          {/* Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-4xl">🪣</p>
              <p className="text-text-muted text-sm">No hay prendas con esos filtros</p>
              <button
                onClick={() => useShopStore.getState().resetFilters()}
                className="text-brand text-sm font-semibold hover:underline">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
              gap-3 p-4 lg:p-6 pb-24 lg:pb-10">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <FilterBottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
```

- [ ] **Step 2: Verificar en browser**

- http://localhost:3000/home muestra 12 productos
- Click en "Tienda Oficial" filtra a productos con store_type=oficial
- "Filtros ▼" (mobile) abre el bottom sheet
- SortDropdown cambia el orden del grid en tiempo real
- Badge del carrito se actualiza

- [ ] **Step 3: Commit**

```bash
git add src/app/(cliente)/home/page.tsx
git commit -m "feat: Home page con filtros funcionales conectados al store"
```

---

## Task 8: Componentes de detalle — ProductGallery + SizeSelector + SellerCard

**Files:**
- Create: `src/components/ProductGallery.tsx`
- Create: `src/components/SizeSelector.tsx`
- Create: `src/components/SellerCard.tsx`

**Interfaces:**
- Produces: `<ProductGallery images={string[]} />` consumido por ProductoPage
- Produces: `<SizeSelector sizes={string[]} selected={string} onChange={fn} error={bool} />` consumido por ProductoPage
- Produces: `<SellerCard seller={Seller} />` consumido por ProductoPage

- [ ] **Step 1: Crear src/components/ProductGallery.tsx**

```tsx
"use client"
import { useState, useRef } from "react"

interface Props {
  images: string[]
  title: string
}

export function ProductGallery({ images, title }: Props) {
  const [active, setActive] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth)
    setActive(idx)
  }

  return (
    <div>
      {/* Mobile: scroll snap */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-none">
        {images.map((img, i) => (
          <div key={i} className="shrink-0 w-full snap-center">
            <div className="relative h-[320px] bg-surface-sunken">
              <img src={img} alt={`${title} foto ${i + 1}`}
                className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>

      {/* Dots mobile */}
      {images.length > 1 && (
        <div className="lg:hidden flex justify-center gap-1.5 mt-2">
          {images.map((_, i) => (
            <span key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors
                ${i === active ? 'bg-text-strong' : 'bg-border-default'}`} />
          ))}
        </div>
      )}

      {/* Desktop: imagen principal + thumbnails */}
      <div className="hidden lg:block">
        <div className="relative h-[480px] rounded-xl bg-surface-sunken overflow-hidden">
          <img src={images[active]} alt={`${title} foto ${active + 1}`}
            className="w-full h-full object-cover" />
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-2">
            {images.map((img, i) => (
              <button key={i}
                onClick={() => setActive(i)}
                className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors
                  ${i === active ? 'border-brand' : 'border-transparent'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Crear src/components/SizeSelector.tsx**

```tsx
interface Props {
  sizes: string[]
  selected: string
  onChange: (size: string) => void
  error?: boolean
}

export function SizeSelector({ sizes, selected, onChange, error }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-text-strong mb-2">
        Talle <span className="text-error-500">*</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map(s => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`min-w-[44px] h-11 px-3 rounded-lg border text-sm font-semibold
              transition-colors
              ${selected === s
                ? 'bg-brand border-brand text-text-on-brand'
                : 'border-border-default text-text-body hover:border-brand hover:text-brand'}`}>
            {s}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-error-500 mt-1.5 flex items-center gap-1">
          ⚠ Seleccioná un talle para continuar
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Crear src/components/SellerCard.tsx**

```tsx
import { Star } from "lucide-react"
import type { Seller } from "@/lib/types"

export function SellerCard({ seller }: { seller: Seller }) {
  return (
    <div className="flex items-center gap-3 py-3 border-y border-border-subtle">
      <img
        src={seller.avatar}
        alt={seller.name}
        className="w-10 h-10 rounded-full object-cover bg-surface-sunken"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-strong truncate">{seller.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="w-3 h-3 fill-rating-star text-rating-star" />
          <span className="text-xs text-text-muted">
            {seller.rating} · {seller.sales_count} ventas
          </span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ProductGallery.tsx src/components/SizeSelector.tsx src/components/SellerCard.tsx
git commit -m "feat: ProductGallery, SizeSelector y SellerCard"
```

---

## Task 9: Producto detail page — implementación completa

**Files:**
- Replace: `src/app/(cliente)/producto/[id]/page.tsx`

**Interfaces:**
- Consumes: `PRODUCTS` para encontrar producto por id
- Consumes: `ProductGallery`, `SizeSelector`, `SellerCard`, `Toast`
- Consumes: `useShopStore` → `addToCart`, `toggleFavorite`, `isFavorite`

- [ ] **Step 1: Reemplazar src/app/(cliente)/producto/[id]/page.tsx**

```tsx
"use client"
import { use, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShoppingBag, Heart } from "lucide-react"
import { PRODUCTS } from "@/lib/placeholder-products"
import { useShopStore } from "@/store/useShopStore"
import { ProductGallery } from "@/components/ProductGallery"
import { SizeSelector } from "@/components/SizeSelector"
import { SellerCard } from "@/components/SellerCard"
import { Toast } from "@/components/Toast"

const CONDITION_LABEL: Record<string, string> = {
  new_tag: 'Nuevo con etiqueta',
  new: 'Nuevo',
  like_new: 'Como nuevo',
  used: 'Usado',
}

export default function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState('')
  const [sizeError, setSizeError] = useState(false)
  const [toast, setToast] = useState(false)

  const addToCart = useShopStore(s => s.addToCart)
  const toggleFavorite = useShopStore(s => s.toggleFavorite)
  const isFav = useShopStore(s => s.isFavorite(id))

  const product = PRODUCTS.find(p => p.id === id)
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-4xl">🕵️</p>
        <p className="text-text-muted">Prenda no encontrada</p>
        <Link href="/home" className="text-brand font-semibold text-sm hover:underline">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return }
    setSizeError(false)
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      store_type: product.store_type,
    })
    setToast(true)
    setTimeout(() => router.push('/home'), 2100)
  }

  return (
    <>
      {/* Header mobile */}
      <div className="flex items-center gap-2 h-14 px-4 lg:hidden">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-surface-sunken flex items-center justify-center">
          <ArrowLeft className="w-4.5 h-4.5 text-text-strong" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => toggleFavorite(product.id)}
          className="w-9 h-9 rounded-full bg-surface-sunken flex items-center justify-center">
          <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-error-500 text-error-500' : 'text-text-muted'}`} />
        </button>
        <Link href="/carrito"
          className="w-9 h-9 rounded-full bg-surface-sunken flex items-center justify-center">
          <ShoppingBag className="w-4.5 h-4.5 text-text-strong" />
        </Link>
      </div>

      {/* Back desktop */}
      <div className="hidden lg:flex items-center gap-2 px-6 py-4">
        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-text-muted text-sm
            hover:text-text-strong transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </button>
      </div>

      {/* Two-column layout */}
      <div className="lg:flex lg:gap-10 lg:px-6 lg:pb-10 lg:items-start">

        {/* Galería */}
        <div className="lg:w-[45%] lg:shrink-0">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4 px-4 lg:px-0 lg:flex-1 pt-4 lg:pt-0">

          {/* Tipo + título + heart */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold
                  bg-surface-sunken text-text-muted mb-1">
                  {product.store_type === 'oficial' ? 'Tienda Oficial' : 'Feria de Ropa'}
                </span>
                <h1 className="font-display text-2xl text-text-strong leading-tight">
                  {product.title}
                </h1>
              </div>
              <button
                onClick={() => toggleFavorite(product.id)}
                className="hidden lg:flex w-10 h-10 rounded-full bg-surface-sunken
                  items-center justify-center shrink-0 mt-1">
                <Heart className={`w-5 h-5 ${isFav ? 'fill-error-500 text-error-500' : 'text-text-muted'}`} />
              </button>
            </div>
            <p className="text-2xl font-bold text-price mt-1">
              $ {product.price.toLocaleString('es-AR')}
            </p>
          </div>

          {/* Vendedor */}
          <SellerCard seller={product.seller} />

          {/* Metadata */}
          <div className="flex gap-4">
            <div>
              <p className="text-xs text-text-muted">Estado</p>
              <p className="text-sm font-semibold text-text-strong">
                {CONDITION_LABEL[product.condition]}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Marca</p>
              <p className="text-sm font-semibold text-text-strong">{product.brand}</p>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-sm text-text-muted leading-relaxed">{product.description}</p>

          {/* Selector de talle */}
          <SizeSelector
            sizes={product.sizes}
            selected={selectedSize}
            onChange={(s) => { setSelectedSize(s); setSizeError(false) }}
            error={sizeError}
          />

          {/* CTA — fixed bottom mobile → inline desktop */}
          <div className="fixed bottom-20 inset-x-0 mx-auto w-full max-w-107.5
            bg-bg-page border-t border-border-subtle px-4 pt-3 pb-4
            lg:static lg:bottom-auto lg:border-t-0 lg:pt-2 lg:pb-0
            lg:px-0 lg:max-w-full z-10">
            <button
              onClick={handleAddToCart}
              disabled={false}
              className={`flex items-center justify-center gap-2.5 w-full h-13
                font-semibold rounded-lg transition-colors
                ${!selectedSize
                  ? 'bg-brand/40 text-text-on-brand cursor-not-allowed'
                  : 'bg-brand hover:bg-brand-hover text-text-on-brand cursor-pointer'}`}>
              <ShoppingBag className="w-5 h-5" />
              Agregar al carrito
            </button>
          </div>

          {/* Spacer mobile para el CTA fixed */}
          <div className="h-20 lg:hidden" />
        </div>
      </div>

      {toast && (
        <Toast
          message="¡Agregado al carrito!"
          onClose={() => setToast(false)}
          duration={2000}
        />
      )}
    </>
  )
}
```

- [ ] **Step 2: Verificar en browser**

- Ir a http://localhost:3000/home → click en una prenda
- La galería muestra las fotos (dots en mobile, thumbnails en desktop)
- El botón "Agregar al carrito" aparece desactivado (semitransparente)
- Elegir talle → botón se activa
- Click → toast "¡Agregado al carrito!" → redirige a /home
- Badge del carrito en navbar se incrementa

- [ ] **Step 3: Commit**

```bash
git add src/app/(cliente)/producto/[id]/page.tsx
git commit -m "feat: página de producto completa con galería, talle obligatorio y carrito"
```

---

## Task 10: CartItemRow + CartSummary

**Files:**
- Create: `src/components/CartItemRow.tsx`
- Create: `src/components/CartSummary.tsx`

**Interfaces:**
- Produces: `<CartItemRow item={CartItem} onRemove={fn} />` consumido por CarritoPage
- Produces: `<CartSummary total={number} onCheckout={fn} />` consumido por CarritoPage

- [ ] **Step 1: Crear src/components/CartItemRow.tsx**

```tsx
import { X } from "lucide-react"
import type { CartItem } from "@/lib/types"

interface Props {
  item: CartItem
  onRemove: (productId: string) => void
}

export function CartItemRow({ item, onRemove }: Props) {
  return (
    <div className="flex items-center gap-3 bg-surface-card px-4 py-3.5
      border-b border-border-subtle last:border-b-0
      lg:rounded-lg lg:border lg:border-border-subtle lg:mb-2">
      <div className="w-16 h-16 rounded-md bg-surface-sunken shrink-0 overflow-hidden">
        <img src={item.image} alt={item.title}
          className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-strong truncate">{item.title}</p>
        <p className="text-xs text-text-muted mt-0.5">
          Talle {item.size} · {item.store_type === 'oficial' ? 'Tienda Oficial' : 'Feria'}
        </p>
        <p className="text-sm font-bold text-price mt-1">
          $ {item.price.toLocaleString('es-AR')}
        </p>
      </div>
      <button
        onClick={() => onRemove(item.productId)}
        aria-label="Eliminar del carrito"
        className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center
          hover:bg-error-50 hover:text-error-500 transition-colors shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Crear src/components/CartSummary.tsx**

```tsx
import Link from "next/link"

interface Props {
  total: number
  itemCount: number
}

export function CartSummary({ total, itemCount }: Props) {
  return (
    <div className="fixed bottom-20 inset-x-0 mx-auto w-full max-w-107.5
      bg-surface-card border-t border-border-subtle
      lg:static lg:bottom-auto lg:w-80 lg:shrink-0
      lg:rounded-xl lg:border lg:border-border-subtle
      lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
      <div className="px-4 py-3 space-y-2 lg:px-5 lg:py-4">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Subtotal ({itemCount} prenda{itemCount !== 1 ? 's' : ''})</span>
          <span className="font-semibold text-text-strong">
            $ {total.toLocaleString('es-AR')}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Envío</span>
          <span className="text-text-muted italic">A calcular</span>
        </div>
        <div className="h-px bg-border-subtle" />
        <div className="flex justify-between text-base">
          <span className="font-semibold text-text-strong">Total</span>
          <span className="font-bold text-price text-lg">
            $ {total.toLocaleString('es-AR')}
          </span>
        </div>
      </div>
      <div className="px-4 pb-4 lg:px-5 lg:pb-5">
        <Link href="/checkout/paso-1"
          className={`flex items-center justify-center w-full h-13
            font-semibold rounded-lg transition-colors
            ${itemCount === 0
              ? 'bg-border-subtle text-text-muted cursor-not-allowed pointer-events-none'
              : 'bg-brand hover:bg-brand-hover text-text-on-brand'}`}>
          Iniciar checkout
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CartItemRow.tsx src/components/CartSummary.tsx
git commit -m "feat: CartItemRow y CartSummary"
```

---

## Task 11: Carrito page completa

**Files:**
- Replace: `src/app/(cliente)/carrito/page.tsx`

**Interfaces:**
- Consumes: `useShopStore` → `cart`, `removeFromCart`, `cartTotal`, `cartCount`
- Consumes: `CartItemRow`, `CartSummary`

- [ ] **Step 1: Reemplazar src/app/(cliente)/carrito/page.tsx**

```tsx
"use client"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useShopStore } from "@/store/useShopStore"
import { CartItemRow } from "@/components/CartItemRow"
import { CartSummary } from "@/components/CartSummary"

export default function CarritoPage() {
  const cart = useShopStore(s => s.cart)
  const removeFromCart = useShopStore(s => s.removeFromCart)
  const total = useShopStore(s => s.cartTotal())

  return (
    <>
      <div className="flex items-center h-14 px-4 lg:px-6">
        <h1 className="font-display text-xl text-text-strong">
          Carrito {cart.length > 0 && `(${cart.length})`}
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 px-6">
          <div className="w-20 h-20 rounded-full bg-surface-sunken flex items-center justify-center">
            <ShoppingBag className="w-9 h-9 text-text-muted" />
          </div>
          <div className="text-center">
            <p className="font-display text-xl text-text-strong">Tu carrito está vacío</p>
            <p className="text-text-muted text-sm mt-1">Explorá las prendas y empezá a elegir</p>
          </div>
          <Link href="/home"
            className="px-6 py-2.5 rounded-lg bg-brand text-text-on-brand
              font-semibold text-sm hover:bg-brand-hover transition-colors">
            Explorar prendas
          </Link>
        </div>
      ) : (
        <div className="lg:flex lg:gap-8 lg:px-6 lg:pb-10 lg:items-start">
          {/* Items */}
          <div className="flex flex-col pb-56 lg:pb-0 lg:flex-1">
            {cart.map(item => (
              <CartItemRow
                key={item.productId}
                item={item}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Resumen */}
          <CartSummary total={total} itemCount={cart.length} />
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Verificar en browser**

- Agregar 2 prendas desde producto → ir a /carrito → ver ambas con foto, talle, precio
- Eliminar una → lista se actualiza, total recalcula
- Carrito vacío → mostrar estado vacío con botón "Explorar prendas"
- Panel de resumen en mobile: fixed arriba del bottom nav
- "Iniciar checkout" navega a /checkout/paso-1

- [ ] **Step 3: Commit**

```bash
git add src/app/(cliente)/carrito/page.tsx
git commit -m "feat: Carrito page completa conectada al store"
```

---

## Task 12: CheckoutStepper + PaymentMethodCard

**Files:**
- Create: `src/components/CheckoutStepper.tsx`
- Create: `src/components/PaymentMethodCard.tsx`

**Interfaces:**
- Produces: `<CheckoutStepper currentStep={1|2|3} />` consumido por paso-1, paso-2, paso-3
- Produces: `<PaymentMethodCard id value selected onChange label description children />` consumido por paso-2

- [ ] **Step 1: Crear src/components/CheckoutStepper.tsx**

```tsx
import Link from "next/link"
import { Check } from "lucide-react"

const STEPS = [
  { n: 1, label: 'Entrega', href: '/checkout/paso-1' },
  { n: 2, label: 'Pago', href: '/checkout/paso-2' },
  { n: 3, label: 'Confirmación', href: '/checkout/paso-3' },
]

export function CheckoutStepper({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center gap-0 px-4 py-4">
      {STEPS.map((step, i) => {
        const done = step.n < currentStep
        const active = step.n === currentStep

        return (
          <div key={step.n} className="flex items-center">
            {done ? (
              <Link href={step.href}
                className="flex items-center gap-1.5 group">
                <span className="w-7 h-7 rounded-full bg-brand flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-text-on-brand" />
                </span>
                <span className="text-xs font-medium text-brand
                  hidden sm:block group-hover:underline">
                  {step.label}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center
                  text-xs font-bold
                  ${active
                    ? 'bg-brand text-text-on-brand'
                    : 'bg-surface-sunken text-text-muted'}`}>
                  {step.n}
                </span>
                <span className={`text-xs font-medium hidden sm:block
                  ${active ? 'text-text-strong' : 'text-text-muted'}`}>
                  {step.label}
                </span>
              </div>
            )}

            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px mx-2
                ${step.n < currentStep ? 'bg-brand' : 'bg-border-default'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Crear src/components/PaymentMethodCard.tsx**

```tsx
interface Props {
  id: string
  value: string
  selected: string
  onChange: (value: string) => void
  label: string
  description: string
  children?: React.ReactNode
}

export function PaymentMethodCard({ id, value, selected, onChange, label, description, children }: Props) {
  const isSelected = selected === value
  return (
    <label htmlFor={id}
      className={`block cursor-pointer rounded-xl border-2 p-4 transition-colors
        ${isSelected
          ? 'border-brand bg-sage-50'
          : 'border-border-subtle hover:border-border-default'}`}>
      <div className="flex items-center gap-3">
        <input
          type="radio"
          id={id}
          name="payment"
          value={value}
          checked={isSelected}
          onChange={() => onChange(value)}
          className="accent-brand w-4 h-4 shrink-0"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-strong">{label}</p>
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        </div>
      </div>
      {isSelected && children && (
        <div className="mt-3 pt-3 border-t border-border-subtle">
          {children}
        </div>
      )}
    </label>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CheckoutStepper.tsx src/components/PaymentMethodCard.tsx
git commit -m "feat: CheckoutStepper y PaymentMethodCard"
```

---

## Task 13: Checkout Paso 1 — Entrega

**Files:**
- Replace: `src/app/(cliente)/checkout/paso-1/page.tsx`

- [ ] **Step 1: Reemplazar src/app/(cliente)/checkout/paso-1/page.tsx**

```tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckoutStepper } from "@/components/CheckoutStepper"

const PROVINCIAS = [
  'Buenos Aires','CABA','Catamarca','Chaco','Chubut','Córdoba',
  'Corrientes','Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja',
  'Mendoza','Misiones','Neuquén','Río Negro','Salta','San Juan',
  'San Luis','Santa Cruz','Santa Fe','Santiago del Estero',
  'Tierra del Fuego','Tucumán',
]

interface FormData {
  nombre: string
  email: string
  provincia: string
  ciudad: string
  cp: string
  direccion: string
}

type Errors = Partial<Record<keyof FormData, string>>

function validate(form: FormData): Errors {
  const e: Errors = {}
  if (!form.nombre.trim()) e.nombre = 'Requerido'
  if (!form.email.trim() || !form.email.includes('@')) e.email = 'Email inválido'
  if (!form.provincia) e.provincia = 'Requerido'
  if (!form.ciudad.trim()) e.ciudad = 'Requerido'
  if (!form.cp.trim()) e.cp = 'Requerido'
  if (!form.direccion.trim()) e.direccion = 'Requerido'
  return e
}

export default function CheckoutPaso1() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    nombre: '', email: '', provincia: '', ciudad: '', cp: '', direccion: '',
  })
  const [errors, setErrors] = useState<Errors>({})

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(ev => ({ ...ev, [key]: undefined }))
  }

  const handleContinuar = () => {
    const e = validate(form)
    if (Object.keys(e).length > 0) { setErrors(e); return }
    // Guardar en sessionStorage para paso 3
    sessionStorage.setItem('checkout_address', JSON.stringify(form))
    router.push('/checkout/paso-2')
  }

  const inputClass = (err?: string) =>
    `w-full h-12 rounded-lg border px-4 text-sm text-text-strong
    placeholder:text-text-subtle bg-surface-card
    focus:outline-none focus:border-brand transition-colors
    ${err ? 'border-error-500' : 'border-border-default'}`

  return (
    <div className="w-full lg:max-w-lg lg:mx-auto">
      <CheckoutStepper currentStep={1} />

      <div className="px-4 lg:px-0 pb-32 lg:pb-10 space-y-4 mt-2">
        <h2 className="font-display text-xl text-text-strong">Datos de entrega</h2>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-text-strong">Nombre completo</label>
          <input value={form.nombre} onChange={set('nombre')} placeholder="Ej: María García"
            className={inputClass(errors.nombre)} />
          {errors.nombre && <p className="text-xs text-error-500">{errors.nombre}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-text-strong">Email</label>
          <input type="email" value={form.email} onChange={set('email')} placeholder="tu@email.com"
            className={inputClass(errors.email)} />
          {errors.email && <p className="text-xs text-error-500">{errors.email}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-text-strong">Provincia</label>
          <select value={form.provincia} onChange={set('provincia')}
            className={inputClass(errors.provincia)}>
            <option value="">Seleccioná una provincia</option>
            {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.provincia && <p className="text-xs text-error-500">{errors.provincia}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-text-strong">Ciudad</label>
            <input value={form.ciudad} onChange={set('ciudad')} placeholder="Ej: Rosario"
              className={inputClass(errors.ciudad)} />
            {errors.ciudad && <p className="text-xs text-error-500">{errors.ciudad}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-text-strong">Código postal</label>
            <input value={form.cp} onChange={set('cp')} placeholder="Ej: 2000"
              className={inputClass(errors.cp)} />
            {errors.cp && <p className="text-xs text-error-500">{errors.cp}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-text-strong">Dirección</label>
          <input value={form.direccion} onChange={set('direccion')} placeholder="Ej: San Martín 1234"
            className={inputClass(errors.direccion)} />
          {errors.direccion && <p className="text-xs text-error-500">{errors.direccion}</p>}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-20 inset-x-0 mx-auto w-full max-w-107.5
        bg-bg-page border-t border-border-subtle px-4 pt-3 pb-4
        lg:static lg:bottom-auto lg:border-t-0 lg:pt-4 lg:pb-0
        lg:px-0 lg:max-w-full z-10">
        <button onClick={handleContinuar}
          className="w-full h-13 bg-brand hover:bg-brand-hover
            text-text-on-brand font-semibold rounded-lg transition-colors">
          Continuar →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar en browser**

- Ir a http://localhost:3000/checkout/paso-1
- Click "Continuar" sin datos → errores rojos en campos requeridos
- Completar todos → navega a paso-2
- Stepper muestra paso 1 activo

- [ ] **Step 3: Commit**

```bash
git add src/app/(cliente)/checkout/paso-1/page.tsx
git commit -m "feat: Checkout paso 1 con validación y stepper"
```

---

## Task 14: Checkout Paso 2 — Pago

**Files:**
- Replace: `src/app/(cliente)/checkout/paso-2/page.tsx`

- [ ] **Step 1: Reemplazar src/app/(cliente)/checkout/paso-2/page.tsx**

```tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useShopStore } from "@/store/useShopStore"
import { CheckoutStepper } from "@/components/CheckoutStepper"
import { PaymentMethodCard } from "@/components/PaymentMethodCard"

export default function CheckoutPaso2() {
  const router = useRouter()
  const [method, setMethod] = useState('')
  const [error, setError] = useState(false)
  const total = useShopStore(s => s.cartTotal())

  const handleConfirmar = () => {
    if (!method) { setError(true); return }
    sessionStorage.setItem('checkout_payment', method)
    router.push('/checkout/paso-3')
  }

  return (
    <div className="w-full lg:max-w-lg lg:mx-auto">
      <CheckoutStepper currentStep={2} />

      <div className="px-4 lg:px-0 pb-32 lg:pb-10 space-y-4 mt-2">
        <h2 className="font-display text-xl text-text-strong">Método de pago</h2>

        <div className="space-y-3">
          <PaymentMethodCard
            id="mp"
            value="mercadopago"
            selected={method}
            onChange={(v) => { setMethod(v); setError(false) }}
            label="Mercado Pago"
            description="Pagá con tarjeta, débito o saldo MP">
            <div className="flex items-center gap-3 bg-surface-sunken rounded-lg p-3">
              <div className="w-10 h-10 rounded-lg bg-[#009EE3] flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs">MP</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-strong">
                  Total: $ {total.toLocaleString('es-AR')}
                </p>
                <p className="text-xs text-text-muted">
                  Serás redirigido a Mercado Pago para completar el pago
                </p>
              </div>
            </div>
          </PaymentMethodCard>

          <PaymentMethodCard
            id="transfer"
            value="transferencia"
            selected={method}
            onChange={(v) => { setMethod(v); setError(false) }}
            label="Transferencia bancaria"
            description="CBU / Alias · Acreditación en 24-48hs">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">CBU</span>
                <span className="font-mono text-text-strong text-xs">0000003100012345678901</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Alias</span>
                <span className="font-semibold text-text-strong">LAPERCHA.SHOWROOM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Banco</span>
                <span className="text-text-strong">Banco Galicia</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted font-semibold">Monto</span>
                <span className="font-bold text-price">$ {total.toLocaleString('es-AR')}</span>
              </div>
              <p className="text-xs text-text-muted bg-warning-50 rounded-lg p-2.5 mt-1">
                📧 Envianos el comprobante a <strong>pagos@lapercha.com.ar</strong> con el número de orden
              </p>
            </div>
          </PaymentMethodCard>
        </div>

        {error && (
          <p className="text-xs text-error-500">⚠ Seleccioná un método de pago</p>
        )}
      </div>

      {/* CTA */}
      <div className="fixed bottom-20 inset-x-0 mx-auto w-full max-w-107.5
        bg-bg-page border-t border-border-subtle px-4 pt-3 pb-4
        lg:static lg:bottom-auto lg:border-t-0 lg:pt-4 lg:pb-0
        lg:px-0 lg:max-w-full z-10">
        <button onClick={handleConfirmar}
          className={`w-full h-13 font-semibold rounded-lg transition-colors
            ${method
              ? 'bg-brand hover:bg-brand-hover text-text-on-brand'
              : 'bg-brand/40 text-text-on-brand cursor-not-allowed'}`}>
          Confirmar pago →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar en browser**

- /checkout/paso-2: stepper muestra paso 2 activo, paso 1 con check clickeable
- Click en Mercado Pago → se expande con detalle del monto
- Click en Transferencia → muestra CBU, Alias y monto del carrito real
- Sin método seleccionado → error al intentar confirmar

- [ ] **Step 3: Commit**

```bash
git add src/app/(cliente)/checkout/paso-2/page.tsx
git commit -m "feat: Checkout paso 2 con MP y transferencia"
```

---

## Task 15: Checkout Paso 3 — Confirmación

**Files:**
- Create: `src/app/(cliente)/checkout/paso-3/page.tsx`

- [ ] **Step 1: Crear src/app/(cliente)/checkout/paso-3/page.tsx**

```tsx
"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { useShopStore } from "@/store/useShopStore"
import { CheckoutStepper } from "@/components/CheckoutStepper"

export default function CheckoutPaso3() {
  const cart = useShopStore(s => s.cart)
  const total = useShopStore(s => s.cartTotal())
  const clearCart = useShopStore(s => s.clearCart)
  const [orderNumber] = useState(() => `LP-${Math.floor(10000 + Math.random() * 90000)}`)
  const [email, setEmail] = useState('')
  const [items, setItems] = useState(cart)
  const [orderTotal, setOrderTotal] = useState(total)

  useEffect(() => {
    // Capturar datos antes de limpiar
    setItems([...cart])
    setOrderTotal(total)
    const stored = sessionStorage.getItem('checkout_address')
    if (stored) {
      try { setEmail(JSON.parse(stored).email) } catch {}
    }
    clearCart()
    sessionStorage.removeItem('checkout_address')
    sessionStorage.removeItem('checkout_payment')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full lg:max-w-lg lg:mx-auto">
      <CheckoutStepper currentStep={3} />

      <div className="px-4 lg:px-0 py-8 flex flex-col items-center gap-6">
        {/* Ícono éxito */}
        <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-success-500" />
        </div>

        <div className="text-center">
          <h1 className="font-display text-2xl text-text-strong">¡Pedido confirmado!</h1>
          <p className="text-text-muted text-sm mt-1">
            Orden <span className="font-mono font-semibold text-text-strong">#{orderNumber}</span>
          </p>
          {email && (
            <p className="text-text-muted text-sm mt-1">
              Te enviamos los detalles a <strong>{email}</strong>
            </p>
          )}
        </div>

        {/* Resumen de items */}
        {items.length > 0 && (
          <div className="w-full bg-surface-card rounded-xl border border-border-subtle overflow-hidden">
            <div className="px-4 py-3 border-b border-border-subtle">
              <p className="text-sm font-semibold text-text-strong">Tu pedido</p>
            </div>
            <div className="divide-y divide-border-subtle">
              {items.map(item => (
                <div key={item.productId} className="flex items-center gap-3 px-4 py-3">
                  <img src={item.image} alt={item.title}
                    className="w-12 h-12 rounded-md object-cover bg-surface-sunken shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-strong truncate">{item.title}</p>
                    <p className="text-xs text-text-muted">Talle {item.size}</p>
                  </div>
                  <p className="text-sm font-bold text-price shrink-0">
                    $ {item.price.toLocaleString('es-AR')}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-border-subtle flex justify-between">
              <span className="font-semibold text-text-strong">Total</span>
              <span className="font-bold text-price">
                $ {orderTotal.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        )}

        <Link href="/home"
          className="w-full h-13 flex items-center justify-center
            bg-brand hover:bg-brand-hover text-text-on-brand
            font-semibold rounded-lg transition-colors">
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar flujo completo end-to-end**

1. Ir a http://localhost:3000/home
2. Clickar una prenda → elegir talle → "Agregar al carrito" → toast → redirige a home
3. Agregar segunda prenda
4. Ir a /carrito → ver 2 items, total correcto
5. "Iniciar checkout" → paso 1 → completar datos → "Continuar"
6. Paso 2 → elegir método → "Confirmar pago"
7. Paso 3 → ver número de orden, resumen de items, total
8. "Seguir comprando" → carrito vacío en /home, badge = 0

- [ ] **Step 3: Commit final**

```bash
git add src/app/(cliente)/checkout/paso-3/page.tsx
git commit -m "feat: Checkout paso 3 confirmación — flujo de compra completo"
```

---

## Self-Review

**Spec coverage:**
- ✅ Store Zustand con cart + favorites + filters
- ✅ 12 productos mock con todos los campos
- ✅ filterProducts función pura
- ✅ Home con chips categoría + FilterSidebar desktop + FilterBottomSheet mobile + SortDropdown
- ✅ ProductCard con heart toggle
- ✅ Navbar con badge carrito
- ✅ Producto detail: galería snap mobile + thumbnails desktop + talle obligatorio + toast
- ✅ Carrito: CartItemRow + CartSummary + estado vacío
- ✅ Checkout: CheckoutStepper + paso-1 (validación) + paso-2 (MP + transferencia) + paso-3 (confirmación + clearCart)

**Placeholder scan:** Sin TBDs ni TODOs. Todo el código presente en cada step.

**Type consistency:**
- `CartItem` definido en types.ts Task 1, usado igual en store Task 2 y todos los siguientes ✅
- `Product` del types.ts usado en ProductCard, ProductoPage, placeholder-products ✅
- `Filters` con exactamente los mismos keys en types.ts y useShopStore ✅
- `useShopStore(s => s.cartTotal())` — `cartTotal` es función, se llama con `()` en todos los usos ✅
