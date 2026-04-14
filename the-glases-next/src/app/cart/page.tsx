'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <ShoppingCart className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 max-w-sm mb-10 leading-relaxed text-lg">
          Looks like you haven&apos;t added anything to your cart yet. 
          Discover our latest eyewear collection and find your perfect pair!
        </p>
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 px-10 py-5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all text-lg shadow-xl active:scale-95 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 flex items-center justify-between">
            Your Cart
            <span className="text-lg font-medium text-gray-400 bg-gray-100 px-4 py-2 rounded-xl">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative w-32 h-32 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden shadow-inner group">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 font-medium uppercase tracking-wider">
                      {item.category || 'Eyewear'}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <div className="inline-flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-3 hover:bg-white hover:text-black rounded-lg transition-all active:scale-90 text-gray-400"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-black text-lg text-black">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-3 hover:bg-white hover:text-black rounded-lg transition-all active:scale-90 text-gray-400"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center sm:text-right flex-shrink-0">
                    <p className="text-2xl font-black text-black">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400 font-medium mt-1">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
              
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors px-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Add more items
              </Link>
            </div>

            {/* Order Summary Summary */}
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-xl sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 mb-8 border-b pb-6">Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-emerald-500 font-bold">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Estimated Tax</span>
                  <span className="text-gray-900 font-bold">$0.00</span>
                </div>
                <div className="border-t border-gray-50 pt-6 flex justify-between items-center">
                  <span className="text-xl font-black text-gray-900">Total</span>
                  <span className="text-3xl font-black text-black">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-3 py-6 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition-all text-xl shadow-2xl shadow-black/20 hover:shadow-none active:scale-95 group overflow-hidden relative"
              >
                <span className="relative z-10 transition-transform group-hover:translate-x-[-10px]">
                  Go to Checkout
                </span>
                <ArrowRight className="w-6 h-6 relative z-10 opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>

              <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500 cursor-help">
                {/* Credit card icons or branding could go here */}
                <div className="w-10 h-6 bg-gray-200 rounded" />
                <div className="w-10 h-6 bg-gray-200 rounded" />
                <div className="w-10 h-6 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
