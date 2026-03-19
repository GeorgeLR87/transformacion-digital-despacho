# Skill: factura.com API — Integración y Patrones
# Fuente: Colección Postman oficial "Factura.com Workspace Publico" (144 requests)
# Última actualización: 2026-03

---

## URLs base

| Entorno | URL base |
|---------|----------|
| **Sandbox** | `https://sandbox.factura.com/api` |
| **Producción** | `https://api.factura.com` |

> Cambiar entre entornos solo ajustando la URL base — los paths son idénticos.

---

## Autenticación — 3 headers obligatorios en TODOS los requests

```
F-PLUGIN:     9d4095c8f7ed5785cb14c0e3b033eeb8252416ed
F-Api-Key:    {{API-key}}
F-Secret-Key: {{Secret-key}}
Content-Type: application/json
```

> **Crítico**: `F-PLUGIN` es un valor fijo que nunca cambia. Si falta, la API rechaza el request.
> Las credenciales `F-Api-Key` y `F-Secret-Key` son únicas por RFC emisor — se recuperan en
> runtime desde `billing_empresas_emisoras`. Nunca hardcodear ni exponer al cliente browser.

---

## Mapa de versiones por recurso

Factura.com usa versiones de API distintas según el recurso — no todo es v4:

| Recurso | Versión | Path base |
|---------|---------|-----------|
| CFDIs (crear, cancelar, descargar) | **v4** | `/v4/cfdi40/` |
| Consultar lista / búsqueda CFDIs | **v4** | `/v4/cfdi/` |
| Borradores | **v4** | `/v4/drafts/` |
| Series | **v4** | `/v4/series/` |
| Empresa / cuenta | **v4 / v1** | `/v4/account/` · `/v1/account/` |
| **Clientes (receptores)** | **v1** | `/v1/clients/` |
| **Productos (conceptos)** | **v3** | `/v3/products/` |

---

## Endpoints del proyecto — referencia rápida

### CFDIs

| Método | Path | Descripción |
|--------|------|-------------|
| `GET` | `/v4/cfdi/list` | Listar CFDIs (paginado) |
| `GET` | `/v4/cfdi/uid/{uid}` | Buscar por UID interno |
| `GET` | `/v4/cfdi/uuid/{uuid}` | Buscar por UUID del SAT |
| `GET` | `/v4/cfdi/folio/{folio}` | Buscar por folio |
| `POST` | `/v4/cfdi40/create` | Crear y timbrar CFDI 4.0 |
| `POST` | `/v4/cfdi40/{uid}/cancel` | Cancelar CFDI 4.0 |
| `GET` | `/v4/cfdi40/{uid}/pdf` | Descargar PDF (base64) |
| `GET` | `/v4/cfdi40/{uid}/xml` | Descargar XML (base64) |
| `GET` | `/v4/cfdi40/{uid}/email` | Reenviar por correo |
| `GET` | `/v4/cfdi40/{uid}/cancel_status` | Consultar estado de cancelación |

### Clientes (Receptores) — versión v1

| Método | Path | Descripción |
|--------|------|-------------|
| `GET` | `/v1/clients` | Listar clientes |
| `GET` | `/v1/clients/{RFC}` | Consultar por RFC |
| `GET` | `/v1/clients/rfc/{RFC}` | Verificar RFC duplicado |
| `POST` | `/v1/clients/create` | Crear cliente |
| `POST` | `/v1/clients/{uid}/update` | Actualizar cliente |
| `POST` | `/v1/clients/destroy/{uid}` | Eliminar cliente |
| `GET` | `/v1/clients/lco/{RFC}` | Consultar LCO del RFC |

### Series

| Método | Path | Descripción |
|--------|------|-------------|
| `GET` | `/v4/series` | Listar todas las series |
| `GET` | `/v4/series/{uid}` | Consultar serie por UID |
| `POST` | `/v4/series/create` | Crear nueva serie |
| `POST` | `/v4/series/{uid}/up` | Activar serie |
| `POST` | `/v4/series/{uid}/down` | Desactivar serie |
| `POST` | `/v4/series/{uid}/drop` | Eliminar serie |

### Productos (Conceptos del catálogo) — versión v3

| Método | Path | Descripción |
|--------|------|-------------|
| `GET` | `/v3/products/create` | Listar productos |
| `GET` | `/v3/products/show/{uid}` | Consultar producto |
| `POST` | `/v3/products/create` | Crear producto |
| `POST` | `/v3/products/update/{uid}` | Actualizar producto |
| `GET` | `/v3/products/delete/{uid}` | Eliminar producto |

---

## Payloads exactos (fuente: Postman oficial)

### Crear CFDI 4.0 — Factura ordinaria

```json
POST /v4/cfdi40/create

{
  "Receptor": {
    "UID": "6169fc02637e1"
  },
  "TipoDocumento": "factura",
  "Conceptos": [
    {
      "ClaveProdServ": "81112101",
      "Cantidad": 1,
      "ClaveUnidad": "E48",
      "Unidad": "Unidad de servicio",
      "ValorUnitario": 229.90,
      "Descripcion": "Desarrollo a la medida",
      "ObjetoImp": "02",
      "Impuestos": {
        "Traslados": [
          {
            "Base": 229.90,
            "Impuesto": "002",
            "TipoFactor": "Tasa",
            "TasaOCuota": "0.16",
            "Importe": 36.784
          }
        ]
      }
    }
  ],
  "UsoCFDI": "G03",
  "Serie": 17317,
  "FormaPago": "03",
  "MetodoPago": "PUE",
  "Moneda": "MXN",
  "EnviarCorreo": false
}
```

> **Notas importantes**:
> - `Receptor.UID` es el UID interno de factura.com, **NO el RFC**. Se obtiene al crear el cliente vía `/v1/clients/create`.
> - `Serie` es el **UID numérico** de la serie en factura.com (ej: 17317), **NO la letra** (ej: no es "A").
> - `ObjetoImp: "02"` = Sí objeto de impuesto (el más común). `"01"` = No objeto de impuesto.
> - `EnviarCorreo: false` — el despacho controla el envío desde N8N para tener trazabilidad.
> - Los impuestos se calculan a **6 decimales** por disposición del SAT.

### Complemento de Pago v2.0 (REP)

```json
POST /v4/cfdi40/create

{
  "Receptor": {
    "UID": "62b1dcf75a60f"
  },
  "TipoCfdi": "pago",
  "UsoCFDI": "CP01",
  "Redondeo": "2",
  "FormaPago": "03",
  "MetodoPago": "PPD",
  "Moneda": "XXX",
  "Serie": "14291",
  "EnviarCorreo": true,
  "Conceptos": [
    {
      "ClaveProdServ": "84111506",
      "Cantidad": "1",
      "ClaveUnidad": "ACT",
      "Descripcion": "Pago",
      "ValorUnitario": "0",
      "Importe": "0"
    }
  ],
  "Pagos": [
    {
      "FechaPago": "2026-03-17T10:00:00",
      "FormaDePagoP": "03",
      "MonedaP": "MXN",
      "TipoCambioP": 0,
      "Monto": "5800.00",
      "DoctoRelacionado": [
        {
          "IdDocumento": "UUID-SAT-DE-LA-FACTURA-PPD",
          "MonedaDR": "MXN",
          "EquivalenciaDR": 1,
          "ImpSaldoAnt": "5800.00",
          "ImpPagado": "5800.00",
          "ImpSaldoInsoluto": "0.00",
          "ObjetoImpuesto": "02",
          "MetodoDePagoDR": "PPD",
          "NumParcialidad": "1",
          "Impuestos": {
            "Trasaldos": [
              {
                "Base": "5000.00",
                "Impuesto": "002",
                "TipoFactor": "Tasa",
                "TasaOCuota": "0.16",
                "Importe": "800.00"
              }
            ],
            "Retenidos": []
          }
        }
      ]
    }
  ]
}
```

> **Notas del REP**:
> - Usar `TipoCfdi: "pago"` — campo distinto a `TipoDocumento`. Exclusivo para REPs.
> - `Moneda: "XXX"` — siempre XXX en el comprobante de pago (norma SAT). `MonedaP` sí lleva la moneda real.
> - `IdDocumento` — es el **UUID SAT** de la factura PPD original (el que está en `billing_facturas.uuid_sat`).
> - El nodo `Conceptos` siempre va con los valores fijos de arriba para todos los REPs.
> - `Trasaldos` — así está en la API de factura.com con esa ortografía. No es error.

### Cancelar CFDI 4.0

```json
POST /v4/cfdi40/{uid_interno}/cancel

{
  "motivo": "02",
  "folioSustituto": ""
}
```

> Motivos SAT:
> - `"01"` = Comprobante emitido con errores con relación (requiere `folioSustituto`)
> - `"02"` = Comprobante emitido con errores sin relación
> - `"03"` = No se llevó a cabo la operación
> - `"04"` = Operación nominativa relacionada en la factura global

### Crear Cliente (Receptor)

```json
POST /v1/clients/create

{
  "nombre": "Nombre",
  "apellidos": "Apellidos",
  "email": "correo@email.com",
  "email2": "",
  "email3": "",
  "telefono": "33 3877 7741",
  "razons": "RAZÓN SOCIAL EN MAYÚSCULAS S.A. DE C.V.",
  "rfc": "XAXX010101000",
  "regimen": 612,
  "calle": "Av. Juarez",
  "numero_exterior": 1234,
  "numero_interior": "",
  "codpos": 44640,
  "colonia": "Centro",
  "estado": "Jalisco",
  "ciudad": "Guadalajara",
  "delegacion": ""
}
```

> `razons` debe ir en **MAYÚSCULAS exactas** tal como aparece en la Constancia de Situación Fiscal del SAT.

### Crear Serie

```json
POST /v4/series/create

{
  "letra": "A",
  "tipoDocumento": "factura",
  "folio": 1
}
```

### Listar CFDIs (con paginación)

```json
GET /v4/cfdi/list

Body:
{
  "year": 2026,
  "page": 1,
  "per_page": 20
}
```

---

## Respuestas de la API

### Éxito — timbrado

```json
{
  "response": "success",
  "data": {
    "uid": "61d4c3fe77dd8",
    "uuid": "XXXX-XXXX-XXXX-XXXX",
    "folio": "123",
    "serie": "A",
    "fecha": "2026-03-17T10:00:00",
    "total": "266.68",
    "status": "active"
  }
}
```

> - `uid` → identificador interno de factura.com. Guardar en `billing_facturas` para descargar PDF/XML.
> - `uuid` → UUID fiscal del SAT. Guardar en `billing_facturas.uuid_sat`. Es el que va en el REP.

### Error — timbrado

```json
{
  "response": "error",
  "message": {
    "message": "Descripción del error",
    "messageDetail": "Detalle técnico del SAT",
    "data": null,
    "status": "error"
  }
}
```

---

## Descargar y guardar PDF/XML en Supabase Storage

```typescript
// Los endpoints de descarga regresan el archivo en base64
// GET /v4/cfdi40/{uid}/pdf → { "data": "BASE64..." }
// GET /v4/cfdi40/{uid}/xml → { "data": "BASE64..." }

const pdfBuffer = Buffer.from(pdfResponse.data, 'base64')
const xmlBuffer = Buffer.from(xmlResponse.data, 'base64')

const año = new Date().getFullYear()
const mes = String(new Date().getMonth() + 1).padStart(2, '0')
const storagePath = `${año}/${mes}/${uuid_sat}`

await supabase.storage.from('facturas').upload(`${storagePath}.pdf`, pdfBuffer, {
  contentType: 'application/pdf'
})
await supabase.storage.from('facturas').upload(`${storagePath}.xml`, xmlBuffer, {
  contentType: 'application/xml'
})
```

---

## Restricciones críticas del SAT

| Restricción | Detalle |
|-------------|---------|
| Fecha del CFDI | No puede ser mayor a **72 horas** hacia atrás desde el timbrado |
| Decimales | Precios, impuestos y totales hasta **6 decimales** |
| Razón social receptor | En **MAYÚSCULAS** exactas como aparece en la CIF |
| RFC receptor | Debe ser válido ante el SAT — la API rechaza RFCs inválidos |
| Folio | **Asignado automáticamente** por factura.com. Nunca intentar asignarlo manualmente |

---

## Manejo de errores en N8N

```
[POST /v4/cfdi40/create]
  → [IF response.response === "success"]
      SÍ → descargar PDF + XML → subir Supabase Storage
           → INSERT billing_facturas (status: "timbrada", uuid_sat, uid_facturacom)
           → enviar correo al receptor
           → notificar Telegram con UUID + folio
      NO → [SET error = response.message.message]
           → [Telegram: notificar error al operador]
           → [Supabase: UPDATE billing_facturas SET status="error", notas_internas=error]
```

> Nunca guardar `uuid_sat` ni cambiar status a `"timbrada"` hasta confirmar `response === "success"`.

---

## Sandbox vs Producción

```
Variable N8N:  FACTURACOM_BASE_URL
Sandbox:       https://sandbox.factura.com/api
Producción:    https://api.factura.com
```

Las credenciales de sandbox se obtienen del panel en `sandbox.factura.com` y son distintas a las de producción. Usar sandbox hasta que el flujo completo esté validado extremo a extremo.

---

## Referencia de la colección Postman

La colección completa oficial está en:
```
facturacion/docs/facturacom/postman-collection.json
```
144 requests · 16 carpetas · Fuente de verdad para cualquier endpoint no documentado aquí.
