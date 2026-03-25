# Documentación factura.com — Referencia local
# Carpeta: facturacion/docs/facturacom/

---

## Contenido

### Archivos de referencia rápida (generados y curados para este proyecto)

| Archivo | Descripción |
|---------|-------------|
| `postman-collection.json` | Colección Postman oficial completa (144 requests) — fuente de verdad de endpoints |
| `crear-cfdi40.md` | Crear facturas ordinarias, PPD y globales — payloads listos para usar |
| `complemento-pago.md` | Complemento de pago REP v2.0 — flujo completo con casos edge |
| `clientes-y-series.md` | Gestión de receptores y series por RFC emisor |

### Documentación oficial completa (extraída de factura.com/apidocs/)

Carpeta `docs-oficiales/` — 20 archivos con la documentación completa oficial:

| Archivo | Contenido |
|---------|-----------|
| `1InformacionGeneral.md` | Introducción, prerequisitos |
| `2Entornos.md` | Sandbox vs Producción, URLs |
| `3Primeros pasos.md` | Autenticación, headers, API Key |
| `4ListarCFDIs.md` | Listado con filtros y paginación |
| `5BuscarCFDI.md` | Búsqueda por UID, UUID y folio |
| `6CrearCFDI4.0.md` | **Referencia completa** de todos los campos del CFDI |
| `7CrearCFDIGlobal4.0.md` | CFDI Global / Público en General |
| `8BorradoresCFDI4.0.md` | Crear, modificar, timbrar y eliminar borradores |
| `9DescargarCFDI.md` | Descargar PDF y XML |
| `10CancelarCFDI4.0.md` | Cancelación con motivos SAT |
| `11DescargarAcuseCFDI4.0.md` | Acuse de cancelación |
| `12EnviarCFDI.md` | Reenvío por correo |
| `13ConsultarEstatusDeCancel...md` | Estatus de cancelación (3 estados posibles) |
| `14Complementos.md` | **REP v2.0 completo** — todos los campos de Pagos y DoctoRelacionado |
| `15Catálogos.md` | Endpoints de catálogos SAT (UsoCFDI, FormaPago, RegimenFiscal, etc.) |
| `16Clientes.md` | CRUD completo de clientes/receptores |
| `17Empresas.md` | Gestión de empresas emisoras (crear con CSD) |
| `18Series.md` | CRUD de series + respuestas de ejemplo |
| `19Productos.md` | CRUD de productos/conceptos del catálogo |
| `20FundamentosLegalesDelSAT.txt` | Base legal |

---

## Cuándo usar qué

**Para implementar en N8N o código** → usar los archivos `.md` de referencia rápida
y la skill `.claude/skills/api-facturacom.md`

**Para consultar un campo específico, un parámetro opcional, o un caso edge** →
leer el archivo correspondiente de `docs-oficiales/`

**Para un endpoint no cubierto en los .md** (borradores, acuse de cancelación, catálogos):
```
"Lee docs/facturacom/docs-oficiales/[archivo].md y explícame cómo funciona [endpoint]"
```

**Para un endpoint raro o avanzado** (webhooks, nóminas, retenciones, addendas):
```
"Lee docs/facturacom/postman-collection.json y dame el payload de [nombre del request]"
```

---

## Dato importante de la documentación oficial

Al leer `14Complementos.md` se confirmó que el campo `Impuestos.Traslados` en
`DoctoRelacionado` del REP tiene la ortografía correcta **`Traslados`** (con 'a'),
a diferencia del nodo padre `Trasaldos` que aparece en la colección Postman.
Usar `Traslados` dentro de `DoctoRelacionado`.

---

## URLs de referencia

- Documentación oficial: https://factura.com/apidocs/
- Sandbox panel: https://sandbox.factura.com
- Producción panel: https://factura.com

---

## Actualización de esta documentación

Si factura.com actualiza su API:
1. Re-exportar la colección Postman y reemplazar `postman-collection.json`
2. Actualizar los archivos en `docs-oficiales/` con el nuevo contenido de la web
3. Actualizar los archivos `.md` de referencia rápida afectados
4. Actualizar la skill `.claude/skills/api-facturacom.md`
