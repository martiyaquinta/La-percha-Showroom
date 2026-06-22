import { create } from "zustand"

export type ProductStatus = "pending" | "approved" | "rejected"
export type VendorStatus = "pending" | "approved" | "rejected"

export interface AdminProduct {
  id: string
  title: string
  price: number
  prevPrice?: number
  description?: string
  brand?: string
  image: string
  images?: string[]
  seller: string
  sellerType: "oficial" | "feria"
  category: string
  subcategory?: string
  condition?: string
  sizes?: string[]
  colors?: string[]
  free_shipping?: boolean
  destacado?: boolean
  productType: "ropa" | "tienda"
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
  prevPrice?: number
  description: string
  brand?: string
  category: string
  subcategory: string
  condition: string
  sizes: string[]
  colors: string[]
  images: string[]
  free_shipping: boolean
  destacado: boolean
  productType: "ropa" | "tienda"
}

export interface AdminCategory {
  id: string
  nombre: string
  subcategorias: AdminSubcategory[]
}

export interface FAQItem {
  id: string
  pregunta: string
  respuesta: string
}

export interface AdminSubcategory {
  id: string
  categoriaId: string
  nombre: string
}

interface AdminState {
  products: AdminProduct[]
  vendors: VendorRequest[]
  orders: AdminOrder[]
  categories: AdminCategory[]
  approveProduct: (id: string) => void
  rejectProduct: (id: string) => void
  approveVendor: (id: string) => void
  rejectVendor: (id: string) => void
  addStoreProduct: (p: StoreProductForm) => void
  updateStoreProduct: (id: string, p: Partial<StoreProductForm>) => void
  removeStoreProduct: (id: string) => void
  markOrderShipped: (id: string) => void
  markOrderDelivered: (id: string) => void
  addSubcategory: (categoriaId: string, nombre: string) => void
  renameSubcategory: (categoriaId: string, subId: string, nombre: string) => void
  deleteSubcategory: (categoriaId: string, subId: string) => void
  renameCategory: (catId: string, nombre: string) => void
  faq: FAQItem[]
  terms: string
  updateFAQ: (items: FAQItem[]) => void
  updateTerms: (text: string) => void
  addFAQ: (pregunta: string, respuesta: string) => void
  deleteFAQ: (id: string) => void
}

const MOCK_PRODUCTS: AdminProduct[] = [
  {
    id: "p1", title: "Vestido lino sage", price: 18900,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=267&fit=crop",
    seller: "Laura M.", sellerType: "feria", category: "mujer", subcategory: "ropa",
    condition: "new_tag", productType: "ropa", sizes: ["S", "M", "L"],
    status: "pending", createdAt: "2026-06-21"
  },
  {
    id: "p2", title: "Blazer crema oversize", price: 24700, prevPrice: 31000,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e6f?w=200&h=267&fit=crop",
    seller: "Tienda Oficial", sellerType: "oficial", category: "mujer", subcategory: "ropa",
    condition: "like_new", productType: "ropa", sizes: ["M", "L"], free_shipping: true, destacado: true,
    status: "approved", createdAt: "2026-06-20"
  },
  {
    id: "p3", title: "Top crochet mint", price: 8300,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=267&fit=crop",
    seller: "Sofía R.", sellerType: "feria", category: "mujer", subcategory: "ropa",
    condition: "new", productType: "ropa", sizes: ["XS", "S", "M"],
    status: "pending", createdAt: "2026-06-21"
  },
  {
    id: "p4", title: "Jean mom fit talle 26", price: 15300,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=267&fit=crop",
    seller: "Carla G.", sellerType: "feria", category: "mujer", subcategory: "ropa",
    condition: "used", productType: "ropa", sizes: ["26"],
    status: "pending", createdAt: "2026-06-22"
  },
  {
    id: "p5", title: "Camisa lino hombre M", price: 11600,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=267&fit=crop",
    seller: "Martín P.", sellerType: "feria", category: "hombre", subcategory: "ropa",
    condition: "new_tag", productType: "ropa", sizes: ["M", "L", "XL"],
    status: "pending", createdAt: "2026-06-22"
  },
  {
    id: "p6", title: "Zapatillas urbanas talle 38", price: 19700,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=267&fit=crop",
    seller: "Tienda Oficial", sellerType: "oficial", category: "mujer", subcategory: "calzado",
    condition: "new", productType: "ropa", sizes: ["38", "39", "40"], free_shipping: true,
    status: "approved", createdAt: "2026-06-19"
  },
  {
    id: "p7", title: "Conjunto bebé orgánico", price: 9200,
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&h=267&fit=crop",
    seller: "Valen T.", sellerType: "feria", category: "kids", subcategory: "bebes",
    condition: "new_tag", productType: "ropa", sizes: ["Único"],
    status: "pending", createdAt: "2026-06-22"
  },
  {
    id: "p8", title: "Kimono seda estampado", price: 21500,
    image: "https://images.unsplash.com/photo-1602607144289-dcc40cc61b90?w=200&h=267&fit=crop",
    seller: "Flor D.", sellerType: "feria", category: "mujer", subcategory: "ropa",
    condition: "like_new", productType: "ropa", sizes: ["S", "M"],
    status: "rejected", createdAt: "2026-06-20"
  },
  {
    id: "p9", title: "Buzo oversized kids 10", price: 10800,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200&h=267&fit=crop",
    seller: "Romi S.", sellerType: "feria", category: "kids", subcategory: "ninas",
    condition: "used", productType: "ropa", sizes: ["10", "12"],
    status: "pending", createdAt: "2026-06-21"
  },
  {
    id: "p10", title: "Sweater cashmere camel", price: 31200, prevPrice: 38000,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=267&fit=crop",
    seller: "Tienda Oficial", sellerType: "oficial", category: "mujer", subcategory: "ropa",
    condition: "new_tag", productType: "ropa", sizes: ["S", "M", "L", "XL"], free_shipping: true, destacado: true,
    status: "approved", createdAt: "2026-06-18"
  },
]

const MOCK_VENDORS: VendorRequest[] = [
  { id: "v1", name: "María José López", email: "majo@email.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", cbu: "0171234540000012345678", products: 12, status: "approved", createdAt: "2026-05-15" },
  { id: "v2", name: "Camila Suárez", email: "cami@email.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", cbu: "0110567840000098765432", products: 8, status: "pending", createdAt: "2026-06-20" },
  { id: "v3", name: "Florencia D'Angelo", email: "flor@email.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", cbu: "0150999940000011112222", products: 15, status: "pending", createdAt: "2026-06-21" },
  { id: "v4", name: "Valentina Ríos", email: "vale@email.com", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", cbu: "0720000780000001234567", products: 5, status: "pending", createdAt: "2026-06-22" },
  { id: "v5", name: "Luciana Paz", email: "lu@email.com", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop", cbu: "0110123450000099988776", products: 1, status: "rejected", createdAt: "2026-06-19" },
  { id: "v6", name: "Agustina Vega", email: "agus@email.com", avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop", cbu: "0140333340000055556666", products: 20, status: "approved", createdAt: "2026-04-10" },
]

const MOCK_ORDERS: AdminOrder[] = [
  { id: "ord1", productTitle: "Blazer crema oversize", productImage: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e6f?w=100&h=133&fit=crop", price: 24700, buyerName: "Sofía Martínez", buyerEmail: "sofia@email.com", sellerName: "Tienda Oficial", sellerEmail: "tienda@lapercha.com", size: "M", address: "Av. Alem 1234, Bahía Blanca", status: "pending_shipment", createdAt: "2026-06-22" },
  { id: "ord2", productTitle: "Zapatillas urbanas talle 38", productImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=133&fit=crop", price: 19700, buyerName: "Carla Rivas", buyerEmail: "carla@email.com", sellerName: "Tienda Oficial", sellerEmail: "tienda@lapercha.com", size: "38", address: "Calle 12 nro 456, Punta Alta", status: "shipped", createdAt: "2026-06-20" },
  { id: "ord3", productTitle: "Sweater cashmere camel", productImage: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=100&h=133&fit=crop", price: 31200, buyerName: "Valentina Ríos", buyerEmail: "vale@email.com", sellerName: "Tienda Oficial", sellerEmail: "tienda@lapercha.com", size: "L", address: "Sarmiento 789, Bahía Blanca", status: "delivered", createdAt: "2026-06-15" },
  { id: "ord4", productTitle: "Vestido lino sage", productImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=133&fit=crop", price: 18900, buyerName: "Lucía Gómez", buyerEmail: "lu@email.com", sellerName: "Laura M.", sellerEmail: "laura@email.com", size: "S", address: "Brown 234, Bahía Blanca", status: "pending_shipment", createdAt: "2026-06-22" },
  { id: "ord5", productTitle: "Jean mom fit talle 26", productImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100&h=133&fit=crop", price: 15300, buyerName: "Martina Pérez", buyerEmail: "martina@email.com", sellerName: "Carla G.", sellerEmail: "carla@email.com", size: "26", address: "Estomba 890, Bahía Blanca", status: "pending_shipment", createdAt: "2026-06-22" },
]

const MOCK_CATEGORIES: AdminCategory[] = [
  { id: "mujer", nombre: "Mujer", subcategorias: [
    { id: "sub-m-ro", categoriaId: "mujer", nombre: "Ropa" },
    { id: "sub-m-ca", categoriaId: "mujer", nombre: "Calzado" },
    { id: "sub-m-ac", categoriaId: "mujer", nombre: "Accesorios" },
    { id: "sub-m-be", categoriaId: "mujer", nombre: "Belleza" },
  ]},
  { id: "hombre", nombre: "Hombre", subcategorias: [
    { id: "sub-h-ro", categoriaId: "hombre", nombre: "Ropa" },
    { id: "sub-h-ca", categoriaId: "hombre", nombre: "Calzado" },
    { id: "sub-h-ac", categoriaId: "hombre", nombre: "Accesorios" },
  ]},
  { id: "kids", nombre: "Kids", subcategorias: [
    { id: "sub-k-be", categoriaId: "kids", nombre: "Bebés" },
    { id: "sub-k-ni", categoriaId: "kids", nombre: "Niñas" },
    { id: "sub-k-no", categoriaId: "kids", nombre: "Niños" },
  ]},
  { id: "tienda", nombre: "Tienda Percha", subcategorias: [
    { id: "sub-t-re", categoriaId: "tienda", nombre: "Regalería" },
    { id: "sub-t-ba", categoriaId: "tienda", nombre: "Bazar" },
    { id: "sub-t-de", categoriaId: "tienda", nombre: "Decoración" },
  ]},
]

const MOCK_FAQ: FAQItem[] = [
  { id: "f1", pregunta: "¿Cómo comprar en La Percha?", respuesta: "Explorá los productos desde la sección Inicio, filtrá por categoría, talle o condición. Cuando encuentres algo que te guste, agregalo al carrito y seguí los pasos del checkout. Podés pagar con Mercado Pago o transferencia bancaria." },
  { id: "f2", pregunta: "¿Cómo vender mi ropa?", respuesta: "Andá a la sección Vender, completá el formulario con los datos de tu prenda, subí fotos, elegí el precio y publicala. Cuando alguien compre, coordinás el envío. Vos te quedás con el 80% de cada venta." },
  { id: "f3", pregunta: "¿Cuánto cuesta vender?", respuesta: "La comisión de La Percha es del 20% sobre el precio de venta. Si vendés una prenda a $10.000, recibís $8.000. No hay costos de publicación ni mensualidades." },
  { id: "f4", pregunta: "¿Cómo funciona el envío?", respuesta: "Cuando se concreta una venta, la vendedora coordina el envío con la compradora. Podés ofrecer envío gratis para destacar tus productos. Los envíos se acuerdan entre las partes." },
  { id: "f5", pregunta: "¿Cómo me registro como vendedora?", respuesta: "Creá tu cuenta en La Percha, completá tus datos de vendedora (CBU para cobrar) y empezá a publicar. Tu solicitud será revisada por nuestro equipo antes de activar tu perfil de venta." },
  { id: "f6", pregunta: "¿Puedo devolver un producto?", respuesta: "Las devoluciones se acuerdan directamente con la vendedora. Te recomendamos revisar bien las fotos y la descripción antes de comprar. Si tenés algún problema, contactanos por WhatsApp." },
  { id: "f7", pregunta: "¿Qué estado pueden tener las prendas?", respuesta: "Las prendas pueden ser Nuevas con etiqueta, Nuevas (sin etiqueta), Como nuevas (usadas una o dos veces) o Usadas. La vendedora debe indicar el estado real y cualquier detalle en la descripción." },
]

const MOCK_TERMS = `Términos y Condiciones para Vendedoras

1. PRODUCTOS PERMITIDOS: Solo se permite la venta de ropa, calzado, accesorios, artículos de bazar, regalería y decoración en buen estado. No se permite la venta de productos ilegales, falsificados o que infrinjan derechos de autor.

2. ESTADO DE LOS PRODUCTOS: La vendedora se compromete a describir con honestidad el estado real de cada prenda, incluyendo cualquier defecto, mancha o rotura. Las fotos deben ser reales y actuales del producto.

3. COMISIÓN: La Percha Showroom retiene el 20% del precio de venta como comisión por el uso de la plataforma. El 80% restante se transfiere a la vendedora una vez confirmada la entrega.

4. ENVÍOS: La vendedora es responsable de coordinar y enviar los productos dentro de las 48hs hábiles posteriores a la confirmación de compra.

5. PAGOS: Los pagos a vendedoras se realizan por transferencia bancaria al CBU registrado, dentro de los 7 días hábiles posteriores a la confirmación de entrega.

6. CONDUCTA: No se tolera el acoso, lenguaje ofensivo ni ninguna forma de discriminación. La Percha se reserva el derecho de suspender cuentas que violen estas normas.

7. PRIVACIDAD: Los datos personales son tratados conforme a la Ley de Protección de Datos Personales. No compartimos información con terceros sin consentimiento.`

export const useAdminStore = create<AdminState>((set) => ({
  products: MOCK_PRODUCTS,
  vendors: MOCK_VENDORS,
  orders: MOCK_ORDERS,
  categories: MOCK_CATEGORIES,
  faq: MOCK_FAQ,
  terms: MOCK_TERMS,

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
      prevPrice: form.prevPrice,
      description: form.description,
      brand: form.brand,
      image: form.images[0] || "",
      images: form.images,
      seller: "Tienda Oficial",
      sellerType: "oficial",
      category: form.category,
      subcategory: form.subcategory,
      condition: form.condition,
      sizes: form.sizes,
      colors: form.colors,
      free_shipping: form.free_shipping,
      destacado: form.destacado,
      productType: form.productType,
      status: "approved" as const,
      createdAt: new Date().toISOString().slice(0, 10),
    }]
  })),

  updateStoreProduct: (id, form) => set((s) => ({
    products: s.products.map(p => p.id === id ? {
      ...p,
      title: form.title ?? p.title,
      price: form.price ?? p.price,
      prevPrice: form.prevPrice ?? p.prevPrice,
      description: form.description ?? p.description,
      brand: form.brand ?? p.brand,
      image: form.images?.[0] ?? p.image,
      images: form.images ?? p.images,
      category: form.category ?? p.category,
      subcategory: form.subcategory ?? p.subcategory,
      condition: form.condition ?? p.condition,
      sizes: form.sizes ?? p.sizes,
      colors: form.colors ?? p.colors,
      free_shipping: form.free_shipping ?? p.free_shipping,
      destacado: form.destacado ?? p.destacado,
      productType: form.productType ?? p.productType,
    } : p)
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

  addSubcategory: (categoriaId, nombre) => set((s) => ({
    categories: s.categories.map(c => c.id === categoriaId ? {
      ...c, subcategorias: [...c.subcategorias, { id: `sub-${Date.now()}`, categoriaId, nombre }]
    } : c)
  })),
  renameSubcategory: (categoriaId, subId, nombre) => set((s) => ({
    categories: s.categories.map(c => c.id === categoriaId ? {
      ...c, subcategorias: c.subcategorias.map(su => su.id === subId ? { ...su, nombre } : su)
    } : c)
  })),
  deleteSubcategory: (categoriaId, subId) => set((s) => ({
    categories: s.categories.map(c => c.id === categoriaId ? {
      ...c, subcategorias: c.subcategorias.filter(su => su.id !== subId)
    } : c),
    products: s.products.map(p => p.subcategory === s.categories.find(c => c.id === categoriaId)?.subcategorias.find(su => su.id === subId)?.nombre ? { ...p, subcategory: undefined } : p)
  })),
  renameCategory: (catId, nombre) => set((s) => ({
    categories: s.categories.map(c => c.id === catId ? { ...c, nombre } : c)
  })),
  updateFAQ: (items) => set({ faq: items }),
  updateTerms: (text) => set({ terms: text }),
  addFAQ: (pregunta, respuesta) => set((s) => ({
    faq: [...s.faq, { id: `f-${Date.now()}`, pregunta, respuesta }]
  })),
  deleteFAQ: (id) => set((s) => ({
    faq: s.faq.filter(f => f.id !== id)
  })),
}))
