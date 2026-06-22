import { create } from 'zustand'

export interface VentaRecord {
  id: string
  title: string
  price: number
  date: string
  status: 'pendiente' | 'liberado' | 'retirado'
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  is_seller: boolean
  seller_status: 'none' | 'pending' | 'approved' | 'rejected'
  balance: number
  ventas: VentaRecord[]
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  requestSeller: () => void
  withdraw: (amount: number) => void
  logout: () => void
  isAuthenticated: () => boolean
}

const MOCK_VENTAS_MARIA: VentaRecord[] = [
  { id: 'v1', title: 'Vestido lino sage', price: 24900, date: '18 jun 2026', status: 'liberado' },
  { id: 'v2', title: 'Blazer crema oversize', price: 18900, date: '10 jun 2026', status: 'retirado' },
  { id: 'v3', title: 'Jeans straight tiro alto', price: 17800, date: '05 jun 2026', status: 'liberado' },
  { id: 'v4', title: 'Top crochet mint', price: 9800, date: '21 jun 2026', status: 'pendiente' },
]

const MOCK_USERS: Record<string, { name: string; password: string; avatar: string; is_seller: boolean; seller_status: 'none' | 'pending' | 'approved' | 'rejected'; balance: number; ventas: VentaRecord[] }> = {
  'maria@email.com': { name: 'María G.', password: '123456', avatar: 'https://i.pravatar.cc/80?img=47', is_seller: true, seller_status: 'approved', balance: 34160, ventas: MOCK_VENTAS_MARIA },
  'sofia@email.com': { name: 'Sofía R.', password: '123456', avatar: 'https://i.pravatar.cc/80?img=48', is_seller: false, seller_status: 'none', balance: 0, ventas: [] },
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 800))

    const existing = MOCK_USERS[email.toLowerCase()]
    if (!existing) {
      set({ isLoading: false })
      return { ok: false, error: 'No encontramos una cuenta con ese email' }
    }
    if (existing.password !== password) {
      set({ isLoading: false })
      return { ok: false, error: 'Contraseña incorrecta' }
    }

    set({
      user: {
        id: `u_${Date.now()}`,
        name: existing.name,
        email: email.toLowerCase(),
        avatar: existing.avatar,
        is_seller: existing.is_seller,
        seller_status: existing.seller_status,
        balance: existing.balance,
        ventas: existing.ventas,
      },
      isLoading: false,
    })
    return { ok: true }
  },

  register: async (name, email, password) => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 800))

    if (MOCK_USERS[email.toLowerCase()]) {
      set({ isLoading: false })
      return { ok: false, error: 'Ya existe una cuenta con ese email' }
    }
    if (password.length < 6) {
      set({ isLoading: false })
      return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres' }
    }

    set({
      user: {
        id: `u_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        avatar: `https://i.pravatar.cc/80?u=${encodeURIComponent(email)}`,
        is_seller: false,
        seller_status: 'none',
        balance: 0,
        ventas: [],
      },
      isLoading: false,
    })

    // Guardar registro en Supabase para que el admin lo vea
    fetch("/api/registros/crear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase(), name }),
    }).catch(() => {})

    return { ok: true }
  },

  requestSeller: () => set(s => {
    if (!s.user) return s
    return { user: { ...s.user, seller_status: 'pending' } }
  }),

  withdraw: (amount) => set(s => {
    if (!s.user) return s
    return {
      user: {
        ...s.user,
        balance: s.user.balance - amount,
        ventas: s.user.ventas.map(v =>
          v.status === 'liberado' ? { ...v, status: 'retirado' as const } : v
        ),
      },
    }
  }),

  logout: () => set({ user: null }),

  isAuthenticated: () => get().user !== null,
}))
