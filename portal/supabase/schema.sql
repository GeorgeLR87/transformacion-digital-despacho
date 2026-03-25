-- ============================================================
-- Schema — Módulo de Facturación
-- ASC Auditores y Consultores Empresarial
-- Todas las tablas llevan prefijo billing_
-- ============================================================

-- Extensión para UUIDs v7 (time-ordered) en tablas transaccionales
-- Evita fragmentación de índice B-tree en inserts de alto volumen
CREATE EXTENSION IF NOT EXISTS pg_uuidv7;

-- ============================================================
-- Función compartida para actualizar updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- billing_empresas_emisoras
-- Una fila por cada RFC que el despacho maneja como emisor
-- api_key movida a billing_empresas_api_keys (acceso restringido)
-- ============================================================
CREATE TABLE billing_empresas_emisoras (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- catálogo estático: UUIDv4 OK
  rfc            TEXT NOT NULL UNIQUE,
  razon_social   TEXT NOT NULL,
  regimen_fiscal TEXT NOT NULL,          -- clave SAT ej: "601"
  cp_fiscal      TEXT NOT NULL,
  activo         BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_billing_empresas_updated_at
  BEFORE UPDATE ON billing_empresas_emisoras
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- billing_empresas_api_keys
-- API Keys de factura.com separadas en tabla propia.
-- Sin política RLS para authenticated → solo service_role accede
-- (N8N y Edge Functions usan service_role; el dashboard no necesita esta key)
-- ============================================================
CREATE TABLE billing_empresas_api_keys (
  empresa_id UUID PRIMARY KEY REFERENCES billing_empresas_emisoras(id) ON DELETE CASCADE,
  api_key    TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_billing_api_keys_updated_at
  BEFORE UPDATE ON billing_empresas_api_keys
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- billing_series_emisoras
-- Cada RFC puede tener múltiples series (A, B, FAC, etc.)
-- uid_facturacom: ID de la serie en factura.com para vincular al timbrar
-- ============================================================
CREATE TABLE billing_series_emisoras (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- catálogo estático: UUIDv4 OK
  empresa_id     UUID NOT NULL REFERENCES billing_empresas_emisoras(id),
  serie          TEXT NOT NULL,           -- ej: "A", "FAC", "B"
  descripcion    TEXT,
  es_default     BOOLEAN NOT NULL DEFAULT false,
  activa         BOOLEAN NOT NULL DEFAULT true,
  uid_facturacom BIGINT,                  -- ID de serie en factura.com (BIGINT por seguridad)
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, serie)
);

-- Solo puede haber una serie default por empresa
CREATE UNIQUE INDEX idx_series_default_unique
  ON billing_series_emisoras(empresa_id)
  WHERE es_default = true;

-- ============================================================
-- billing_receptores
-- Catálogo de clientes frecuentes con datos fiscales
-- ============================================================
CREATE TABLE billing_receptores (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- catálogo: UUIDv4 OK
  rfc            TEXT NOT NULL UNIQUE,
  razon_social   TEXT NOT NULL,
  email          TEXT NOT NULL,
  regimen_fiscal TEXT NOT NULL,          -- clave SAT
  uso_cfdi       TEXT NOT NULL DEFAULT 'G03', -- clave SAT default
  cp_fiscal      TEXT NOT NULL,
  activo         BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_billing_receptores_updated_at
  BEFORE UPDATE ON billing_receptores
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- billing_conceptos
-- Catálogo de servicios/productos por empresa emisora
-- ============================================================
CREATE TABLE billing_conceptos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- catálogo: UUIDv4 OK
  empresa_id      UUID NOT NULL REFERENCES billing_empresas_emisoras(id),
  sku             TEXT NOT NULL,
  descripcion     TEXT NOT NULL,
  clave_prod_serv TEXT NOT NULL,          -- clave SAT del catálogo
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
-- UUIDv7: time-ordered → inserts secuenciales, sin fragmentación de índice
-- ============================================================
CREATE TABLE billing_facturas (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  uuid_sat         TEXT UNIQUE,            -- UUID del SAT, null hasta timbrar
  folio            TEXT,                   -- asignado por factura.com
  serie            TEXT NOT NULL,          -- valor inmutable embebido en el CFDI
  serie_id         UUID REFERENCES billing_series_emisoras(id), -- FK de validación al crear
  empresa_id       UUID NOT NULL REFERENCES billing_empresas_emisoras(id),
  receptor_id      UUID NOT NULL REFERENCES billing_receptores(id),
  fecha_emision    TIMESTAMPTZ NOT NULL DEFAULT now(),
  subtotal         NUMERIC(12,2) NOT NULL,
  iva              NUMERIC(12,2) NOT NULL,
  total            NUMERIC(12,2) NOT NULL,
  metodo_pago      TEXT NOT NULL CHECK (metodo_pago IN ('PUE', 'PPD')),
  forma_pago       TEXT NOT NULL,          -- clave SAT ej: "03" (transferencia)
  moneda           TEXT NOT NULL DEFAULT 'MXN' CHECK (moneda ~ '^[A-Z]{3}$'),
  tipo_cambio      NUMERIC(10,4) DEFAULT 1.0,
  status           TEXT NOT NULL DEFAULT 'borrador'
                     CHECK (status IN ('borrador', 'pendiente_confirmacion', 'timbrada', 'cancelada', 'error')),
  url_xml          TEXT,                   -- Supabase Storage path
  url_pdf          TEXT,                   -- Supabase Storage path
  notas_internas   TEXT,
  telegram_chat_id TEXT,                   -- para notificar de vuelta
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- total debe ser consistente con subtotal + iva (tolerancia de 1 centavo por redondeo)
  CONSTRAINT billing_facturas_total_check CHECK (ABS(total - (subtotal + iva)) < 0.01),
  -- serie_id debe estar poblado en cualquier estado distinto de borrador
  CONSTRAINT billing_facturas_serie_id_check CHECK (status = 'borrador' OR serie_id IS NOT NULL)
);

CREATE TRIGGER trg_billing_facturas_updated_at
  BEFORE UPDATE ON billing_facturas
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- billing_conceptos_factura
-- Detalle de líneas por factura
-- importe e importe_iva son columnas generadas para garantizar consistencia
-- UUIDv7: tabla de mayor volumen de inserts del módulo
-- ============================================================
CREATE TABLE billing_conceptos_factura (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  factura_id      UUID NOT NULL REFERENCES billing_facturas(id) ON DELETE CASCADE,
  concepto_id     UUID REFERENCES billing_conceptos(id), -- null si es concepto libre
  descripcion     TEXT NOT NULL,
  clave_prod_serv TEXT NOT NULL,
  clave_unidad    TEXT NOT NULL DEFAULT 'ACT',
  cantidad        NUMERIC(10,4) NOT NULL DEFAULT 1,
  precio_unitario NUMERIC(12,2) NOT NULL,
  tasa_iva        NUMERIC(5,4) NOT NULL DEFAULT 0.16,
  -- calculados automáticamente — no pueden insertarse manualmente
  importe         NUMERIC(12,2) GENERATED ALWAYS AS (ROUND(cantidad * precio_unitario, 2)) STORED,
  importe_iva     NUMERIC(12,2) GENERATED ALWAYS AS (ROUND(cantidad * precio_unitario * tasa_iva, 2)) STORED,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- billing_pagos
-- Complementos de pago (REP) vinculados a facturas PPD
-- UUIDv7: tabla transaccional — inserts frecuentes en ciclo de vida PPD
-- ============================================================
CREATE TABLE billing_pagos (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  factura_id      UUID NOT NULL REFERENCES billing_facturas(id),
  uuid_sat_rep    TEXT UNIQUE,            -- UUID del REP timbrado
  fecha_pago      DATE NOT NULL,
  monto           NUMERIC(12,2) NOT NULL,
  forma_pago      TEXT NOT NULL,          -- clave SAT
  num_parcialidad INT NOT NULL DEFAULT 1 CHECK (num_parcialidad >= 1),
  saldo_anterior  NUMERIC(12,2) NOT NULL,
  saldo_insoluto  NUMERIC(12,2) NOT NULL,
  referencia      TEXT,                   -- referencia bancaria
  url_xml_rep     TEXT,                   -- Supabase Storage path
  url_pdf_rep     TEXT,                   -- Supabase Storage path
  status          TEXT NOT NULL DEFAULT 'pendiente'
                    CHECK (status IN ('pendiente', 'timbrado', 'error')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Índices
-- ============================================================

-- billing_series_emisoras
CREATE INDEX idx_series_empresa ON billing_series_emisoras(empresa_id);

-- billing_conceptos
CREATE INDEX idx_conceptos_empresa ON billing_conceptos(empresa_id);

-- billing_facturas: covering index para listado del dashboard
-- INCLUDE evita heap fetch para las columnas proyectadas en la tabla principal
CREATE INDEX idx_facturas_status_fecha ON billing_facturas(status, fecha_emision DESC)
  INCLUDE (empresa_id, receptor_id, folio, total, metodo_pago);

-- Partial index para facturas activas — excluye borradores y canceladas
CREATE INDEX idx_facturas_activas ON billing_facturas(empresa_id, fecha_emision DESC)
  WHERE status IN ('timbrada', 'pendiente_confirmacion');

CREATE INDEX idx_facturas_empresa  ON billing_facturas(empresa_id);
CREATE INDEX idx_facturas_receptor ON billing_facturas(receptor_id);

-- billing_conceptos_factura
CREATE INDEX idx_conceptos_factura_factura  ON billing_conceptos_factura(factura_id);
CREATE INDEX idx_conceptos_factura_concepto ON billing_conceptos_factura(concepto_id)
  WHERE concepto_id IS NOT NULL;

-- billing_pagos
CREATE INDEX idx_pagos_factura ON billing_pagos(factura_id);

-- ============================================================
-- Row Level Security
-- ============================================================

-- Tablas del módulo: solo usuarios autenticados del despacho
ALTER TABLE billing_empresas_emisoras   ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_empresas_emisoras   FORCE ROW LEVEL SECURITY;
ALTER TABLE billing_series_emisoras     ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_series_emisoras     FORCE ROW LEVEL SECURITY;
ALTER TABLE billing_receptores          ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_receptores          FORCE ROW LEVEL SECURITY;
ALTER TABLE billing_conceptos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_conceptos           FORCE ROW LEVEL SECURITY;
ALTER TABLE billing_facturas            ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_facturas            FORCE ROW LEVEL SECURITY;
ALTER TABLE billing_conceptos_factura   ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_conceptos_factura   FORCE ROW LEVEL SECURITY;
ALTER TABLE billing_pagos               ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_pagos               FORCE ROW LEVEL SECURITY;

-- billing_empresas_api_keys: habilitado pero SIN política para authenticated
-- → solo service_role puede leer/escribir (N8N, Edge Functions)
ALTER TABLE billing_empresas_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_empresas_api_keys FORCE ROW LEVEL SECURITY;

-- Políticas: equipo interno autenticado tiene acceso completo a todas las tablas
-- (sin distinción por empresa_id — el despacho opera todas las empresas)
CREATE POLICY billing_authenticated_empresas
  ON billing_empresas_emisoras FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY billing_authenticated_series
  ON billing_series_emisoras FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY billing_authenticated_receptores
  ON billing_receptores FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY billing_authenticated_conceptos
  ON billing_conceptos FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY billing_authenticated_facturas
  ON billing_facturas FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY billing_authenticated_conceptos_factura
  ON billing_conceptos_factura FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY billing_authenticated_pagos
  ON billing_pagos FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
