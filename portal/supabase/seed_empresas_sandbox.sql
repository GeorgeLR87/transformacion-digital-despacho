-- ============================================================
-- Seed — 7 empresas emisoras con datos inventados para sandbox
-- Módulo de Facturación · ASC Auditores
--
-- NOTA: Datos ficticios para desarrollo. Reemplazar con datos
-- reales cuando el cliente entregue información fiscal (Orden 33).
-- ============================================================

-- ============================================================
-- Empresas emisoras (7 adicionales a SPT1608084H8)
-- RFC generados con formato válido pero ficticios
-- ============================================================

INSERT INTO billing_empresas_emisoras (
  rfc, razon_social, regimen_fiscal, cp_fiscal,
  csd_numero_certificado, csd_vigencia_inicio, csd_vigencia_fin, activo
) VALUES
  -- Empresa 2: Constructora
  ('CON200315AB1',
   'CONSTRUCTORA VALLES DEL NEVADO SA DE CV',
   '601', '50200',
   NULL, '2025-01-15', '2029-01-15', true),

  -- Empresa 3: Restaurante
  ('RES190728CD2',
   'RESTAURANTE EL PORTAL TOLUQUEÑO SA DE CV',
   '601', '50000',
   NULL, '2025-03-01', '2029-03-01', true),

  -- Empresa 4: Consultora
  ('CSA210512EF3',
   'CONSULTORÍA ESTRATÉGICA SIERRA ALTA SC',
   '601', '50120',
   NULL, '2025-06-10', '2029-06-10', true),

  -- Empresa 5: Transporte
  ('TRL180923GH4',
   'TRANSPORTES RÁPIDOS DE LERMA SA DE CV',
   '601', '52000',
   NULL, '2024-11-20', '2028-11-20', true),

  -- Empresa 6: Comercializadora
  ('CMT220105IJ5',
   'COMERCIALIZADORA METEPEC TRADE SA DE CV',
   '601', '52140',
   NULL, '2025-02-28', '2029-02-28', true),

  -- Empresa 7: Persona física — servicios profesionales
  ('GALA850214KL6',
   'GARCIA LOPEZ ALEJANDRO',
   '612', '50080',
   NULL, '2025-04-01', '2029-04-01', true),

  -- Empresa 8: Inmobiliaria
  ('ITZ230930MN7',
   'INMOBILIARIA TOLUCA ZINACANTEPEC SA DE CV',
   '601', '50010',
   NULL, '2025-07-15', '2029-07-15', true)

ON CONFLICT (rfc) DO NOTHING;

-- ============================================================
-- Series de facturación (F=factura, PA=pago) para cada empresa
-- uid_facturacom: NULL hasta que se creen en sandbox de factura.com
-- ============================================================

-- Series para cada empresa nueva
INSERT INTO billing_series_emisoras (empresa_id, serie, tipo, descripcion, es_default, activa, uid_facturacom)
SELECT id, 'F', 'factura', 'Serie principal de facturas', true, true, NULL
FROM billing_empresas_emisoras WHERE rfc IN ('CON200315AB1','RES190728CD2','CSA210512EF3','TRL180923GH4','CMT220105IJ5','GALA850214KL6','ITZ230930MN7');

INSERT INTO billing_series_emisoras (empresa_id, serie, tipo, descripcion, es_default, activa, uid_facturacom)
SELECT id, 'PA', 'pago', 'Serie complementos de pago', false, true, NULL
FROM billing_empresas_emisoras WHERE rfc IN ('CON200315AB1','RES190728CD2','CSA210512EF3','TRL180923GH4','CMT220105IJ5','GALA850214KL6','ITZ230930MN7');

-- ============================================================
-- Conceptos frecuentes por giro (1 concepto por empresa)
-- ============================================================

-- Constructora → Obra civil
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'OBR-CIV-01', 'Servicio de construcción de obra civil', '80131500', 'E48', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'CON200315AB1';

-- Restaurante → Alimentos preparados
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'ALI-PREP-01', 'Servicio de alimentos preparados para eventos', '90101500', 'E48', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'RES190728CD2';

-- Consultora → Servicios de consultoría
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'CONS-EMP-01', 'Consultoría empresarial y estratégica', '80111600', 'E48', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'CSA210512EF3';

-- Transporte → Servicio de transporte de carga
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'TRA-CAR-01', 'Servicio de transporte de carga terrestre', '78101800', 'E48', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'TRL180923GH4';

-- Comercializadora → Venta de mercancías
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'MER-GEN-01', 'Venta de mercancías en general', '43211500', 'H87', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'CMT220105IJ5';

-- Persona física → Honorarios profesionales
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'HON-PROF-01', 'Honorarios por servicios profesionales de contabilidad', '80111500', 'E48', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'GALA850214KL6';

-- Inmobiliaria → Arrendamiento
INSERT INTO billing_conceptos (empresa_id, sku, descripcion, clave_prod_serv, clave_unidad, precio_unitario, tasa_iva, activo)
SELECT id, 'ARR-INM-01', 'Arrendamiento de inmueble para uso comercial', '80131500', 'MES', 0.00, 0.16, true
FROM billing_empresas_emisoras WHERE rfc = 'ITZ230930MN7';

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
  ('LOG190315EF3', 'LOGÍSTICA INTEGRAL CENTRO SA DE CV', '601', '50000', 'facturacion@logcentro.test', 'G03', NULL, true),
  ('ROPM880725GH4', 'RODRIGUEZ PEREZ MARIA FERNANDA', '626', '50200', 'mfernanda.rp@test.com', 'G03', NULL, true)
ON CONFLICT (rfc) DO NOTHING;
