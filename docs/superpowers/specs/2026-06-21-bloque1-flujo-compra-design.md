# Design: Bloque 1 — Flujo de Compra
**Fecha:** 2026-06-21  
**Estado:** Aprobado  
**Scope:** Home + Producto Detail + Carrito + Checkout

---

## Contexto

La Percha Showroom es un marketplace C2C de ropa. Vendedor retiene 80%, plataforma 20%.  
Stack: Next.js 16 + Tailwind v4 + TypeScript. Breakpoint único `lg` (1024px). Datos mock hasta conectar Supabase.

---

## Decisiones de diseño

| Decisión | Elección | Razón |
|----------|----------|-------|
| State management | Zustand (un store global) | Simple, reactivo, fácil migrar a Supabase |
| Talle en detalle | Obligatorio antes de agregar | Flujo correcto para marketplace de ropa |
| Métodos de pago | Mercado Pago + Transferencia | Refleja la realidad sin complejidad extra |

---

## Arquitectura

### Store (`src/store/useShopStore.ts`)

```ts
interface CartItem {
  productId: string
  title: string
  price: number
  image: string
  size: string
}

interface Filters {
  category: string        // 'all' | 'oficial' | 'feria'
  size: string           // '' | 'XS' | 'S' | 'M' | 'L' | 'XL'
  condition: string      // '' | 'new_tag' | 'new' | 'like_new' | 'used'
  priceMax: number       // 0 = sin límite
  sort: string           // 'newest' | 'price_asc' | 'price_desc'
}

interface ShopStore {
  // Cart
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  cartCount: () => number
  cartTotal: () => number

  // Favorites
  favorites: string[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean

  // Filters
  filters: Filters
  setFilter: (key: keyof Filters, value: string | number) => void
  resetFilters: () => void
}
```

### Tipos compartidos (`src/lib/types.ts`)

```ts
interface Seller {
  id: string
  name: string
  avatar: string
  rating: number
  sales_count: number
}

interface Product {
  id: string
  title: string
  description: string
  brand: string
  price: number
  images: string[]        // 3-4 URLs
  sizes: string[]         // ['XS','S','M','L','XL']
  condition: 'new_tag' | 'new' | 'like_new' | 'used'
  category: 'all' | 'oficial' | 'feria'
  store_type: 'oficial' | 'feria'
  seller: Seller
  accepts_offers: boolean
  created_at: string
}

interface CartItem {
  productId: string
  title: string
  price: number
  image: string
  size: string
}
```

### Mock data (`src/lib/placeholder-products.ts`)

12 productos con todos los campos del tipo `Product` (brand, sizes[], seller, description, múltiples imágenes, etc.).

---

## Pantalla 1: Home (`/home`)

### Mobile (<1024px)
- Header: logo centrado + ícono búsqueda (derecha)
- Row 1: chips scroll-x horizontal para categoría (Todo / Tienda Oficial / Feria de Ropa / Vestidos / Tops / Pantalones)
- Row 2: botón "Filtros ▼" + dropdown "Ordenar ▼"
- "Filtros ▼" abre un **bottom sheet** con: talle (chips), condición (radio), precio máximo (slider o input)
- Grid 2 columnas, gap-3, pb-24 mobile
- Cada `ProductCard`: imagen 3:4, badge condición, tipo (Oficial/Feria), título truncado, precio, heart toggle

### Desktop (≥1024px)
- Top nav fijo (ya implementado)
- Sidebar 240px sticky: categorías + filtros talle + condición
- Grid 3 col (lg) / 4 col (xl)
- pb-10 (sin bottom nav)

### Interactividad
- Filtros actualizan `filters` en el store → `filteredProducts` computed recalcula en tiempo real
- Heart toggle llama `toggleFavorite(id)` con animación fill
- Badge carrito en navbar lee `cartCount()` del store

---

## Pantalla 2: Producto Detail (`/producto/[id]`)

### Mobile (<1024px)
- Header: botón back (←) + ícono carrito (derecha)
- Galería: scroll horizontal snap, dots de paginación abajo
- Info: tipo (chip), título, heart, precio
- Vendedor: avatar + nombre + rating + cantidad ventas
- Metadata: estado (badge) + marca
- Descripción (texto completo, sin truncar)
- Talle: chips horizontales, selección requerida
  - Error visible "Seleccioná un talle" si intenta agregar sin elegir
- CTA: `fixed bottom-20` → desactivado sin talle

### Desktop (≥1024px)
- Back link arriba izquierda
- Two-column: fotos izquierda 45% + info derecha flex-1
- Fotos: imagen principal grande + row de thumbnails clickeables abajo
- CTA: `lg:static` (inline, no fixed)

### Comportamiento CTA
```
sin talle seleccionado → botón disabled (opacity-50, cursor-not-allowed)
con talle seleccionado → botón activo
click → addToCart(product, selectedSize) → toast "Agregado al carrito" 2s → navigate /home
```

---

## Pantalla 3: Carrito (`/carrito`)

### Estructura
- Header: "Carrito (N)" donde N = cartCount
- Lista de CartItems:
  - Thumbnail 64×64, título, talle, store_type, precio
  - Botón eliminar [×]
  - (Sin control de cantidad — en ropa cada prenda es única)
- Estado vacío: ícono bolsa + "Tu carrito está vacío" + CTA "Explorar prendas"

### Resumen (panel)
- Subtotal: suma de items
- Envío: "A calcular en checkout"
- Total: igual a subtotal por ahora
- CTA: "Iniciar checkout" → `/checkout/paso-1`

### Layout
- Mobile: lista con `pb-56`, panel resumen `fixed bottom-20 max-w-107.5`
- Desktop: `lg:flex lg:gap-8` — lista `flex-1` + panel `w-80 sticky top-(--nav-h)`

---

## Pantalla 4: Checkout (`/checkout`)

### Stepper
- Siempre visible arriba: `1 Entrega → 2 Pago → 3 Confirmación`
- Paso actual: círculo filled brand. Anteriores: check. Siguientes: gris.
- Pasos anteriores son clickeables para volver.

### Paso 1 — Entrega (`/checkout/paso-1`)
Campos requeridos:
- Nombre completo
- Email
- Provincia (select)
- Ciudad
- Código postal
- Dirección (calle + número)

CTA: "Continuar →" → valida campos → navega paso 2

### Paso 2 — Pago (`/checkout/paso-2`)
Opciones (radio card):

**Mercado Pago**
- Logo + "Pagás de forma segura con Mercado Pago"
- Al confirmar: muestra mensaje "Serás redirigido a MP" (mock, no redirige)

**Transferencia Bancaria**
- CBU, Alias, Banco
- Instrucción: "Transferí el total y envianos el comprobante por email"
- Monto a transferir: `$ {cartTotal()}`

CTA: "Confirmar pago →" → navega paso 3

### Paso 3 — Confirmación (`/checkout/paso-3`)
- Ícono check grande verde
- "¡Pedido confirmado! 🎉"
- Número de orden (mock: `#LP-{random 5 digits}`)
- Resumen: items + total
- "Te enviamos los detalles a {email}"
- CTA: "Seguir comprando" → `clearCart()` → `/home`

### Layout checkout
- Mobile: `w-full`, CTA `fixed bottom-20 max-w-107.5`
- Desktop: `lg:max-w-lg lg:mx-auto`, CTA inline

---

## Componentes nuevos a crear

| Componente | Ubicación | Descripción |
|-----------|-----------|-------------|
| `FilterBottomSheet` | `src/components/` | Bottom sheet mobile con filtros |
| `FilterSidebar` | `src/components/` | Sidebar desktop con filtros |
| `SortDropdown` | `src/components/` | Dropdown ordenamiento |
| `ProductGallery` | `src/components/` | Galería con scroll snap + thumbnails |
| `SizeSelector` | `src/components/` | Chips de talle con validación |
| `SellerCard` | `src/components/` | Avatar + nombre + rating |
| `CartItemRow` | `src/components/` | Fila de item en carrito |
| `CartSummary` | `src/components/` | Panel resumen precio |
| `CheckoutStepper` | `src/components/` | Indicador de pasos |
| `PaymentMethodCard` | `src/components/` | Card seleccionable MP / Transferencia |
| `Toast` | `src/components/` | Notificación "Agregado al carrito" |

---

## Archivos a crear / modificar

```
NUEVOS:
src/store/useShopStore.ts
src/lib/types.ts
src/lib/placeholder-products.ts          ← ampliar a 12 productos
src/components/FilterBottomSheet.tsx
src/components/FilterSidebar.tsx
src/components/SortDropdown.tsx
src/components/ProductGallery.tsx
src/components/SizeSelector.tsx
src/components/SellerCard.tsx
src/components/CartItemRow.tsx
src/components/CartSummary.tsx
src/components/CheckoutStepper.tsx
src/components/PaymentMethodCard.tsx
src/components/Toast.tsx
src/app/(cliente)/checkout/paso-2/page.tsx
src/app/(cliente)/checkout/paso-3/page.tsx

MODIFICAR:
src/components/ProductCard.tsx           ← agregar heart toggle
src/components/ClienteNavbar.tsx         ← badge carrito desde store
src/app/(cliente)/home/page.tsx          ← conectar filtros + store
src/app/(cliente)/producto/[id]/page.tsx ← galería + talle + store
src/app/(cliente)/carrito/page.tsx       ← conectar store + CartItem
src/app/(cliente)/checkout/paso-1/page.tsx ← validación + stepper
```

---

## Dependencias nuevas

```bash
bun add zustand
```

No hay otras dependencias nuevas — todo se construye con Tailwind v4 + lucide-react (ya instalados).

---

## Fuera de scope (Bloque 1)

- Login / Registro (Bloque 2)
- Sistema de ofertas
- Chat / Mensajes
- Flujo vendedor (publicar prenda)
- Integración real con Mercado Pago
- Conexión a Supabase
