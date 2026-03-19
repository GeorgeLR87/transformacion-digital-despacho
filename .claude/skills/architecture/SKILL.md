# Skill: Arquitectura del Sistema de Facturación
# Leer antes de cualquier decisión de diseño o estructura

---

## Capas del sistema

```
CAPA 1 — ENTRADA
└── Bot de Telegram
    · Recibe instrucciones en texto natural y PDFs
    · Muestra previa de factura antes de timbrar
    · Notifica UUID y folio confirmados post-timbrado
    · Operado por el equipo interno del despacho

CAPA 2 — ORQUESTACIÓN
└── N8N (self-hosted en Railway)
    · Recibe webhooks de Telegram
    · Coordina llamadas a Claude API, factura.com y Supabase
    · Maneja reintentos y errores
    · Un workflow por flujo principal (ver skills/n8n-workflows.md)

CAPA 3 — INTELIGENCIA
└── Claude API (claude-sonnet)
    · Interpreta instrucciones de factura en lenguaje natural
    · Extrae datos fiscales de PDFs de constancias SAT
    · Extrae datos de comprobantes bancarios para REPs
    · Valida campos CFDI antes del timbrado

CAPA 4 — DATOS
└── Supabase
    · PostgreSQL para todos los registros
    · Storage para XML y PDF de facturas (independencia del PAC)
    · Auth para acceso diferenciado al Dashboard

CAPA 5 — TIMBRADO
└── factura.com API
    · Timbra el CFDI ante el SAT
    · Regresa UUID, folio, XML firmado y PDF
    · Una API Key por RFC emisor

CAPA 6 — PRESENTACIÓN
└── Dashboard Next.js 14
    · Visualización de facturas con filtros
    · KPIs y alertas
    · Gestión de catálogos
    · Reenvío de facturas por correo
```

---

## Flujo principal — generación de factura

```
1. Usuario envía instrucción por Telegram
   Ejemplo: "factura a CLIENTE X por consultoría 5000 pesos, empresa ABC"

2. N8N recibe webhook → llama Claude API
   Claude interpreta: RFC emisor, receptor, concepto, monto, método pago

3. N8N consulta Supabase
   · Valida que el receptor exista en billing_receptores
   · Recupera datos del receptor (RFC, razón social, régimen, uso CFDI)
   · Recupera concepto del catálogo billing_conceptos (si aplica SKU)
   · Recupera serie activa de billing_series_emisoras

4. N8N genera previa en texto → envía a Telegram
   Usuario revisa datos y responde "confirmar" o "cancelar"

5. Si confirma → N8N llama factura.com API
   · Usa la API Key del RFC emisor (recuperada de billing_empresas_emisoras)
   · factura.com timbra → regresa UUID + folio + XML + PDF

6. N8N descarga XML y PDF → sube a Supabase Storage
   Ruta: facturas/{año}/{mes}/{uuid}.xml y .pdf

7. N8N guarda registro en billing_facturas
   Status: "timbrada"

8. N8N envía correo al receptor (XML + PDF adjuntos)
   Vía servicio de email configurado en N8N (SMTP o API)

9. N8N notifica en Telegram con UUID y folio confirmados
```

---

## Flujo — Complemento de Pago (REP)

```
1. Usuario envía PDF del comprobante bancario por Telegram

2. N8N → Claude API extrae del PDF:
   · Fecha de pago
   · Monto pagado
   · Número de cuenta origen/destino
   · Referencia bancaria

3. N8N consulta billing_facturas para localizar la factura PPD correspondiente
   (por RFC receptor + monto + fecha aproximada)

4. N8N muestra al usuario la factura identificada → solicita confirmación

5. Si confirma → N8N llama factura.com API para generar REP
   Vinculado al UUID de la factura PPD original

6. N8N descarga y guarda en Supabase Storage
   N8N registra en billing_pagos

7. N8N envía REP por correo al receptor
```

---

## Flujo — Alta de nuevo emisor/receptor vía Dashboard

```
1. Administrador sube PDF de constancia de situación fiscal al Dashboard

2. Dashboard envía PDF a API Route /api/v1/fiscal/extract

3. API Route → Claude API extrae:
   · RFC, razón social, régimen fiscal, CP, domicilio

4. Dashboard pre-llena formulario con los datos extraídos

5. Administrador revisa, corrige si hay error, y guarda

6. Se registra en billing_empresas_emisoras o billing_receptores
```

---

## Decisiones de arquitectura tomadas

| Decisión | Elección | Razón |
|----------|----------|-------|
| Interfaz de entrada | Telegram (no WhatsApp) | Gratuito, sin restricciones, API nativa robusta, ideal uso interno B2B |
| Orquestador | N8N self-hosted | Control total, costo fijo, sin vendor lock-in |
| PAC | factura.com | Ya contratado, API bien documentada |
| Storage de XMLs | Supabase Storage | Independencia total de factura.com para archivos históricos |
| Auth del Dashboard | Supabase Auth | Nativo en el mismo stack, sin servicios adicionales |
| API Keys de factura.com | En DB (billing_empresas_emisoras) | No en .env porque son 8 distintas y cambian por RFC |

---

## Límites del sistema (v1)

- Máximo 8 RFC emisores
- No incluye cancelación de facturas
- No incluye portal de clientes externos
- No incluye módulos: cobranza, RH, chatbot fiscal
