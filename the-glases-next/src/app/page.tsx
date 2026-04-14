'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-transparent" />
          {/* Background decoration or image can go here */}
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
            EYEWEAR FOR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              TOMORROW
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Discover a curated collection of premium glasses that combine 
            cutting-edge technology with timeless design.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link 
              href="/products"
              className="px-8 py-4 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2 group shadow-lg shadow-white/10"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/auth/signup"
              className="px-8 py-4 bg-white/10 text-white text-sm font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="w-6 h-10 rounded-full border-2 border-white flex justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-black">Curated Collection</h3>
              <p className="text-gray-500 leading-relaxed">
                Hand-picked designs from premium brands across the globe.
              </p>
            </div>
            <div className="space-y-4 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-black">Secure Checkout</h3>
              <p className="text-gray-500 leading-relaxed">
                Advanced encryption and secure payment processing for any order.
              </p>
            </div>
            <div className="space-y-4 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-black">Real-time Updates</h3>
              <p className="text-gray-500 leading-relaxed">
                Track your order status and stock updates in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to Elevate Your Style?</h2>
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all text-lg shadow-2xl shadow-blue-600/30 active:scale-95"
          >
            Explore All Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 text-center text-gray-500 text-sm">
        <p>&copy; 2026 THE GLASSES. All rights reserved.</p>
      </footer>
    </div>
  )
}
