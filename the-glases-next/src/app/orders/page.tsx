'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Order, OrderItem } from '@/types'
import { Loader2, Package, Calendar, Clock, MapPin, ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

type OrderWithItems = Order & {
  order_items: (OrderItem & {
    products: {
      name: string
      image_url: string
      price: number
    }
  })[]
}

const OrdersPage = () => {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/orders')
      return
    }

    const fetchOrders = async () => {
      if (!user) return
      
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              image_url,
              price
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
      } else if (data) {
        setOrders(data as OrderWithItems[])
      }
      setLoading(false)
    }

    if (user) {
      fetchOrders()
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-gray-300" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <Package className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">No orders yet</h2>
        <p className="text-gray-500 max-w-sm mb-10 leading-relaxed text-lg">
          You haven&apos;t placed any orders yet. Start shopping and find your perfect pair of glasses today!
        </p>
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 px-10 py-5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all text-lg shadow-xl"
        >
          Explore Collection
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Order History</h1>
            <p className="text-gray-500 font-medium">Track and manage your past purchases.</p>
          </div>
          <Link 
            href="/products"
            className="text-sm font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
        </div>

        <div className="space-y-8">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              {/* Order Header */}
              <div className="bg-gray-50/50 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-8">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-bold">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-gray-900 font-extrabold text-lg">${order.total_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order #</p>
                    <p className="text-gray-500 font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <div>
                  <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 sm:p-8 space-y-6">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden shadow-inner group-hover:scale-105 transition-transform font-sans">
                      <Image 
                        src={item.products.image_url} 
                        alt={item.products.name} 
                        fill
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-gray-900 truncate mb-1 uppercase text-sm tracking-widest leading-none">
                        {item.products.name}
                      </h4>
                      <p className="text-gray-400 text-sm font-medium mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Quantity: {item.quantity}
                      </p>
                      <Link 
                        href={`/products?id=${item.product_id}`}
                        className="inline-flex items-center gap-2 text-xs font-extra-bold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4"
                      >
                        Buy it again
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-black text-black">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="px-6 sm:px-8 py-6 bg-gray-50/30 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-gray-500">
                  <MapPin className="w-5 h-5 text-gray-300" />
                  <p className="text-sm font-medium italic line-clamp-1 max-w-md">
                    {order.shipping_address || 'Standard Shipping'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-white text-gray-900 text-xs font-black rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                    Track Package
                  </button>
                  <button className="px-6 py-3 bg-white text-gray-900 text-xs font-black rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                    Write Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
