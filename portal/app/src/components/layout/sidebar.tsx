'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import {
  LayoutDashboard,
  FileText,
  Building2,
  Users,
  Package,
  CreditCard,
  LogOut,
} from 'lucide-react'

interface INavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: INavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/facturas', label: 'Facturas', icon: FileText },
  { href: '/emisores', label: 'Emisores', icon: Building2 },
  { href: '/receptores', label: 'Receptores', icon: Users },
  { href: '/conceptos', label: 'Conceptos', icon: Package },
  { href: '/pagos', label: 'Complementos de pago', icon: CreditCard },
]

interface ISidebarProps {
  userEmail: string
}

export function Sidebar({ userEmail }: ISidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Encabezado */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div>
          <p className="text-sm font-semibold text-gray-900">ASC Facturación</p>
          <p className="text-xs text-gray-500">Portal interno</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            // Para /dashboard solo coincidencia exacta; para el resto también subrutas
            const isActive =
              href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname === href || pathname.startsWith(href + '/')

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Usuario y cierre de sesión */}
      <div className="border-t border-gray-200 p-4">
        <p className="mb-3 truncate text-xs text-gray-500">{userEmail}</p>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  )
}
