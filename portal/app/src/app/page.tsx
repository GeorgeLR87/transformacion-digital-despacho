import { redirect } from 'next/navigation'

// El middleware redirige según autenticación; aquí forzamos /dashboard como destino
export default function HomePage() {
  redirect('/dashboard')
}
