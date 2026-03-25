# factura.com — Crear CFDI 4.0
# Fuente: Postman "Factura.com Workspace Publico" · Carpeta: API v4

---

## Endpoint

```
POST {BASE_URL}/v4/cfdi40/create
```

## Headers obligatorios

```
Content-Type:  application/json
F-PLUGIN:      9d4095c8f7ed5785cb14c0e3b033eeb8252416ed
F-Api-Key:     {API_KEY_DEL_RFC_EMISOR}
F-Secret-Key:  {SECRET_KEY_DEL_RFC_EMISOR}
```

---

## Caso 1 — Factura ordinaria PUE (pago en una sola exhibición)

```json
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

## Caso 2 — Factura PPD (pago en parcialidades o diferido)

Mismo payload que PUE, cambiando:
```json
{
  "MetodoPago": "PPD",
  "FormaPago": "99"
}
```
> `FormaPago: "99"` = Por definir. Es obligatorio para PPD porque el pago se recibirá después.

## Caso 3 — Factura Global (Público en General)

```json
{
  "Receptor": {
    "UID": "61f097f6a58c2"
  },
  "TipoDocumento": "factura",
  "InformacionGlobal": {
    "Periodicidad": "02",
    "Meses": "03",
    "Año": "2026"
  },
  "Conceptos": [...],
  "UsoCFDI": "S01",
  "Serie": 17317,
  "FormaPago": "01",
  "MetodoPago": "PUE",
  "Moneda": "MXN",
  "EnviarCorreo": false
}
```

---

## Campos del payload — referencia

| Campo | Tipo | Requerido | Notas |
|-------|------|-----------|-------|
| `Receptor.UID` | string | ✅ | UID interno de factura.com del cliente — NO el RFC |
| `TipoDocumento` | string | ✅ | `"factura"` · `"nota_credito"` · `"carta_porte_ingreso"` |
| `Serie` | number | ✅ | UID numérico de la serie en factura.com — NO la letra |
| `UsoCFDI` | string | ✅ | Clave SAT: `G03` servicios, `S01` sin efectos fiscales, `P01` por definir |
| `MetodoPago` | string | ✅ | `"PUE"` o `"PPD"` |
| `FormaPago` | string | ✅ | `"01"` efectivo · `"03"` transferencia · `"04"` tarjeta · `"99"` por definir |
| `Moneda` | string | ✅ | `"MXN"` · `"USD"` · etc. |
| `EnviarCorreo` | boolean | ✅ | `false` — el despacho maneja el envío desde N8N |
| `Conceptos[].ClaveProdServ` | string | ✅ | Clave del catálogo SAT |
| `Conceptos[].ClaveUnidad` | string | ✅ | `"E48"` servicios · `"H87"` piezas · `"ACT"` actividad |
| `Conceptos[].ObjetoImp` | string | ✅ | `"02"` sí objeto · `"01"` no objeto |
| `Conceptos[].Impuestos.Traslados[].TasaOCuota` | string | ✅ | `"0.16"` IVA 16% · `"0.00"` exento |

---

## Respuesta exitosa

```json
{
  "response": "success",
  "data": {
    "uid": "61d4c3fe77dd8",
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "folio": "123",
    "serie": "A",
    "fecha": "2026-03-17T10:00:00",
    "total": "266.68",
    "status": "active"
  }
}
```

**Guardar en Supabase**:
- `data.uid` → `billing_facturas.uid_facturacom` (para descargar PDF/XML)
- `data.uuid` → `billing_facturas.uuid_sat` (UUID fiscal del SAT)
- `data.folio` → `billing_facturas.folio`

## Respuesta error

```json
{
  "response": "error",
  "message": {
    "message": "CFDI40111 - Descripción del error SAT",
    "messageDetail": "Detalle técnico...",
    "data": null,
    "status": "error"
  }
}
```

---

## Descargar PDF y XML post-timbrado

```
GET {BASE_URL}/v4/cfdi40/{uid}/pdf
GET {BASE_URL}/v4/cfdi40/{uid}/xml

Respuesta: { "data": "BASE64_ENCODED_CONTENT" }
```

---

## Restricciones importantes

- La fecha del CFDI no puede ser mayor a **72 horas** hacia atrás
- El folio es asignado automáticamente — nunca enviarlo en el payload
- Los valores numéricos de impuestos hasta **6 decimales**
- El `Receptor.UID` debe existir previamente en factura.com (creado vía `/v1/clients/create`)
