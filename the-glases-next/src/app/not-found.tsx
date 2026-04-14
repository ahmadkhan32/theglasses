'use client'

import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
        <span className="text-4xl font-black text-gray-300">404</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-gray-500 max-w-sm mb-10 leading-relaxed text-lg font-sans">
        The page you are looking for doesn&apos;t exist or has been moved. 
        Let&apos;s get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all text-lg shadow-xl active:scale-95 group"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all text-lg active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          View Products
        </Link>
      </div>
    </div>
  )
}
