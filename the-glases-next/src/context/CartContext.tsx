'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from '@/types'

type CartItem = Product & { quantity: number }

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart)
          if (Array.isArray(parsed)) {
            setItems(parsed)
          }
        } catch (e) {
          console.error('Failed to parse cart', e)
        }
      }
    }
    loadCart()
  }, [])

  // Save cart to localStorage on changes
  useEffect(() => {
    // Only save if items is not empty OR if it has been initialized
    // In a real app we might want a 'hasLoaded' state but this is a common pattern
    if (items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items])

  const addItem = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
