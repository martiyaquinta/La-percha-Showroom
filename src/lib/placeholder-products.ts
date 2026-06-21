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
