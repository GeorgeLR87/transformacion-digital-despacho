---
name: supabase
description: Schema completo de Supabase, queries frecuentes, patrones de cliente y reglas de RLS para el módulo de facturación. Leer antes de cualquier tarea relacionada con base de datos, Storage o autenticación en este proyecto.
---

## Regla principal

Todas las tablas de este módulo llevan el prefijo **`billing_`**.
Nunca crear tablas sin este prefijo.

---

## Schema completo

```sql
-- ============================================================
-- billing_empresas_emisoras
-- Una fila por cada RFC que el despacho maneja como emisor
-- ============================================================
CREATE TABLE billing_empresas_emisoras (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfc           TEXT NOT NULL UNIQUE,
  razon_social  TEXT NOT NULL,
  regimen_fiscal TEXT NOT NULL,          -- clave SAT ej: "601"
  cp_fiscal     TEXT NOT NULL,
  api_key       TEXT NOT NULL,           -- API Key de factura.com para este RFC
  activo        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- billing_series_emisoras
-- Cada RFC puede tener múltiples series (A, B, FAC, etc.)
-- ============================================================
CREATE TABLE billing_series_emisoras (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id    UUID NOT NULL REFERENCES billing_empresas_emisoras(id),
  serie         TEXT NOT NULL,           -- ej: "A", "FAC", "B"
  descripcion   TEXT,
  es_default    BOOLEAN NOT NULL DEFAULT false,
  activa        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, serie)
);

-- ============================================================
-- billing_receptores
-- Catálogo de clientes frecuentes con datos fiscales
-- ============================================================
CREATE TABLE billing_receptores (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfc             TEXT NOT NULL UNIQUE,
  razon_social    TEXT NOT NULL,
  email           TEXT NOT NULL,
  regimen_fiscal  TEXT NOT NULL,         -- clave SAT
  uso_cfdi        TEXT NOT NULL DEFAULT 'G03', -- clave SAT default
  cp_fiscal       TEXT NOT NULL,
  activo          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- billing_conceptos
-- Catálogo de servicios/productos por empresa emisora
-- ============================================================
CREATE TABLE billing_conceptos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id      UUID NOT NULL REFERENCES billing_empresas_emisoras(id),
  sku             TEXT NOT NULL,
  descripcion     TEXT NOT NULL,
  clave_prod_serv TEXT NOT NULL,         -- clave SAT del catálogo
  clave_unidad    TEXT NOT NULL DEFAULT 'ACT', -- clave unidad SAT
  precio_unitario NUMERIC(12,2) NOT NULL,
  tasa_iva        NUMERIC(5,4) NOT NULL DEFAULT 0.16,
  activo          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, sku)
);

-- ============================================================
-- billing_facturas
-- Registro principal de cada CFDI timbrado
-- ============================================================
CREATE TABLE billing_facturas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uuid_sat        TEXT UNIQUE,           -- UUID del SAT, null hasta timbrar
  folio           TEXT,                  -- asignado por factura.com
  serie           TEXT NOT NULL,
  empresa_id      UUID NOT NULL REFERENCES billing_empresas_emisoras(id),
  receptor_id     UUID NOT NULL REFERENCES billing_receptores(id),
  fecha_emision   TIMESTAMPTZ NOT NULL DEFAULT now(),
  subtotal        NUMERIC(12,2) NOT NULL,
  iva             NUMERIC(12,2) NOT NULL,
  total           NUMERIC(12,2) NOT NULL,
  metodo_pago     TEXT NOT NULL,         -- "PUE" o "PPD"
  forma_pago      TEXT NOT NULL,         -- clave SAT ej: "03" (transferencia)
  moneda          TEXT NOT NULL DEFAULT 'MXN',
  tipo_cambio     NUMERIC(10,4) DEFAULT 1.0,
  status          TEXT NOT NULL DEFAULT 'borrador',
  -- status: borrador | pendiente_confirmacion | timbrada | cancelada | error
  url_xml         TEXT,                  -- Supabase Storage path
  url_pdf         TEXT,                  -- Supabase Storage path
  notas_internas  TEXT,
  telegram_chat_id TEXT,                 -- para notificar de vuelta
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- billing_conceptos_factura
-- Detalle de líneas por factura
-- ============================================================
CREATE TABLE billing_conceptos_factura (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factura_id      UUID NOT NULL REFERENCES billing_facturas(id) ON DELETE CASCADE,
  concepto_id     UUID REFERENCES billing_conceptos(id), -- null si es concepto libre
  descripcion     TEXT NOT NULL,
  clave_prod_serv TEXT NOT NULL,
  clave_unidad    TEXT NOT NULL DEFAULT 'ACT',
  cantidad        NUMERIC(10,4) NOT NULL DEFAULT 1,
  precio_unitario NUMERIC(12,2) NOT NULL,
  importe         NUMERIC(12,2) NOT NULL,
  tasa_iva        NUMERIC(5,4) NOT NULL DEFAULT 0.16,
  importe_iva     NUMERIC(12,2) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- billing_pagos
-- Complementos de pago (REP) vinculados a facturas PPD
-- ============================================================
CREATE TABLE billing_pagos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factura_id      UUID NOT NULL REFERENCES billing_facturas(id),
  uuid_sat_rep    TEXT UNIQUE,           -- UUID del REP timbrado
  fecha_pago      DATE NOT NULL,
  monto           NUMERIC(12,2) NOT NULL,
  forma_pago      TEXT NOT NULL,         -- clave SAT
  num_parcialidad INT NOT NULL DEFAULT 1,
  saldo_anterior  NUMERIC(12,2) NOT NULL,
  saldo_insoluto  NUMERIC(12,2) NOT NULL,
  referencia      TEXT,                  -- referencia bancaria
  url_xml_rep     TEXT,                  -- Supabase Storage path
  url_pdf_rep     TEXT,                  -- Supabase Storage path
  status          TEXT NOT NULL DEFAULT 'pendiente',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## Índices recomendados

```sql
CREATE INDEX idx_facturas_empresa ON billing_facturas(empresa_id);
CREATE INDEX idx_facturas_receptor ON billing_facturas(receptor_id);
CREATE INDEX idx_facturas_status ON billing_facturas(status);
CREATE INDEX idx_facturas_fecha ON billing_facturas(fecha_emision);
CREATE INDEX idx_conceptos_empresa ON billing_conceptos(empresa_id);
CREATE INDEX idx_pagos_factura ON billing_pagos(factura_id);
```

---

## Supabase Storage — estructura de buckets

```
Bucket: facturas (privado)
├── {año}/
│   └── {mes}/
│       ├── {uuid_sat}.xml
│       └── {uuid_sat}.pdf

Bucket: reps (privado)
├── {año}/
│   └── {mes}/
│       ├── {uuid_sat_rep}.xml
│       └── {uuid_sat_rep}.pdf

Bucket: constancias (privado)
└── {rfc}/
    └── constancia_{timestamp}.pdf
```

---

## Patrones de cliente Supabase en Next.js

### Cliente servidor (API Routes y Server Components)
```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
}

// Para operaciones admin (sin RLS):
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
```

### Cliente browser
```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## Queries frecuentes

### Obtener facturas con datos de emisor y receptor
```typescript
const { data } = await supabase
  .from('billing_facturas')
  .select(`
    *,
    empresa:billing_empresas_emisoras(rfc, razon_social),
    receptor:billing_receptores(rfc, razon_social, email),
    conceptos:billing_conceptos_factura(*)
  `)
  .eq('status', 'timbrada')
  .order('fecha_emision', { ascending: false })
```

### Obtener API Key del RFC emisor (para llamar factura.com)
```typescript
const { data: empresa } = await supabase
  .from('billing_empresas_emisoras')
  .select('api_key, rfc, razon_social')
  .eq('id', empresaId)
  .single()
// IMPORTANTE: api_key nunca debe exponerse al cliente browser
// Solo usar desde Server Components o API Routes con service role
```

### Facturas PPD sin complemento de pago (alerta dashboard)
```typescript
const { data } = await supabase
  .from('billing_facturas')
  .select('*, receptor:billing_receptores(razon_social)')
  .eq('metodo_pago', 'PPD')
  .eq('status', 'timbrada')
  .not('id', 'in', supabase.from('billing_pagos').select('factura_id'))
  .lt('fecha_emision', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
```

---

## Reglas de RLS

- Las tablas con datos sensibles (`billing_empresas_emisoras`) solo son accesibles con service role desde N8N y API Routes — nunca desde el cliente browser.
- El Dashboard usa `anon key` + RLS limitada a usuarios autenticados con rol `admin`.
- N8N usa `service role key` para todas sus operaciones.

---

## Generar tipos TypeScript desde Supabase

```bash
npx supabase gen types typescript --project-id TU_PROJECT_ID > src/types/supabase.ts
```

Ejecutar cada vez que se modifique el schema.
