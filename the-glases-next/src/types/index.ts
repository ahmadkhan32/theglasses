export type Product = {
  id: string
  name: string
  description: string
  price: number
  category?: string
  image_url: string
  stock?: number
  created_at?: string
}

export type Order = {
  id: string
  user_id: string
  total_price: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address?: string
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}
