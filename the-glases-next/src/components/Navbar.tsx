'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingCart, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'

const Navbar = () => {
  const { user, loading, signOut } = useAuth()
  const { totalItems } = useCart()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
            THE GLASSES
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors">
              My Orders
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          ) : user ? (
            <div className="flex items-center gap-4 border-l pl-4">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.email}
              </span>
              <button 
                onClick={() => signOut()}
                className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                href="/auth/login" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/auth/signup" 
                className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
