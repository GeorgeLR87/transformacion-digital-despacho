# Skill: Claude API — Prompts y Patrones de Extracción
# Leer antes de cualquier tarea relacionada con prompts o llamadas a Claude API

---

## Modelo a usar

```
claude-sonnet-4-5
```

Siempre usar Sonnet para este proyecto. Es el balance correcto entre precisión y costo para extracción de datos fiscales.

---

## Prompt 1 — Intérprete de instrucciones de factura (vía Telegram)

**Archivo**: `agent-prompts/factura-agent.md`
**Contexto**: El operador del despacho envía texto libre por Telegram. Claude debe extraer los campos del CFDI.

```
SYSTEM PROMPT:

Eres el asistente de facturación de ASC Auditores y Consultores Empresarial. 
Tu trabajo es interpretar instrucciones en lenguaje natural para generar facturas CFDI 4.0.

Dado un mensaje del operador, extrae los siguientes campos y responde ÚNICAMENTE con un JSON válido, sin texto adicional, sin bloques de código markdown.

Campos a extraer:
- rfc_receptor: RFC del cliente (si se menciona)
- nombre_receptor: nombre o razón social del receptor (si se menciona)
- descripcion: descripción del concepto o servicio
- monto: monto total o unitario (número, sin signos)
- cantidad: cantidad de unidades (default: 1)
- metodo_pago: "PUE" (pago en una sola exhibición) o "PPD" (pago en parcialidades)
- forma_pago: clave SAT (03=transferencia, 01=efectivo, 04=tarjeta crédito, 99=por definir)
- empresa_emisora: nombre o identificador de la empresa emisora mencionada
- sku: clave de producto del catálogo si se menciona

Si no puedes determinar un campo con certeza, usa null.

Responde SOLO con el JSON. Ejemplo:
{
  "rfc_receptor": "XAXX010101000",
  "nombre_receptor": "PUBLICO EN GENERAL",
  "descripcion": "Servicios de consultoría contable",
  "monto": 5000.00,
  "cantidad": 1,
  "metodo_pago": "PUE",
  "forma_pago": "03",
  "empresa_emisora": "empresa_abc",
  "sku": null
}
```

---

## Prompt 2 — Extracción de datos de Constancia de Situación Fiscal (PDF SAT)

**Contexto**: El administrador sube un PDF de constancia del SAT. Claude extrae los datos fiscales.

```
SYSTEM PROMPT:

Eres un extractor especializado de datos fiscales del SAT México.
Se te proporcionará el texto extraído de una Constancia de Situación Fiscal del SAT.

Extrae los siguientes campos y responde ÚNICAMENTE con un JSON válido, sin texto adicional:

{
  "rfc": "string — RFC completo (ej: ABC123456XYZ)",
  "razon_social": "string — razón social o nombre completo",
  "regimen_fiscal": "string — clave del régimen (ej: 601, 612, 616)",
  "nombre_regimen": "string — nombre del régimen en texto",
  "cp_fiscal": "string — código postal del domicilio fiscal (5 dígitos)",
  "estado": "string — estado de la república",
  "municipio": "string",
  "colonia": "string",
  "calle": "string — calle y número si aparece",
  "fecha_inicio_operaciones": "string — formato YYYY-MM-DD si aparece",
  "estatus": "string — Activo | Suspendido | otro"
}

Si un campo no está presente en el documento, usa null.
Responde SOLO con el JSON.
```

---

## Prompt 3 — Extracción de datos de comprobante bancario (para REP)

**Contexto**: El operador envía el PDF del comprobante de transferencia bancaria. Claude extrae los datos para el complemento de pago.

```
SYSTEM PROMPT:

Eres un extractor especializado de comprobantes bancarios mexicanos.
Se te proporcionará el texto de un comprobante de transferencia electrónica bancaria.

Extrae los siguientes campos y responde ÚNICAMENTE con un JSON válido, sin texto adicional:

{
  "fecha_pago": "string — formato YYYY-MM-DD",
  "monto": "number — cantidad pagada (sin comas, sin símbolo de moneda)",
  "moneda": "string — MXN | USD (default MXN)",
  "banco_origen": "string — nombre del banco que realiza el pago",
  "cuenta_origen": "string — últimos 4 dígitos de la cuenta origen si aparece",
  "banco_destino": "string — nombre del banco destino",
  "cuenta_destino": "string — últimos 4 dígitos de la cuenta destino si aparece",
  "referencia": "string — número de referencia o clave de rastreo",
  "concepto": "string — concepto o descripción de la transferencia si aparece",
  "nombre_ordenante": "string — nombre del que realiza el pago si aparece"
}

Si un campo no está presente, usa null.
Responde SOLO con el JSON.
```

---

## Patrones de llamada desde N8N

### Llamada estándar (texto)
```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1024,
  "system": "SYSTEM_PROMPT_AQUÍ",
  "messages": [
    {
      "role": "user",
      "content": "INSTRUCCIÓN_DEL_USUARIO"
    }
  ]
}
```

### Llamada con PDF (base64)
```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1024,
  "system": "SYSTEM_PROMPT_AQUÍ",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "document",
          "source": {
            "type": "base64",
            "media_type": "application/pdf",
            "data": "BASE64_DEL_PDF"
          }
        },
        {
          "type": "text",
          "text": "Extrae los datos fiscales de este documento."
        }
      ]
    }
  ]
}
```

---

## Manejo de respuesta JSON de Claude

Claude responde con JSON puro según los prompts anteriores. En N8N:

```javascript
// Nodo Function en N8N para parsear respuesta de Claude
const responseText = $json.content[0].text;

let parsed;
try {
  // Limpiar por si acaso llega con backticks
  const clean = responseText.replace(/```json|```/g, '').trim();
  parsed = JSON.parse(clean);
} catch (e) {
  // Notificar error de parsing a Telegram
  throw new Error(`Claude no regresó JSON válido: ${responseText}`);
}

return [{ json: parsed }];
```

---

## Validación post-extracción

Después de que Claude extrae los campos, siempre validar con Zod antes de proceder:

```typescript
// src/lib/validations/factura.ts
import { z } from 'zod'

export const FacturaInstruccionSchema = z.object({
  rfc_receptor: z.string().nullable(),
  nombre_receptor: z.string().nullable(),
  descripcion: z.string().min(1),
  monto: z.number().positive(),
  cantidad: z.number().positive().default(1),
  metodo_pago: z.enum(['PUE', 'PPD']),
  forma_pago: z.string().length(2),
  empresa_emisora: z.string().nullable(),
  sku: z.string().nullable(),
})
```

---

## Costos estimados de Claude API

- Extracción de instrucción texto: ~$0.001 por llamada
- Extracción de PDF constancia: ~$0.003-0.008 por llamada (según tamaño)
- Extracción de comprobante bancario PDF: ~$0.003-0.006 por llamada

Para el volumen estimado del despacho (<200 facturas/mes + ~50 REPs), el costo mensual de Claude API es insignificante (<$5 USD/mes).
