-- ============================================================
-- Migration: schema v2 → v3
-- ASC Auditores y Consultores Empresarial
-- Ejecutar en SQL Editor de Supabase (una sola vez)
-- ============================================================

-- ============================================================
-- 1. billing_empresas_api_keys — agregar secret_key
-- Factura.com requiere F-Api-Key y F-Secret-Key en todos los requests.
-- La columna faltaba en v2; DEFAULT '' evita romper filas existentes
-- pero debe poblarse al registrar cada empresa.
-- ============================================================
ALTER TABLE billing_empresas_api_keys
  ADD COLUMN IF NOT EXISTS secret_key TEXT NOT NULL DEFAULT '';

-- ============================================================
-- 2. billing_series_emisoras — agregar tipo
-- SerieType de factura.com: "factura" | "pago" | "nota_credito" |
-- "nota_debito" | "retencion".
-- Permite a resolveSerieUid distinguir series con el mismo nombre.
-- ============================================================
ALTER TABLE billing_series_emisoras
  ADD COLUMN IF NOT EXISTS tipo TEXT;

-- ============================================================
-- Verificación
-- ============================================================
SELECT
  c.table_name,
  c.column_name,
  c.data_type,
  c.column_default,
  c.is_nullable
FROM information_schema.columns c
WHERE c.table_schema = 'public'
  AND c.table_name IN ('billing_empresas_api_keys', 'billing_series_emisoras')
ORDER BY c.table_name, c.ordinal_position;
