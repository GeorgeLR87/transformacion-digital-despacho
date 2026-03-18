# factura.com — Complemento de Pago v2.0 (REP)
# Fuente: Postman "Factura.com Workspace Publico" · Carpeta: Complementos

---

## Endpoint

```
POST {BASE_URL}/v4/cfdi40/create
```

> El REP usa el mismo endpoint que una factura ordinaria — se diferencia por `TipoCfdi: "pago"`.

## Headers obligatorios

```
Content-Type:  application/json
F-PLUGIN:      9d4095c8f7ed5785cb14c0e3b033eeb8252416ed
F-Api-Key:     {API_KEY_DEL_RFC_EMISOR}
F-Secret-Key:  {SECRET_KEY_DEL_RFC_EMISOR}
```

---

## Payload completo

```json
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
  "EnviarCorreo": false,
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

---

## Campos críticos del REP — referencia

| Campo | Valor | Notas |
|-------|-------|-------|
| `TipoCfdi` | `"pago"` | Diferente a `TipoDocumento`. Obligatorio para REPs |
| `UsoCFDI` | `"CP01"` | Fijo para todos los complementos de pago |
| `Moneda` | `"XXX"` | **Siempre XXX** en el comprobante (norma SAT CFDI 4.0) |
| `Conceptos` | Ver payload | **Siempre fijos** — no varían entre REPs |
| `Pagos[].MonedaP` | `"MXN"` | Moneda real en que se realizó el pago |
| `Pagos[].TipoCambioP` | `0` o tasa | `0` si MonedaP = MXN. Tasa real si es divisa |
| `Pagos[].DoctoRelacionado[].IdDocumento` | UUID SAT | **UUID fiscal del SAT** de la factura PPD original |
| `Pagos[].DoctoRelacionado[].ImpSaldoAnt` | monto | Saldo pendiente ANTES de este pago |
| `Pagos[].DoctoRelacionado[].ImpPagado` | monto | Lo que se paga en esta exhibición |
| `Pagos[].DoctoRelacionado[].ImpSaldoInsoluto` | monto | Saldo pendiente DESPUÉS del pago |
| `Pagos[].DoctoRelacionado[].NumParcialidad` | `"1"`, `"2"`... | Número de pago parcial |
| `Impuestos.Trasaldos` | array | **Con esta ortografía** — así está en la API. No es error |

---

## Caso: Pago parcial (múltiples parcialidades)

Si el cliente paga en partes, incrementar `NumParcialidad` y recalcular saldos:

```json
{
  "NumParcialidad": "2",
  "ImpSaldoAnt": "5800.00",
  "ImpPagado": "2900.00",
  "ImpSaldoInsoluto": "2900.00"
}
```

---

## Caso: Un pago cubre múltiples facturas PPD

Agregar un objeto más en `DoctoRelacionado[]`:

```json
"DoctoRelacionado": [
  {
    "IdDocumento": "UUID-SAT-FACTURA-1",
    ...
    "ImpPagado": "3000.00",
    "ImpSaldoInsoluto": "0.00"
  },
  {
    "IdDocumento": "UUID-SAT-FACTURA-2",
    ...
    "ImpPagado": "2800.00",
    "ImpSaldoInsoluto": "0.00"
  }
]
```

---

## Flujo completo en N8N para generar REP

```
1. Operador envía comprobante bancario PDF por Telegram

2. N8N → Claude API extrae del PDF:
   { fecha_pago, monto, referencia, banco }

3. N8N → Supabase: busca factura PPD pendiente
   SELECT * FROM billing_facturas
   WHERE metodo_pago = 'PPD'
   AND status = 'timbrada'
   AND receptor_id = (RFC identificado)
   AND total = monto_extraido

4. N8N → Telegram: muestra factura encontrada, pide confirmación

5. Si confirma → N8N construye payload REP con:
   - Receptor.UID del cliente en factura.com
   - IdDocumento = billing_facturas.uuid_sat
   - ImpSaldoAnt = billing_pagos anterior o billing_facturas.total
   - ImpPagado = monto del comprobante
   - ImpSaldoInsoluto = ImpSaldoAnt - ImpPagado

6. N8N → POST /v4/cfdi40/create (REP)

7. Si success → descargar PDF+XML → Supabase Storage
   → INSERT billing_pagos
   → UPDATE billing_facturas (si saldo = 0, marcar complementada)
   → Enviar REP por correo al receptor
   → Notificar Telegram con UUID del REP
```

---

## Respuesta exitosa

```json
{
  "response": "success",
  "data": {
    "uid": "63ebd090d6016",
    "uuid": "UUID-SAT-DEL-REP",
    "status": "active"
  }
}
```

Guardar en `billing_pagos.uuid_sat_rep` y descargar PDF/XML con el `uid`.
