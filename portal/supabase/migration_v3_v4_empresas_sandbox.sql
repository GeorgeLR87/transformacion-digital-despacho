-- ============================================================
-- Migracion v3 → v4: Reemplazar 7 empresas inventadas por
-- 6 empresas sandbox reales de factura.com
-- Aplicada: 2026-04-07
-- ============================================================

BEGIN;

-- 1. Eliminar datos dependientes de empresas inventadas
DELETE FROM billing_conceptos
WHERE empresa_id IN (
  SELECT id FROM billing_empresas_emisoras
  WHERE rfc IN ('CON200315AB1','RES190728CD2','CSA210512EF3','TRL180923GH4','CMT220105IJ5','GALA850214KL6','ITZ230930MN7')
);

DELETE FROM billing_series_emisoras
WHERE empresa_id IN (
  SELECT id FROM billing_empresas_emisoras
  WHERE rfc IN ('CON200315AB1','RES190728CD2','CSA210512EF3','TRL180923GH4','CMT220105IJ5','GALA850214KL6','ITZ230930MN7')
);

-- 2. Eliminar empresas inventadas
DELETE FROM billing_empresas_emisoras
WHERE rfc IN ('CON200315AB1','RES190728CD2','CSA210512EF3','TRL180923GH4','CMT220105IJ5','GALA850214KL6','ITZ230930MN7');

-- 3. Insertar 6 empresas sandbox reales
INSERT INTO billing_empresas_emisoras (
  rfc, razon_social, regimen_fiscal, cp_fiscal, activo
) VALUES
  ('JES900109Q90', 'JIMENEZ ESTRADA SALAS', '622', '37161', true),
  ('ZUÑ920208KL4', 'ZAPATERIA URTADO ÑERI', '626', '34541', true),
  ('IXS7607092R5', 'INTERNACIONAL XIMBO Y SABORES', '603', '23004', true),
  ('OÑO120726RX3', 'ORGANICOS ÑAVEZ OSORIO', '601', '40501', true),
  ('MISC491214B86', 'CECILIA MIRANDA SANCHEZ', '612', '01010', true),
  ('XOJI740919U48', 'INGRID XODAR JIMENEZ', '612', '76028', true);

-- 4. Insertar API Keys + Secret Keys de sandbox
INSERT INTO billing_empresas_api_keys (empresa_id, api_key, secret_key)
SELECT id,
  'JDJ5JDEwJEpQSWNPQjFtVjY5bTEya3pVZE5jemU1UHYuRnlrRGdwcGtqc3pnRjBibWprN1BHT0RFZlky',
  'JDJ5JDEwJEtkZG5WTVdGazJpLkUxQkM4VlpEek9kR1R3V2xjTkF5LklFWlRScWxacU1kYWhRVzdjZGxL'
FROM billing_empresas_emisoras WHERE rfc = 'JES900109Q90';

INSERT INTO billing_empresas_api_keys (empresa_id, api_key, secret_key)
SELECT id,
  'JDJ5JDEwJFJmUk54YzYzNGpiYW9ZY09FYzRjcGVoc08vRVMwWFFMYXYwT01RaWpXaTRRRWs0NFRkU1FL',
  'JDJ5JDEwJE5kWkZIRG5xSHFIbjhlUXgyOTd2aHU3N28xMXFzdXhubW5abmNrYUxmZ1hBaDdidzBQRE5X'
FROM billing_empresas_emisoras WHERE rfc = 'ZUÑ920208KL4';

INSERT INTO billing_empresas_api_keys (empresa_id, api_key, secret_key)
SELECT id,
  'JDJ5JDEwJDMvMFRmWlJ0ZEd5QkM5Ym12SEtDcC5mY1JjbVlwV2pzVnBNNEIvelZhWTR0QmVuWUhYamFt',
  'JDJ5JDEwJC5XSmVGZGpYR0EuLklHUWZoVVdOWXU5WHV6V1dNUy9RV1RTUkN1bDZCbkNTNlA1SmpHT0w2'
FROM billing_empresas_emisoras WHERE rfc = 'IXS7607092R5';

INSERT INTO billing_empresas_api_keys (empresa_id, api_key, secret_key)
SELECT id,
  'JDJ5JDEwJFJtVHlrdVZyRWZFMTJTUlZOSWk2OGV2TWJSS2g0dTgvejUvRS4wTjBCVFI1Y0h3bmROOU5p',
  'JDJ5JDEwJHpkc21QUklqLlMweXJtZER0eTBsL2VPbzlOWkhPNGp4Rkc4eUM5cWo3bTE3UFg3Zkw4Y09t'
FROM billing_empresas_emisoras WHERE rfc = 'OÑO120726RX3';

INSERT INTO billing_empresas_api_keys (empresa_id, api_key, secret_key)
SELECT id,
  'JDJ5JDEwJERRcVdKZ0NlWU5xUG5HU1R1VGFKbi5rNVAvMU1EVWNONW1KVGxOQ2RxdEI2bjc4NGV2Qm9H',
  'JDJ5JDEwJDNkdHY2bXhiV0RyUXlLSjJQenU5S2VDaWxFdzUueUtoYkZFUjFLN0ZjRTVLUGswL1hRbjFL'
FROM billing_empresas_emisoras WHERE rfc = 'MISC491214B86';

INSERT INTO billing_empresas_api_keys (empresa_id, api_key, secret_key)
SELECT id,
  'JDJ5JDEwJFEwL1BLbG9rNm1EODZjRm9Ub1RjS2VpYXQ5a05wSHk4ZllKQnhrZmpZZk96YVZHQjVsRUJD',
  'JDJ5JDEwJHVmcmpvQnRPWnU5UXF5aW9jaDVnVk90SEx5T0xFakxyc2NyNmZESmt1WGlncjJ4VmFZRjN1'
FROM billing_empresas_emisoras WHERE rfc = 'XOJI740919U48';

-- 5. Series F (factura) y PA (pago) para cada empresa
INSERT INTO billing_series_emisoras (empresa_id, serie, tipo, descripcion, es_default, activa, uid_facturacom)
SELECT id, 'F', 'factura', 'Serie principal de facturas', true, true, NULL
FROM billing_empresas_emisoras WHERE rfc IN ('JES900109Q90','ZUÑ920208KL4','IXS7607092R5','OÑO120726RX3','MISC491214B86','XOJI740919U48');

INSERT INTO billing_series_emisoras (empresa_id, serie, tipo, descripcion, es_default, activa, uid_facturacom)
SELECT id, 'PA', 'pago', 'Serie complementos de pago', false, true, NULL
FROM billing_empresas_emisoras WHERE rfc IN ('JES900109Q90','ZUÑ920208KL4','IXS7607092R5','OÑO120726RX3','MISC491214B86','XOJI740919U48');

-- 6. Conceptos de ejemplo por giro
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'AGR-SER-01', 'Servicios agricolas y ganaderos', '70151800', 'E48', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'JES900109Q90';

INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'CAL-VTA-01', 'Venta de calzado', '53111600', 'H87', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'ZUÑ920208KL4';

INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'SER-SOC-01', 'Servicios de asistencia social', '85101700', 'E48', 0.00, 0.00, true
FROM billing_empresas_emisoras WHERE rfc = 'IXS7607092R5';

INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'ORG-VTA-01', 'Venta de productos organicos', '50201700', 'H87', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'OÑO120726RX3';

INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'HON-PROF-01', 'Honorarios por servicios profesionales', '80111500', 'E48', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'MISC491214B86';

INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'SER-PROF-01', 'Servicios profesionales independientes', '80111500', 'E48', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'XOJI740919U48';

COMMIT;
