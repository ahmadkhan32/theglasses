'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

const SignupPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/confirm` : '',
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-8">
            We&apos;ve sent a verification link to <span className="font-semibold text-gray-900">{email}</span>. 
            Please click the link to activate your account.
          </p>
          <Link 
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-all w-full"
          >
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join <span className="font-bold text-black uppercase">The Glasses</span> today
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent sm:text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent sm:text-sm transition-all"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign Up 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-black hover:underline underline-offset-4">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
