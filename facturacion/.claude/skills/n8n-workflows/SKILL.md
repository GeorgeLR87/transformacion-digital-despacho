# Skill: N8N Workflows — Estructura y Patrones
# Leer antes de diseñar o modificar cualquier flujo de N8N

---

## Setup de N8N self-hosted

- **Hosting**: Railway (recomendado) o Render
- **Imagen Docker**: `n8nio/n8n:latest`
- **Costo estimado**: ~$5 USD/mes en Railway
- **Variables de entorno requeridas en Railway**:

```env
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=contraseña_segura
WEBHOOK_URL=https://tu-app.up.railway.app
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=...     # puede usar Supabase como DB de N8N también
ANTHROPIC_API_KEY=...
```

---

## Workflows del módulo (un archivo JSON por workflow)

Guardar exports en `/facturacion/n8n-workflows/`

| Archivo | Descripción |
|---------|-------------|
| `01-factura-nueva.json` | Flujo principal: Telegram → timbrado → correo |
| `02-complemento-pago.json` | REP desde comprobante bancario PDF |
| `03-alta-receptor.json` | Alta rápida de receptor desde Telegram |
| `04-consulta-facturas.json` | Consulta de facturas por Telegram |
| `05-alertas-ppd.json` | Cron: detectar PPDs sin complemento y alertar |

---

## Estructura estándar de un workflow

Cada workflow sigue este patrón de nodos:

```
[Trigger]
  → [Validar entrada]
  → [Recuperar datos Supabase]
  → [Procesar con Claude API] (si aplica)
  → [Lógica de negocio]
  → [Acción principal] (factura.com, Supabase, email)
  → [Manejo de error]
  → [Notificación Telegram]
```

---

## Nodos frecuentes y configuración

### Webhook Telegram
```json
{
  "type": "n8n-nodes-base.webhook",
  "path": "telegram-facturacion",
  "method": "POST",
  "authentication": "headerAuth"
}
```

### HTTP Request a Supabase (GET)
```json
{
  "url": "={{ $env.SUPABASE_URL }}/rest/v1/billing_receptores",
  "method": "GET",
  "headers": {
    "apikey": "={{ $env.SUPABASE_SERVICE_ROLE_KEY }}",
    "Authorization": "Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}"
  },
  "queryParameters": {
    "rfc": "eq.{{ $json.rfc }}"
  }
}
```

### HTTP Request a Claude API
```json
{
  "url": "https://api.anthropic.com/v1/messages",
  "method": "POST",
  "headers": {
    "x-api-key": "={{ $env.ANTHROPIC_API_KEY }}",
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
  },
  "body": {
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": "={{ $json.system_prompt }}",
    "messages": [{ "role": "user", "content": "={{ $json.user_message }}" }]
  }
}
```

### Enviar mensaje a Telegram
```json
{
  "type": "n8n-nodes-base.telegram",
  "operation": "sendMessage",
  "chatId": "={{ $json.telegram_chat_id }}",
  "text": "={{ $json.mensaje }}"
}
```

### Esperar respuesta Telegram (confirmación)
Usar nodo **Wait** con tipo `webhook` y un segundo webhook específico para recibir la confirmación del usuario. El chat_id y un token de sesión se guardan temporalmente en Supabase o en memoria de N8N.

---

## Manejo de errores en N8N

- Activar **"Error Workflow"** en la configuración del workflow para capturar fallos no manejados.
- En cada nodo crítico (factura.com, Supabase insert), agregar un nodo **IF** después para verificar el status de la respuesta.
- Si hay error → nodo **Telegram** notifica al operador con el mensaje de error y el contexto.
- Nunca dejar un flujo sin manejo de error en el nodo de timbrado.

```
[HTTP factura.com] → [IF status === "success"]
                          SÍ → continuar flujo normal
                          NO → [Set: mensaje_error] → [Telegram: notificar error]
                               → [Supabase: registrar intento fallido]
```

---

## Variables de entorno en N8N (acceso con `$env.`)

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
TELEGRAM_BOT_TOKEN
SMTP_HOST / SMTP_USER / SMTP_PASS   (para envío de correos)
FACTURACOM_ENV   (sandbox | production)
```

---

## Cron workflow — Alertas PPD sin complemento

```
Trigger: Cron — todos los lunes a las 9:00 AM
  → [Supabase: SELECT facturas PPD timbradas sin billing_pagos, > 30 días]
  → [IF: hay facturas pendientes]
      SÍ → [Loop: por cada factura]
               → [Telegram: alerta al admin con datos de la factura]
      NO → [No hacer nada]
```

---

## Convenciones de N8N para este proyecto

- Nombrar cada nodo descriptivamente en español: "Obtener datos receptor", "Timbrar en factura.com", etc.
- Usar **expresiones** (`={{ }}`) para valores dinámicos, nunca valores hardcodeados en nodos.
- Exportar workflows regularmente a `/n8n-workflows/` en el repo.
- Mantener un workflow de prueba separado (`00-sandbox-test.json`) para probar nodos individuales.
