'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Loader2, Search, Filter } from 'lucide-react'

export const dynamic = 'force-dynamic'

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
      } else if (data) {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b py-12 mb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">Our Collection</h1>
          <p className="text-gray-500 max-w-xl">
            Explore our curated selection of premium eyewear, designed for 
            comfort, durability, and unmatched style.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for styles, colors, or brands..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm">
            <Filter className="w-5 h-5" />
            Sort & Filter
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-gray-300" />
            <p className="text-gray-400 font-medium">Discovering products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addItem} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500 max-w-xs">
              Try adjusting your search or check back later for new arrivals!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
