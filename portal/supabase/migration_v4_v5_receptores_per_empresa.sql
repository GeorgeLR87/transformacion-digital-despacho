-- ============================================================
-- Migracion v4 → v5: billing_receptores per empresa
-- Cada empresa emisora tiene su propia lista de receptores
-- con UIDs independientes de factura.com
-- Aplicada: 2026-04-07
-- ============================================================

BEGIN;

-- 1. Eliminar receptores compartidos (0 facturas, sin dependencias FK)
DELETE FROM billing_receptores;

-- 2. Quitar constraints del modelo global
ALTER TABLE billing_receptores DROP CONSTRAINT IF EXISTS billing_receptores_rfc_key;
ALTER TABLE billing_receptores DROP CONSTRAINT IF EXISTS billing_receptores_uid_facturacom_key;

-- 3. Agregar empresa_id (cada receptor pertenece a una empresa)
ALTER TABLE billing_receptores
  ADD COLUMN empresa_id UUID NOT NULL REFERENCES billing_empresas_emisoras(id);

-- 4. Constraint: mismo RFC puede existir una vez por empresa
ALTER TABLE billing_receptores
  ADD CONSTRAINT billing_receptores_empresa_rfc_key UNIQUE (empresa_id, rfc);

-- 5. Indice para queries por empresa
CREATE INDEX IF NOT EXISTS idx_receptores_empresa ON billing_receptores(empresa_id);

COMMIT;
