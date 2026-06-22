import { create } from "zustand"

export type ProductStatus = "pending" | "approved" | "rejected"
export type VendorStatus = "pending" | "approved" | "rejected"

export interface AdminProduct {
  id: string
  title: string
  price: number
  image: string
  seller: string
  sellerType: "oficial" | "feria"
  category: string
  condition: string
  status: ProductStatus
  createdAt: string
}

export interface VendorRequest {
  id: string
  name: string
  email: string
  avatar: string
  cbu: string
  products: number
  status: VendorStatus
  createdAt: string
}

export type OrderStatus = "pending_shipment" | "shipped" | "delivered" | "cancelled"

export interface AdminOrder {
  id: string
  productTitle: string
  productImage: string
  price: number
  buyerName: string
  buyerEmail: string
  sellerName: string
  sellerEmail: string
  size: string
  address: string
  status: OrderStatus
  createdAt: string
}

export interface StoreProductForm {
  title: string
  price: number
  description: string
  category: string
  subcategory: string
  condition: string
  sizes: string[]
  image: string
  free_shipping: boolean
}

interface AdminState {
  products: AdminProduct[]
  vendors: VendorRequest[]
  orders: AdminOrder[]
  approveProduct: (id: string) => void
  rejectProduct: (id: string) => void
  approveVendor: (id: string) => void
  rejectVendor: (id: string) => void
  addStoreProduct: (p: StoreProductForm) => void
  updateStoreProduct: (id: string, p: Partial<StoreProductForm>) => void
  removeStoreProduct: (id: string) => void
  markOrderShipped: (id: string) => void
  markOrderDelivered: (id: string) => void
}

const MOCK_PRODUCTS: AdminProduct[] = [
  {
    id: "p1", title: "Vestido lino sage", price: 18900,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=267&fit=crop",
    seller: "Laura M.", sellerType: "feria", category: "mujer",
    condition: "new_tag", status: "pending", createdAt: "2026-06-21"
  },
  {
    id: "p2", title: "Blazer crema oversize", price: 24700,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e6f?w=200&h=267&fit=crop",
    seller: "Tienda Oficial", sellerType: "oficial", category: "mujer",
    condition: "like_new", status: "approved", createdAt: "2026-06-20"
  },
  {
    id: "p3", title: "Top crochet mint", price: 8300,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=267&fit=crop",
    seller: "Sofía R.", sellerType: "feria", category: "mujer",
    condition: "new", status: "pending", createdAt: "2026-06-21"
  },
  {
    id: "p4", title: "Jean mom fit talle 26", price: 15300,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=267&fit=crop",
    seller: "Carla G.", sellerType: "feria", category: "mujer",
    condition: "used", status: "pending", createdAt: "2026-06-22"
  },
  {
    id: "p5", title: "Camisa lino hombre M", price: 11600,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=267&fit=crop",
    seller: "Martín P.", sellerType: "feria", category: "hombre",
    condition: "new_tag", status: "pending", createdAt: "2026-06-22"
  },
  {
    id: "p6", title: "Zapatillas urbanas talle 38", price: 19700,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=267&fit=crop",
    seller: "Tienda Oficial", sellerType: "oficial", category: "mujer",
    condition: "new", status: "approved", createdAt: "2026-06-19"
  },
  {
    id: "p7", title: "Conjunto bebé orgánico", price: 9200,
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&h=267&fit=crop",
    seller: "Valen T.", sellerType: "feria", category: "kids",
    condition: "new_tag", status: "pending", createdAt: "2026-06-22"
  },
  {
    id: "p8", title: "Kimono seda estampado", price: 21500,
    image: "https://images.unsplash.com/photo-1602607144289-dcc40cc61b90?w=200&h=267&fit=crop",
    seller: "Flor D.", sellerType: "feria", category: "mujer",
    condition: "like_new", status: "rejected", createdAt: "2026-06-20"
  },
  {
    id: "p9", title: "Buzo oversized kids 10", price: 10800,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200&h=267&fit=crop",
    seller: "Romi S.", sellerType: "feria", category: "kids",
    condition: "used", status: "pending", createdAt: "2026-06-21"
  },
  {
    id: "p10", title: "Sweater cashmere camel", price: 31200,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=267&fit=crop",
    seller: "Tienda Oficial", sellerType: "oficial", category: "mujer",
    condition: "new_tag", status: "approved", createdAt: "2026-06-18"
  },
]

const MOCK_VENDORS: VendorRequest[] = [
  {
    id: "v1", name: "María José López", email: "majo@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    cbu: "0171234540000012345678", products: 12, status: "approved",
    createdAt: "2026-05-15"
  },
  {
    id: "v2", name: "Camila Suárez", email: "cami@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    cbu: "0110567840000098765432", products: 8, status: "pending",
    createdAt: "2026-06-20"
  },
  {
    id: "v3", name: "Florencia D'Angelo", email: "flor@email.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    cbu: "0150999940000011112222", products: 15, status: "pending",
    createdAt: "2026-06-21"
  },
  {
    id: "v4", name: "Valentina Ríos", email: "vale@email.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    cbu: "0720000780000001234567", products: 5, status: "pending",
    createdAt: "2026-06-22"
  },
  {
    id: "v5", name: "Luciana Paz", email: "lu@email.com",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    cbu: "0110123450000099988776", products: 1, status: "rejected",
    createdAt: "2026-06-19"
  },
  {
    id: "v6", name: "Agustina Vega", email: "agus@email.com",
    avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop",
    cbu: "0140333340000055556666", products: 20, status: "approved",
    createdAt: "2026-04-10"
  },
]

const MOCK_ORDERS: AdminOrder[] = [
  {
    id: "ord1", productTitle: "Blazer crema oversize", productImage: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e6f?w=100&h=133&fit=crop",
    price: 24700, buyerName: "Sofía Martínez", buyerEmail: "sofia@email.com",
    sellerName: "Tienda Oficial", sellerEmail: "tienda@lapercha.com",
    size: "M", address: "Av. Alem 1234, Bahía Blanca",
    status: "pending_shipment", createdAt: "2026-06-22"
  },
  {
    id: "ord2", productTitle: "Zapatillas urbanas talle 38", productImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=133&fit=crop",
    price: 19700, buyerName: "Carla Rivas", buyerEmail: "carla@email.com",
    sellerName: "Tienda Oficial", sellerEmail: "tienda@lapercha.com",
    size: "38", address: "Calle 12 nro 456, Punta Alta",
    status: "shipped", createdAt: "2026-06-20"
  },
  {
    id: "ord3", productTitle: "Sweater cashmere camel", productImage: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=100&h=133&fit=crop",
    price: 31200, buyerName: "Valentina Ríos", buyerEmail: "vale@email.com",
    sellerName: "Tienda Oficial", sellerEmail: "tienda@lapercha.com",
    size: "L", address: "Sarmiento 789, Bahía Blanca",
    status: "delivered", createdAt: "2026-06-15"
  },
  {
    id: "ord4", productTitle: "Vestido lino sage", productImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=133&fit=crop",
    price: 18900, buyerName: "Lucía Gómez", buyerEmail: "lu@email.com",
    sellerName: "Laura M.", sellerEmail: "laura@email.com",
    size: "S", address: "Brown 234, Bahía Blanca",
    status: "pending_shipment", createdAt: "2026-06-22"
  },
  {
    id: "ord5", productTitle: "Jean mom fit talle 26", productImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100&h=133&fit=crop",
    price: 15300, buyerName: "Martina Pérez", buyerEmail: "martina@email.com",
    sellerName: "Carla G.", sellerEmail: "carla@email.com",
    size: "26", address: "Estomba 890, Bahía Blanca",
    status: "pending_shipment", createdAt: "2026-06-22"
  },
]

export const useAdminStore = create<AdminState>((set) => ({
  products: MOCK_PRODUCTS,
  vendors: MOCK_VENDORS,
  orders: MOCK_ORDERS,

  approveProduct: (id) => set((s) => ({
    products: s.products.map(p => p.id === id ? { ...p, status: "approved" as const } : p)
  })),

  rejectProduct: (id) => set((s) => ({
    products: s.products.map(p => p.id === id ? { ...p, status: "rejected" as const } : p)
  })),

  approveVendor: (id) => set((s) => ({
    vendors: s.vendors.map(v => v.id === id ? { ...v, status: "approved" as const } : v)
  })),

  rejectVendor: (id) => set((s) => ({
    vendors: s.vendors.map(v => v.id === id ? { ...v, status: "rejected" as const } : v)
  })),

  addStoreProduct: (form) => set((s) => ({
    products: [...s.products, {
      id: `store-${Date.now()}`,
      title: form.title,
      price: form.price,
      image: form.image,
      seller: "Tienda Oficial",
      sellerType: "oficial",
      category: form.category,
      condition: form.condition,
      status: "approved" as const,
      createdAt: new Date().toISOString().slice(0, 10),
    }]
  })),

  updateStoreProduct: (id, form) => set((s) => ({
    products: s.products.map(p => p.id === id ? { ...p, ...form } : p)
  })),

  removeStoreProduct: (id) => set((s) => ({
    products: s.products.filter(p => p.id !== id)
  })),

  markOrderShipped: (id) => set((s) => ({
    orders: s.orders.map(o => o.id === id ? { ...o, status: "shipped" as const } : o)
  })),

  markOrderDelivered: (id) => set((s) => ({
    orders: s.orders.map(o => o.id === id ? { ...o, status: "delivered" as const } : o)
  })),
}))
