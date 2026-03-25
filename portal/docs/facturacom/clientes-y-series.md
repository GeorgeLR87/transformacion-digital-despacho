# factura.com — Clientes y Series
# Fuente: Postman "Factura.com Workspace Publico" · Carpetas: Clientes · Series

---

## CLIENTES (Receptores)

> Base URL: `/v1/clients` — versión v1, no v4.

### Listar clientes

```
GET {BASE_URL}/v1/clients
```

### Consultar cliente por RFC

```
GET {BASE_URL}/v1/clients/{RFC}
```

### Verificar si RFC ya existe

```
GET {BASE_URL}/v1/clients/rfc/{RFC}
```

> Usar este endpoint antes de crear un cliente para evitar duplicados.

### Crear cliente

```
POST {BASE_URL}/v1/clients/create

{
  "nombre": "Nombre",
  "apellidos": "Apellidos (persona física) o vacío para moral",
  "email": "correo@email.com",
  "email2": "",
  "email3": "",
  "telefono": "33 3877 7741",
  "razons": "RAZÓN SOCIAL EXACTA EN MAYÚSCULAS S.A. DE C.V.",
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

**Respuesta exitosa**:
```json
{
  "response": "success",
  "data": {
    "uid": "6169fc02637e1",
    "rfc": "XAXX010101000",
    "razons": "RAZÓN SOCIAL EN MAYÚSCULAS"
  }
}
```

> Guardar el `uid` en `billing_receptores.uid_facturacom`. Este UID es el que se usa en
> `Receptor.UID` al crear una factura — no el RFC directamente.

### Actualizar cliente

```
POST {BASE_URL}/v1/clients/{uid}/update

{
  "nombre": "Nombre Actualizado",
  "razons": "NUEVA RAZÓN SOCIAL S.A. DE C.V.",
  "email": "nuevo@email.com",
  "regimen": 601,
  "codpos": 50000
  ... (mismos campos que crear)
}
```

### Eliminar cliente

```
POST {BASE_URL}/v1/clients/destroy/{uid}
```

### Consultar LCO (Lista de Contribuyentes Obligados)

```
GET {BASE_URL}/v1/clients/lco/{RFC}
```

---

## Notas críticas sobre Clientes

1. **`razons`** debe ir exactamente como aparece en la Constancia de Situación Fiscal del SAT, en MAYÚSCULAS, incluyendo el régimen societario (S.A. DE C.V., etc.)

2. **El `uid` de factura.com es diferente al RFC**. Al crear un cliente, guardar el `uid` en `billing_receptores` — es lo que se usa en todas las facturas.

3. **Regímenes fiscales frecuentes**:
   - `601` — General de Ley Personas Morales
   - `612` — Personas Físicas con Actividades Empresariales y Profesionales
   - `616` — Sin obligaciones fiscales
   - `626` — Régimen Simplificado de Confianza (RESICO)

4. Si el RFC ya existe en factura.com, usar el `uid` existente en lugar de crear uno nuevo.

---

## SERIES

> Base URL: `/v4/series` — versión v4.

### Listar todas las series

```
GET {BASE_URL}/v4/series
```

**Respuesta**:
```json
{
  "response": "success",
  "data": [
    {
      "uid": 17317,
      "letra": "A",
      "tipoDocumento": "factura",
      "folio_actual": 124,
      "status": "active"
    }
  ]
}
```

> `uid` es el número que se pasa en el campo `Serie` al crear una factura.

### Crear nueva serie

```
POST {BASE_URL}/v4/series/create

{
  "letra": "A",
  "tipoDocumento": "factura",
  "folio": 1
}
```

> `tipoDocumento`: `"factura"` · `"nota_credito"` · `"carta_porte_ingreso"` · `"pago"`

### Activar / Desactivar serie

```
POST {BASE_URL}/v4/series/{uid}/up    → Activar
POST {BASE_URL}/v4/series/{uid}/down  → Desactivar
```

### Eliminar serie

```
POST {BASE_URL}/v4/series/{uid}/drop
```

---

## Relación entre Series y el Schema de Supabase

Al hacer setup inicial por RFC emisor:

```typescript
// 1. Crear la serie en factura.com
const serieResponse = await fetch(`${FACTURACOM_URL}/v4/series/create`, {
  method: 'POST',
  headers: facturaComHeaders(empresa.api_key, empresa.secret_key),
  body: JSON.stringify({ letra: 'A', tipoDocumento: 'factura', folio: 1 })
})

// 2. Guardar el uid retornado en Supabase
const serieUid = serieResponse.data.uid // ej: 17317

await supabase.from('billing_series_emisoras').insert({
  empresa_id: empresa.id,
  serie: 'A',
  uid_facturacom: serieUid, // agregar este campo al schema
  es_default: true,
  activa: true
})

// 3. Al crear una factura, recuperar el uid_facturacom de la serie
const { data: serie } = await supabase
  .from('billing_series_emisoras')
  .select('uid_facturacom')
  .eq('empresa_id', empresaId)
  .eq('es_default', true)
  .single()

// 4. Usarlo en el payload
payload.Serie = serie.uid_facturacom // el número, no la letra
```

> **Actualización al schema**: agregar campo `uid_facturacom INTEGER` a `billing_series_emisoras`.

---

## Setup inicial por RFC emisor — checklist

Cuando se agrega una nueva empresa emisora al sistema:

- [ ] Crear el emisor en factura.com (o confirmar que ya existe con sus CSD cargados)
- [ ] Crear la(s) serie(s) vía `/v4/series/create` y guardar los UIDs en `billing_series_emisoras`
- [ ] Crear los receptores frecuentes vía `/v1/clients/create` y guardar sus UIDs en `billing_receptores`
- [ ] Verificar credenciales `F-Api-Key` y `F-Secret-Key` con un request de prueba en sandbox
- [ ] Registrar la empresa en `billing_empresas_emisoras` con su `api_key` y `secret_key`
