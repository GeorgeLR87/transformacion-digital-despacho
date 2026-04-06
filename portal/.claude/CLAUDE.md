# CLAUDE.md — Módulo de Facturación
# transformacion-digital-despacho/facturacion
# ASC Auditores y Consultores Empresarial
# Actualizado: 2026-03

---

## Contexto del proyecto

Sistema de automatización para generación, timbrado y gestión de facturas electrónicas (CFDI) para un despacho contable que opera como intermediario de **8 empresas emisoras**.

Reemplaza un proceso manual que cuesta $64,800 MXN/año por uno automatizado a $8,443 MXN/año → **ahorro de $56,357 MXN anuales**.

El equipo del despacho opera el sistema completamente desde **Telegram** en lenguaje natural. El administrador tiene visibilidad total desde un **Dashboard Next.js**.

---

## Idioma
Responde siempre en español, independientemente del idioma del código o los comentarios.

## Stack tecnológico

| Capa | Herramienta | Rol |
|------|-------------|-----|
| Entrada | Telegram Bot API | Interfaz de usuario para el equipo del despacho |
| Orquestación | N8N self-hosted (Railway) | Coordinador de todos los flujos automatizados |
| Inteligencia | Claude API (claude-sonnet) | Interpretación NL, extracción de PDFs, validación CFDI |
| Base de datos | Supabase (PostgreSQL + Storage + Auth) | Registros, archivos XML/PDF, autenticación dashboard |
| Timbrado | factura.com API | PAC autorizado SAT · $0.47/folio · $199/RFC adicional/año |
| Dashboard | Next.js 14 App Router | Visualización, KPIs, catálogos, administración |
| Validación | Zod | Schemas para todos los inputs de API Routes |
| Estilos | Tailwind CSS + shadcn/ui | UI del dashboard |
| Control versiones | GitHub (este monorepo) | Módulo dentro de /facturacion |
| Deploy frontend | Vercel | Preview por branch, producción en main |

---

## Estructura de carpetas de este módulo

```
facturacion/
├── .claude/
│   ├── CLAUDE.md                  ← este archivo
│   └── skills/
│       ├── architecture.md        ← decisiones y capas del sistema
│       ├── supabase.md            ← schema, queries, RLS, Storage
│       ├── api-facturacom.md      ← endpoints, autenticación, flujos
│       ├── n8n-workflows.md       ← estructura de flujos N8N
│       ├── claude-prompts.md      ← system prompts y patrones de extracción
│       └── conventions.md         ← naming, TypeScript, respuestas API
├── dashboard/                     ← Next.js 14 App Router
│   ├── src/
│   │   ├── app/                   ← rutas, layouts, API Routes
│   │   ├── components/
│   │   │   ├── ui/                ← shadcn/ui (no modificar)
│   │   │   ├── shared/            ← componentes reutilizables propios
│   │   │   └── features/          ← por feature: facturas, emisores, etc.
│   │   ├── lib/
│   │   │   ├── supabase/          ← clientes browser y server
│   │   │   ├── claude/prompts/    ← prompts organizados por caso de uso
│   │   │   └── validations/       ← Zod schemas
│   │   ├── hooks/                 ← custom React hooks
│   │   ├── stores/                ← Zustand stores (si aplica)
│   │   └── types/                 ← types globales + auto-gen Supabase
│   └── docs/
│       ├── architecture.md
│       └── api/                   ← colección Postman
├── n8n-workflows/                 ← exports JSON de flujos N8N
├── supabase/
│   ├── schema.sql                 ← schema completo con prefijo billing_
│   └── seed.sql                   ← datos de prueba
└── agent-prompts/
    └── factura-agent.md           ← system prompt principal de Claude
```

---

## Skills activas — leer antes de ejecutar tareas

Antes de generar código o ejecutar cualquier tarea, lee la skill correspondiente:

- **Arquitectura general** → `.claude/skills/architecture.md`
- **Cualquier tarea con Supabase** (schema, queries, RLS, Storage) → `.claude/skills/supabase.md`
- **Cualquier tarea con factura.com API** → `.claude/skills/api-facturacom.md`
- **Flujos N8N** → `.claude/skills/n8n-workflows.md`
- **Prompts de Claude API** → `.claude/skills/claude-prompts.md`
- **Naming, TypeScript, convenciones** → `.claude/skills/conventions.md`

---

## Reglas globales que aplican a TODO el proyecto

1. **Prefijo de tablas**: todas las tablas de Supabase llevan prefijo `billing_`
2. **TypeScript strict**: nunca usar `any`. Siempre tipar explícitamente.
3. **Variables de entorno**: nunca hardcodear keys. Siempre usar `.env.local`
4. **Comentarios**: en español
5. **Respuestas de API Routes**: siempre usar el formato estándar `{ success, data, meta }` / `{ success, error }`
6. **Una API Key por RFC emisor**: cada empresa tiene su propia API Key de factura.com — nunca mezclarlas
7. **Folios automáticos**: factura.com asigna el folio automáticamente — no intentar asignarlo manualmente
8. **Storage independiente**: siempre descargar XML y PDF de factura.com y subirlos a Supabase Storage para independencia total del PAC

---

## Variables de entorno requeridas

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Claude API
ANTHROPIC_API_KEY=

# factura.com (una por RFC emisor — guardar en Supabase, no en .env)
# Las API Keys de factura.com se almacenan en billing_empresas_emisoras.api_key
# y se recuperan en runtime según el RFC emisor de la factura

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=

# N8N
N8N_WEBHOOK_URL=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Testing

- **Framework**: Vitest 3.x (`npm test`, `npm run test:watch`, `npm run test:coverage`)
- **Ubicación de tests**: `app/src/__tests__/` reflejando la estructura de `src/lib/`
- **Nomenclatura**: `<módulo>.test.ts` — describes y nombres de test en español
- **Estructura**: `describe('Módulo') > describe('función') > it('debería...')`
- **Plan completo**: ver `docs/testing/fase-5-testing.md`
- **Reglas**:
  - Nunca mockear Zod — siempre validar con los schemas reales
  - Mockear factura.com con MSW — nunca consumir folios reales en tests
  - Mockear Supabase manualmente — no depender de conexión a DB
  - Los datetimes en Zod 4 requieren timezone: usar `"2026-03-31T10:00:00Z"` (con `Z`)
  - No testear componentes shadcn/ui ni código trivial (`utils.ts`)

---

## Lo que este módulo NO incluye (por ahora)

- Portal de acceso para clientes del despacho
- Cancelación de facturas (iteración posterior)
- Módulos: clientes, cobranza, RH, chatbot fiscal (módulos separados del portal)

---

## Contexto del negocio

- **Despacho**: ASC Auditores y Consultores Empresarial · Toluca, Estado de México
- **Operadores del bot**: equipo interno del despacho (no clientes)
- **8 empresas emisoras**: cada una con su propio RFC, serie de facturación y API Key de factura.com
- **Flujo principal**: Telegram → N8N → Claude API → previa → confirmación → timbrado → correo al receptor → registro en Supabase
