'use client'

import React from 'react'
import Image from 'next/image'
import { Plus, Eye } from 'lucide-react'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
        
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
          <button 
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-black text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            Add to Cart
          </button>
          <button className="p-3 bg-white text-black rounded-xl border border-gray-200 active:scale-95 transition-transform shadow-sm">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <span className="text-lg font-extrabold text-black">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold text-gray-600 rounded uppercase tracking-wider">
            {product.category || 'Premium'}
          </span>
          {product.stock && product.stock < 10 && (
            <span className="text-[10px] font-bold text-red-500 uppercase">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
