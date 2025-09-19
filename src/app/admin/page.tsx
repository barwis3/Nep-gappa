'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = sessionStorage.getItem('admin_authenticated')
    if (isAuthenticated === 'true') {
      router.push('/admin/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        sessionStorage.setItem('admin_authenticated', 'true')
        router.push('/admin/dashboard')
      } else {
        setError('Nieprawidłowe hasło')
      }
    } catch (error) {
      setError('Błąd połączenia')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🍜 Panel Administratora
          </h1>
          <p className="text-gray-600">Wprowadź hasło administratora</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Hasło
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              placeholder="Wprowadź hasło"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary py-3 disabled:opacity-50"
          >
            {isLoading ? 'Sprawdzanie...' : 'Zaloguj się'}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-brand hover:underline">
            ← Powrót do strony głównej
          </a>
        </div>
      </div>
    </div>
  )
}