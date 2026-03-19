# Skill: Convenciones de Código y Naming
# Leer antes de generar cualquier código del proyecto

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

Base: `/api/v1/`

```
/api/v1/facturas              GET (listado) | POST (crear)
/api/v1/facturas/[id]         GET (detalle)
/api/v1/facturas/[id]/reenviar POST (reenviar correo)
/api/v1/emisores              GET | POST
/api/v1/receptores            GET | POST
/api/v1/conceptos             GET | POST
/api/v1/fiscal/extract        POST (extraer datos de PDF constancia)
/api/v1/pagos                 GET | POST (complementos de pago)
```

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

| Branch | Uso |
|--------|-----|
| `main` | Producción — protegido, requiere PR |
| `staging` | Pre-producción — pruebas antes de merge |
| `develop` | Base de trabajo diario |
| `feature/nombre` | Desde develop |
| `fix/nombre` | Desde develop o main |

---

## Checklist antes de hacer commit

- [ ] No hay `any` en TypeScript
- [ ] No hay `console.log` sin comentario de debug
- [ ] No hay keys hardcodeadas
- [ ] Las API Routes tienen validación Zod en el input
- [ ] Los comentarios están en español
- [ ] El código sigue la estructura de carpetas definida
