import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Bienvenido al sistema de facturación de ASC Auditores
          {user?.email ? `, ${user.email}` : ''}.
        </p>
      </div>

      {/* Placeholder — KPIs se agregan en la siguiente iteración */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(['Facturas emitidas', 'Facturas pendientes', 'Complementos de pago', 'Emisores activos'] as const).map(
          (label) => (
            <div
              key={label}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">—</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
