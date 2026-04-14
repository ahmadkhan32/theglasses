'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle2, ArrowRight, CreditCard, Truck, ShieldCheck, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

const CheckoutPage = () => {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [address, setAddress] = useState('')
  const [orderId, setOrderId] = useState<string | null>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [user, authLoading, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push('/products')
    }
  }, [items, success, router])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_price: totalPrice,
        status: 'pending',
        shipping_address: address
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      alert('Failed to place order. Please try again.')
      setLoading(false)
      return
    }

    // 2. Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      alert('Order placed but failed to save items. Please contact support.')
    } else {
      setSuccess(true)
      setOrderId(order.id)
      clearCart()
    }
    
    setLoading(false)
  }

  if (authLoading || (!user && !success)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-gray-300" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-gray-100">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Order Confirmed!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for shopping with THE GLASSES. Your order <span className="font-bold text-black">#{orderId?.slice(0, 8)}</span> has been placed successfully.
          </p>
          <div className="space-y-4">
            <Link 
              href="/orders"
              className="w-full inline-flex items-center justify-center gap-3 py-5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all text-lg shadow-xl"
            >
              View My Orders
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/products"
              className="w-full inline-flex items-center justify-center gap-3 py-5 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all text-lg"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-black text-gray-900 mb-12">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-xl">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2">
                <Truck className="w-6 h-6 text-blue-500" />
                Shipping Details
              </h2>
              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                    Shipping Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
                    <textarea 
                      required
                      placeholder="Enter your full street address, city, state, and zip code..."
                      className="w-full min-h-[160px] pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all bg-gray-50 text-gray-900 leading-relaxed font-medium"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-emerald-500" />
                    Payment Method
                  </h3>
                  <div className="p-6 bg-gray-100 rounded-2xl border-2 border-black flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-900 rounded-lg" />
                      <span className="font-bold text-gray-900">Cash on Delivery</span>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-black" />
                  </div>
                  <p className="mt-4 text-xs text-gray-400 font-medium italic">
                    Card and wallet payments will be available soon.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={loading || !address}
                  className="w-full py-6 mt-8 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition-all text-xl shadow-2xl shadow-black/20 disabled:opacity-50 disabled:shadow-none relative group h-20"
                >
                  {loading ? (
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Place Order
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="font-black text-emerald-900 mb-1 leading-none uppercase text-xs tracking-widest mt-1">
                  Secure Checkout
                </h4>
                <p className="text-emerald-700/70 text-sm leading-relaxed">
                  Your transaction is protected with 256-bit encryption. We prioritize your privacy and data security.
                </p>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-xl">
              <h2 className="text-2xl font-black text-gray-900 mb-8 pb-6 border-b">Order Summary</h2>
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 mb-10 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden shadow-inner font-sans">
                      <Image 
                        src={item.image_url} 
                        alt={item.name} 
                        fill
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate leading-none mb-1 uppercase text-xs tracking-widest">
                        {item.name}
                      </h4>
                      <p className="text-gray-400 text-sm font-medium">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4 border-t pt-8">
                <div className="flex justify-between items-center text-gray-400 font-bold uppercase text-[10px] tracking-[.2em]">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-black">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 font-bold uppercase text-[10px] tracking-[.2em]">
                  <span>Shipping</span>
                  <span className="text-emerald-500 font-black">Free</span>
                </div>
                <div className="flex justify-between items-center pt-6 text-2xl font-black text-black">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
