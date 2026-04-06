---
name: conventions
description: Convenciones de código, naming y TypeScript para el proyecto de facturación. Leer antes de generar cualquier código para asegurar consistencia en naming, estructura de respuestas API, TypeScript strict y reglas de seguridad del proyecto.
---

## TypeScript

- **Strict mode activado**: `"strict": true` en `tsconfig.json`
- **Nunca usar `any`**: tipar explícitamente siempre
- **Interfaces**: prefijo `I` — `IFactura`, `IReceptor`
- **Types**: PascalCase — `FacturaStatus`, `MetodoPago`
- **Enums como const objects**:

```typescript
export const METODO_PAGO = {
  PUE: 'PUE',
  PPD: 'PPD',
} as const
export type MetodoPago = typeof METODO_PAGO[keyof typeof METODO_PAGO]
```

---

## Naming general

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Componentes React | PascalCase | `FacturaTable`, `EmisorCard` |
| Hooks | camelCase con `use` | `useFacturas`, `useReceptor` |
| Constantes | UPPER_SNAKE_CASE | `MAX_EMISORES`, `DEFAULT_IVA` |
| Funciones utilitarias | camelCase | `formatMonto`, `parseCFDI` |
| Archivos de componente | kebab-case | `factura-table.tsx` |
| API Routes | kebab-case | `/api/v1/facturas/[id]/reenviar` |
| Comentarios | En español | `// Recupera la API Key del RFC emisor` |

---

## Estructura de API Routes (Next.js)

Base: `/api/`

```
/api/empresas                          GET (listado)
/api/empresas/[id]                     GET (detalle + series)
/api/empresas/[id]/series              GET (series de la empresa)
/api/empresas/[id]/series/sync         POST (sync desde factura.com)
/api/empresas/[id]/receptores/sync     POST (sync desde factura.com)
/api/receptores                        GET (listado con filtros)
/api/facturas                          GET (listado) | POST (timbrar CFDI)
/api/facturas/[id]                     GET (detalle + conceptos + pagos)
/api/facturas/[id]/pdf                 GET (descargar PDF)
/api/facturas/[id]/xml                 GET (descargar XML)
```

Helper compartido en `lib/api/helpers.ts`: `requireAuth()`, `apiSuccess()`, `apiError()`, `getFacturaComCredentials()`.

---

## Formato estándar de respuestas API

### Éxito
```typescript
return NextResponse.json({
  success: true,
  data: { ... },
  meta: { total: 100, page: 1 }  // solo en listados
})
```

### Error
```typescript
return NextResponse.json({
  success: false,
  error: {
    code: 'RECEPTOR_NOT_FOUND',
    message: 'No se encontró el receptor con RFC proporcionado'
  }
}, { status: 404 })
```

### Códigos de error del proyecto

```typescript
export const ERROR_CODES = {
  // Genéricos
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  // Facturación
  RECEPTOR_NOT_FOUND: 'RECEPTOR_NOT_FOUND',
  EMISOR_NOT_FOUND: 'EMISOR_NOT_FOUND',
  CONCEPTO_NOT_FOUND: 'CONCEPTO_NOT_FOUND',
  TIMBRADO_ERROR: 'TIMBRADO_ERROR',
  FOLIO_INSUFICIENTE: 'FOLIO_INSUFICIENTE',
  CFDI_INVALIDO: 'CFDI_INVALIDO',
  // Storage
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  // Claude
  EXTRACTION_ERROR: 'EXTRACTION_ERROR',
} as const
```

---

## Variables de entorno

- **Nunca hardcodear** claves, URLs o tokens en el código
- Usar `.env.local` para desarrollo (en `.gitignore`)
- Usar `.env.example` (sin valores reales) en el repo
- **Nunca usar `NEXT_PUBLIC_`** para claves sensibles (service role, API Keys)
- Las API Keys de factura.com van en Supabase DB, no en `.env`

---

## Prohibiciones

```typescript
// ❌ NUNCA
const data: any = await fetch(...)
const API_KEY = "sk-abc123..."
console.log("Debug:", data)  // en producción
<button onClick={() => { fetch(...) }}>  // lógica en componente

// ✅ SIEMPRE
const data: IFactura = await fetch(...)
const apiKey = process.env.ANTHROPIC_API_KEY!
// (sin console.log en producción — usar logger si se necesita)
// Lógica de negocio en /lib o API Routes, no en componentes
```

---

## Estrategia de branches

```
main          ← producción (protegida, solo PRs desde dev)
  └── dev     ← desarrollo activo (aquí se mergean features)
       ├── feat/orden-XX-descripcion
       └── fix/descripcion
```

| Branch | Uso |
|--------|-----|
| `main` | Producción — protegida, solo recibe PRs desde `dev` |
| `dev` | Desarrollo activo — Claude Code mergea features aquí directamente |
| `feat/*` | Features individuales — se crean desde `dev`, se mergean a `dev` |
| `fix/*` | Correcciones — se crean desde `dev`, se mergean a `dev` |

**Flujo diario (Claude Code):**
1. Crear rama `feat/*` o `fix/*` desde `dev`
2. Implementar, verificar build, mergear a `dev`
3. Al cerrar fase o bloque estable → PR `dev → main`

**Reglas:**
- Nunca push directo a `main` (protegida con branch rules)
- `dev` es la rama base de trabajo, no `main`
- Nombres de rama: `feat/orden-25-api-routes`, `fix/zod-v4-compat`

---

## Checklist antes de hacer commit

- [ ] No hay `any` en TypeScript
- [ ] No hay `console.log` sin comentario de debug
- [ ] No hay keys hardcodeadas
- [ ] Las API Routes tienen validación Zod en el input
- [ ] Los comentarios están en español
- [ ] El código sigue la estructura de carpetas definida
