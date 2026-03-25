-- ============================================================
-- Migration: schema v1 → v2
-- ASC Auditores y Consultores Empresarial
-- Ejecutar en SQL Editor de Supabase (una sola vez)
-- ============================================================

-- ============================================================
-- 1. billing_empresas_emisoras — agregar columnas CSD
-- ============================================================
ALTER TABLE billing_empresas_emisoras
  ADD COLUMN IF NOT EXISTS csd_numero_certificado TEXT,
  ADD COLUMN IF NOT EXISTS csd_vigencia_inicio    DATE,
  ADD COLUMN IF NOT EXISTS csd_vigencia_fin       DATE;

-- Nota: la columna api_key legacy se deja intacta por ahora.
-- La fuente de verdad es billing_empresas_api_keys.

-- ============================================================
-- 2. billing_facturas — renombrar columnas existentes
-- ============================================================
ALTER TABLE billing_facturas RENAME COLUMN uuid_sat  TO uuid;
ALTER TABLE billing_facturas RENAME COLUMN url_xml   TO xml_storage_path;
ALTER TABLE billing_facturas RENAME COLUMN url_pdf   TO pdf_storage_path;

-- ============================================================
-- 3. billing_facturas — agregar columnas nuevas
-- ============================================================
ALTER TABLE billing_facturas
  ADD COLUMN IF NOT EXISTS uid_facturacom         TEXT,
  ADD COLUMN IF NOT EXISTS serie_id               UUID REFERENCES billing_series_emisoras(id),
  ADD COLUMN IF NOT EXISTS status_pago            TEXT NOT NULL DEFAULT 'no_aplica'
                                                    CHECK (status_pago IN ('no_aplica', 'pendiente', 'parcial', 'pagado')),
  ADD COLUMN IF NOT EXISTS monto_pagado_acumulado NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS saldo_insoluto         NUMERIC(12,2);

-- ============================================================
-- 4. NUEVA tabla: billing_cfdi_eventos
-- Log append-only del ciclo de vida de cada CFDI
-- ============================================================
CREATE TABLE IF NOT EXISTS billing_cfdi_eventos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factura_id       UUID NOT NULL REFERENCES billing_facturas(id) ON DELETE CASCADE,
  evento           TEXT NOT NULL
                     CHECK (evento IN (
                       'creado', 'timbrado', 'enviado',
                       'cancelacion_solicitada', 'cancelado',
                       'pago_registrado', 'error'
                     )),
  descripcion      TEXT,
  payload_response JSONB,                -- respuesta cruda de factura.com (para debugging)
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cfdi_eventos_factura
  ON billing_cfdi_eventos(factura_id);

ALTER TABLE billing_cfdi_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_cfdi_eventos FORCE ROW LEVEL SECURITY;

CREATE POLICY billing_authenticated_cfdi_eventos
  ON billing_cfdi_eventos FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- 5. NUEVA tabla: billing_catalogo_sat
-- Catálogos del SAT para validaciones y dropdowns en el dashboard
-- ============================================================
CREATE TABLE IF NOT EXISTS billing_catalogo_sat (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo        TEXT NOT NULL,             -- 'regimen_fiscal' | 'uso_cfdi' | 'forma_pago' | 'metodo_pago' | 'clave_unidad'
  clave       TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  activo      BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(tipo, clave)
);

CREATE INDEX IF NOT EXISTS idx_catalogo_sat_tipo
  ON billing_catalogo_sat(tipo) WHERE activo = true;

ALTER TABLE billing_catalogo_sat ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_catalogo_sat FORCE ROW LEVEL SECURITY;

CREATE POLICY billing_authenticated_catalogo_sat
  ON billing_catalogo_sat FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- Verificación final — debe mostrar 10 tablas billing_*
-- ============================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'billing_%'
ORDER BY table_name;
