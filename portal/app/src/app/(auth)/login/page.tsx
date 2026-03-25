'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/lib/actions/auth'

interface ILoginState {
  error?: string
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<ILoginState | null, FormData>(
    login,
    null
  )

  return (
    <div className="w-full max-w-sm">
      {/* Encabezado */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">ASC Facturación</h1>
        <p className="mt-2 text-sm text-gray-500">Ingresa a tu cuenta</p>
      </div>

      {/* Formulario */}
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isPending ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-blue-600 hover:text-blue-500">
          Regístrate
        </Link>
      </p>
    </div>
  )
}
