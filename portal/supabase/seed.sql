-- ============================================================
-- Seed — Módulo de Facturación
-- ASC Auditores y Consultores Empresarial
-- Empresa piloto: SPT1608084H8 — Security Privada Taveda e Investigaciones
-- ============================================================

-- ============================================================
-- 1. Empresa emisora piloto
-- ============================================================
INSERT INTO billing_empresas_emisoras (
  id,
  rfc,
  razon_social,
  regimen_fiscal,
  cp_fiscal,
  csd_numero_certificado,
  csd_vigencia_inicio,
  csd_vigencia_fin,
  activo
) VALUES (
  gen_random_uuid(),
  'SPT1608084H8',
  'Security Privada Taveda e Investigaciones',
  '601',         -- General de Ley Personas Morales
  '50070',
  NULL,          -- número de certificado CSD (llenar al cargar sellos en factura.com sandbox)
  '2024-09-12',
  '2028-09-12',
  true
);

-- ============================================================
-- 2. Serie de facturación default para SPT
-- uid_facturacom: llenar después de crear la serie en factura.com sandbox
-- ============================================================
INSERT INTO billing_series_emisoras (
  empresa_id,
  serie,
  descripcion,
  es_default,
  activa,
  uid_facturacom
)
SELECT
  id,
  'A',
  'Serie principal',
  true,
  true,
  NULL           -- llenar con el UID numérico de factura.com tras crear la serie
FROM billing_empresas_emisoras
WHERE rfc = 'SPT1608084H8';

-- ============================================================
-- 3. Concepto de servicio frecuente (servicios de seguridad)
-- clave_prod_serv 80141600 = Servicios de seguridad y protección
-- ============================================================
INSERT INTO billing_conceptos (
  empresa_id,
  sku,
  descripcion,
  clave_prod_serv,
  clave_unidad,
  precio_unitario,
  tasa_iva,
  activo
)
SELECT
  id,
  'SEG-MONIT-01',
  'Servicio de protección y custodia mediante monitoreo de sistemas de seguridad',
  '80141600',    -- Servicios de seguridad y protección (catálogo SAT)
  'MES',         -- Mes
  0.00,          -- precio referencial — se ajusta por cliente/contrato
  0.16,
  true
FROM billing_empresas_emisoras
WHERE rfc = 'SPT1608084H8';

-- ============================================================
-- 4. Catálogo SAT — subconjunto relevante para el despacho
-- ============================================================

-- Regímenes fiscales
INSERT INTO billing_catalogo_sat (tipo, clave, descripcion) VALUES
  ('regimen_fiscal', '601', 'General de Ley Personas Morales'),
  ('regimen_fiscal', '612', 'Personas Físicas con Actividades Empresariales y Profesionales'),
  ('regimen_fiscal', '621', 'Incorporación Fiscal'),
  ('regimen_fiscal', '625', 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas'),
  ('regimen_fiscal', '626', 'Régimen Simplificado de Confianza')
ON CONFLICT (tipo, clave) DO NOTHING;

-- Uso CFDI
INSERT INTO billing_catalogo_sat (tipo, clave, descripcion) VALUES
  ('uso_cfdi', 'G01', 'Adquisición de mercancias'),
  ('uso_cfdi', 'G03', 'Gastos en general'),
  ('uso_cfdi', 'I01', 'Construcciones'),
  ('uso_cfdi', 'I04', 'Equipo de computo y accesorios'),
  ('uso_cfdi', 'P01', 'Por definir'),
  ('uso_cfdi', 'S01', 'Sin efectos fiscales'),
  ('uso_cfdi', 'CP01', 'Pagos')
ON CONFLICT (tipo, clave) DO NOTHING;

-- Formas de pago
INSERT INTO billing_catalogo_sat (tipo, clave, descripcion) VALUES
  ('forma_pago', '01', 'Efectivo'),
  ('forma_pago', '02', 'Cheque nominativo'),
  ('forma_pago', '03', 'Transferencia electrónica de fondos'),
  ('forma_pago', '04', 'Tarjeta de crédito'),
  ('forma_pago', '28', 'Tarjeta de débito'),
  ('forma_pago', '99', 'Por definir')
ON CONFLICT (tipo, clave) DO NOTHING;

-- Método de pago
INSERT INTO billing_catalogo_sat (tipo, clave, descripcion) VALUES
  ('metodo_pago', 'PUE', 'Pago en una sola exhibición'),
  ('metodo_pago', 'PPD', 'Pago en parcialidades o diferido')
ON CONFLICT (tipo, clave) DO NOTHING;

-- Claves de unidad (más frecuentes)
INSERT INTO billing_catalogo_sat (tipo, clave, descripcion) VALUES
  ('clave_unidad', 'ACT', 'Actividad'),
  ('clave_unidad', 'MES', 'Mes'),
  ('clave_unidad', 'H87', 'Pieza'),
  ('clave_unidad', 'E48', 'Unidad de servicio'),
  ('clave_unidad', 'HUR', 'Hora')
ON CONFLICT (tipo, clave) DO NOTHING;
