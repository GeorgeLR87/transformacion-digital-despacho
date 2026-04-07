-- ============================================================
-- Seed — 6 empresas sandbox reales de factura.com
-- Modulo de Facturacion · ASC Auditores
--
-- Datos obtenidos del sandbox de factura.com (2026-04-07).
-- Cada empresa tiene su propia API Key y Secret Key.
-- EKU9003173C9 (empresa de pruebas SAT) se usa como piloto
-- en sandbox, sus keys estan bajo SPT1608084H8.
-- ============================================================

-- ============================================================
-- Empresas emisoras (6 adicionales a SPT1608084H8)
-- RFCs de prueba del sandbox de factura.com
-- ============================================================

INSERT INTO billing_empresas_emisoras (
  rfc, razon_social, regimen_fiscal, cp_fiscal, activo
) VALUES
  -- Empresa 2: Agricola/ganadera (622)
  ('JES900109Q90',
   'JIMENEZ ESTRADA SALAS',
   '622', '37161', true),

  -- Empresa 3: RESICO PM (626)
  ('ZUÑ920208KL4',
   'ZAPATERIA URTADO ÑERI',
   '626', '34541', true),

  -- Empresa 4: Fines no lucrativos (603)
  ('IXS7607092R5',
   'INTERNACIONAL XIMBO Y SABORES',
   '603', '23004', true),

  -- Empresa 5: Regimen general PM (601) — CSD valido de origen
  ('OÑO120726RX3',
   'ORGANICOS ÑAVEZ OSORIO',
   '601', '40501', true),

  -- Empresa 6: PF actividades empresariales (612)
  ('MISC491214B86',
   'CECILIA MIRANDA SANCHEZ',
   '612', '01010', true),

  -- Empresa 7: PF doble regimen (612 + 605)
  ('XOJI740919U48',
   'INGRID XODAR JIMENEZ',
   '612', '76028', true)

ON CONFLICT (rfc) DO NOTHING;

-- ============================================================
-- API Keys y Secret Keys de sandbox (factura.com)
-- Estas keys solo son accesibles via service_role (RLS)
-- ============================================================

INSERT INTO billing_empresas_api_keys (empresa_id, api_key, secret_key)
SELECT id,
  'JDJ5JDEwJEpQSWNPQjFtVjY5bTEya3pVZE5jemU1UHYuRnlrRGdwcGtqc3pnRjBibWprN1BHT0RFZlky',
  'JDJ5JDEwJEtkZG5WTVdGazJpLkUxQkM4VlpEek9kR1R3V2xjTkF5LklFWlRScWxacU1kYWhRVzdjZGxL'
FROM billing_empresas_emisoras WHERE rfc = 'JES900109Q90'
ON CONFLICT (empresa_id) DO NOTHING;

INSERT INTO billing_empresas_api_keys (empresa_id, api_key, secret_key)
SELECT id,
  'JDJ5JDEwJFJmUk54YzYzNGpiYW9ZY09FYzRjcGVoc08vRVMwWFFMYXYwT01RaWpXaTRRRWs0NFRkU1FL',
  'JDJ5JDEwJE5kWkZIRG5xSHFIbjhlUXgyOTd2aHU3N28xMXFzdXhubW5abmNrYUxmZ1hBaDdidzBQRE5X'
FROM billing_empresas_emisoras WHERE rfc = 'ZUÑ920208KL4'
ON CONFLICT (empresa_id) DO NOTHING;

INSERT INTO billing_empresas_api_keys (empresa_id, api_key, secret_key)
SELECT id,
  'JDJ5JDEwJDMvMFRmWlJ0ZEd5QkM5Ym12SEtDcC5mY1JjbVlwV2pzVnBNNEIvelZhWTR0QmVuWUhYamFt',
  'JDJ5JDEwJC5XSmVGZGpYR0EuLklHUWZoVVdOWXU5WHV6V1dNUy9RV1RTUkN1bDZCbkNTNlA1SmpHT0w2'
FROM billing_empresas_emisoras WHERE rfc = 'IXS7607092R5'
ON CONFLICT (empresa_id) DO NOTHING;

INSERT INTO billing_empresas_api_keys (empresa_id, api_key, secret_key)
SELECT id,
  'JDJ5JDEwJFJtVHlrdVZyRWZFMTJTUlZOSWk2OGV2TWJSS2g0dTgvejUvRS4wTjBCVFI1Y0h3bmROOU5p',
  'JDJ5JDEwJHpkc21QUklqLlMweXJtZER0eTBsL2VPbzlOWkhPNGp4Rkc4eUM5cWo3bTE3UFg3Zkw4Y09t'
FROM billing_empresas_emisoras WHERE rfc = 'OÑO120726RX3'
ON CONFLICT (empresa_id) DO NOTHING;

INSERT INTO billing_empresas_api_keys (empresa_id, api_key, secret_key)
SELECT id,
  'JDJ5JDEwJERRcVdKZ0NlWU5xUG5HU1R1VGFKbi5rNVAvMU1EVWNONW1KVGxOQ2RxdEI2bjc4NGV2Qm9H',
  'JDJ5JDEwJDNkdHY2bXhiV0RyUXlLSjJQenU5S2VDaWxFdzUueUtoYkZFUjFLN0ZjRTVLUGswL1hRbjFL'
FROM billing_empresas_emisoras WHERE rfc = 'MISC491214B86'
ON CONFLICT (empresa_id) DO NOTHING;

INSERT INTO billing_empresas_api_keys (empresa_id, api_key, secret_key)
SELECT id,
  'JDJ5JDEwJFEwL1BLbG9rNm1EODZjRm9Ub1RjS2VpYXQ5a05wSHk4ZllKQnhrZmpZZk96YVZHQjVsRUJD',
  'JDJ5JDEwJHVmcmpvQnRPWnU5UXF5aW9jaDVnVk90SEx5T0xFakxyc2NyNmZESmt1WGlncjJ4VmFZRjN1'
FROM billing_empresas_emisoras WHERE rfc = 'XOJI740919U48'
ON CONFLICT (empresa_id) DO NOTHING;

-- ============================================================
-- Series de facturacion (F=factura, PA=pago) para cada empresa
-- uid_facturacom: NULL hasta que se obtengan del sandbox
-- ============================================================

INSERT INTO billing_series_emisoras (empresa_id, serie, tipo, descripcion, es_default, activa, uid_facturacom)
SELECT id, 'F', 'factura', 'Serie principal de facturas', true, true, NULL
FROM billing_empresas_emisoras WHERE rfc IN ('JES900109Q90','ZUÑ920208KL4','IXS7607092R5','OÑO120726RX3','MISC491214B86','XOJI740919U48')
ON CONFLICT (empresa_id, serie) DO NOTHING;

INSERT INTO billing_series_emisoras (empresa_id, serie, tipo, descripcion, es_default, activa, uid_facturacom)
SELECT id, 'PA', 'pago', 'Serie complementos de pago', false, true, NULL
FROM billing_empresas_emisoras WHERE rfc IN ('JES900109Q90','ZUÑ920208KL4','IXS7607092R5','OÑO120726RX3','MISC491214B86','XOJI740919U48')
ON CONFLICT (empresa_id, serie) DO NOTHING;

-- ============================================================
-- Conceptos frecuentes por giro (1 concepto por empresa)
-- ============================================================

-- Agricola/ganadera
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'AGR-SER-01', 'Servicios agricolas y ganaderos', '70151800', 'E48', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'JES900109Q90';

-- Zapateria
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'CAL-VTA-01', 'Venta de calzado', '53111600', 'H87', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'ZUÑ920208KL4';

-- Fines no lucrativos
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'SER-SOC-01', 'Servicios de asistencia social', '85101700', 'E48', 0.00, 0.00, true
FROM billing_empresas_emisoras WHERE rfc = 'IXS7607092R5';

-- Organicos
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'ORG-VTA-01', 'Venta de productos organicos', '50201700', 'H87', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'OÑO120726RX3';

-- PF honorarios
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'HON-PROF-01', 'Honorarios por servicios profesionales', '80111500', 'E48', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'MISC491214B86';

-- PF doble regimen
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'SER-PROF-01', 'Servicios profesionales independientes', '80111500', 'E48', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'XOJI740919U48';

-- ============================================================
-- Receptores de prueba (compartidos entre empresas)
-- uid_facturacom: NULL hasta crearlos en sandbox de factura.com
-- ============================================================

INSERT INTO billing_receptores (
  rfc, razon_social, regimen_fiscal, cp_fiscal, email, uso_cfdi, uid_facturacom, activo
) VALUES
  ('XAXX010101000', 'PUBLICO EN GENERAL', '616', '50000', 'publico@test.com', 'S01', NULL, true),
  ('CACX920118AB1', 'CASTILLO CRUZ XIMENA', '612', '50100', 'ximena.castillo@test.com', 'G03', NULL, true),
  ('MET200601CD2', 'METALES INDUSTRIALES DEL BAJIO SA DE CV', '601', '36100', 'contacto@metalesbajio.test', 'G03', NULL, true),
  ('LOG190315EF3', 'LOGISTICA INTEGRAL CENTRO SA DE CV', '601', '50000', 'facturacion@logcentro.test', 'G03', NULL, true),
  ('ROPM880725GH4', 'RODRIGUEZ PEREZ MARIA FERNANDA', '626', '50200', 'mfernanda.rp@test.com', 'G03', NULL, true)
ON CONFLICT (rfc) DO NOTHING;
