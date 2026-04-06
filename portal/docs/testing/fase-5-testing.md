# Fase 5 — Testing del Módulo de Facturación

> **Estado**: En progreso
> **Fecha de inicio**: 2026-04-06
> **Responsable**: Jorge Rangel + Claude Code

---

## Objetivo

Implementar una suite de tests automatizados que protejan la lógica de negocio
del sistema de facturación electrónica (CFDI). El foco está en prevenir errores
que causen rechazos del SAT, consumo innecesario de folios o datos fiscales
incorrectos.

---

## Justificación — ¿Por qué testing ahora?

El módulo de facturación ya tiene funcionalidad completa:
- Timbrado PUE, PPD, REP y CFDI Global
- Cancelación ante el SAT
- Sincronización de catálogos con factura.com
- Almacenamiento de XML/PDF en Supabase Storage

Antes de pasar a producción con las 8 empresas emisoras, necesitamos
**garantizar** que:

1. Las validaciones Zod rechazan datos fiscales mal formados
2. Los payloads enviados a factura.com cumplen la estructura esperada
3. Los helpers de API responden en el formato estándar del proyecto
4. Los flujos de timbrado arman correctamente los CFDIs
5. La cancelación y el storage funcionan ante escenarios edge

---

## Stack de Testing

| Herramienta | Rol | Justificación |
|-------------|-----|---------------|
| **Vitest** | Test runner + assertions | Nativo del ecosistema Vite/Next.js, rápido, TypeScript nativo, compatible con path aliases |
| **MSW** (Mock Service Worker) | Mock de APIs externas | Intercepta llamadas HTTP a factura.com sin modificar código de producción |
| **@testing-library/react** | Tests de componentes | Para tests de UI cuando sea necesario (Tier 3) |
| **@testing-library/jest-dom** | Matchers DOM | Extiende expect() con matchers como toBeInTheDocument() |

### ¿Por qué NO TestSprite?

Se evaluó TestSprite (herramienta E2E con IA + MCP) y se descartó porque:
- Nuestro proyecto es ~80% lógica de backend (timbrado, validaciones, APIs)
- El dashboard es visualización simple que no justifica E2E de pago
- Agrega otro SaaS de pago al stack (contradice el objetivo de reducir costos)
- Genera dependencia externa para una capacidad que podemos cubrir con Vitest

---

## Estrategia por Tiers

### Tier 1 — Crítico (Fase 5a)

Lo que protege directamente el timbrado y el dinero del despacho.

| # | Módulo | Archivo | Qué se testea | Tests |
|---|--------|---------|----------------|-------|
| 1 | Validadores Zod | `lib/facturacom/validators.ts` | Schemas CfdiFactura, CfdiRep, Concepto, Receptor. Casos válidos, inválidos, edge cases SAT (6 decimales, RFC, catálogos) | `validators.test.ts` |
| 2 | Helpers de API | `lib/api/helpers.ts` | apiSuccess, apiError, parseJsonBody — formato estándar de respuestas | `helpers.test.ts` |
| 3 | Cliente factura.com | `lib/facturacom/client.ts` | Construcción de requests, headers, manejo de errores HTTP | `client.test.ts` |
| 4 | Timbrado | `lib/facturacom/timbrado.ts` | Flujos PUE, PPD, REP, Global — con mocks de factura.com y Supabase | `timbrado.test.ts` |

### Tier 2 — Importante (Fase 5b)

Sincronización y operaciones secundarias.

| # | Módulo | Archivo | Qué se testea | Tests |
|---|--------|---------|----------------|-------|
| 5 | Cancelación | `lib/facturacom/cancelacion.ts` | Flujo de cancelación, motivos SAT, manejo de errores | `cancelacion.test.ts` |
| 6 | Storage | `lib/facturacom/storage.ts` | Descarga de XML/PDF y subida a Supabase Storage | `storage.test.ts` |
| 7 | Sync clientes | `lib/facturacom/sync-clientes.ts` | Sincronización de receptores con factura.com | `sync-clientes.test.ts` |
| 8 | Sync series | `lib/facturacom/sync-series.ts` | Sincronización de series de facturación | `sync-series.test.ts` |
| 9 | Sync productos | `lib/facturacom/sync-productos.ts` | Sincronización de conceptos/productos | `sync-productos.test.ts` |

### Tier 3 — Complementario (futuro)

| # | Módulo | Qué se testea |
|---|--------|----------------|
| 10 | API Routes | Integración de endpoints con mocks de auth y Supabase |
| 11 | Componentes React | Renderizado de componentes de features (emisores, facturas) |
| 12 | Server Actions | Login, register, logout |

---

## Estructura de archivos

```
app/
├── src/
│   ├── __tests__/                    ← directorio raíz de tests
│   │   ├── setup.ts                  ← configuración global (matchers, mocks)
│   │   ├── lib/
│   │   │   ├── facturacom/
│   │   │   │   ├── validators.test.ts    ← Tier 1
│   │   │   │   ├── client.test.ts        ← Tier 1
│   │   │   │   ├── timbrado.test.ts      ← Tier 1
│   │   │   │   ├── cancelacion.test.ts   ← Tier 2
│   │   │   │   ├── storage.test.ts       ← Tier 2
│   │   │   │   ├── sync-clientes.test.ts ← Tier 2
│   │   │   │   ├── sync-series.test.ts   ← Tier 2
│   │   │   │   └── sync-productos.test.ts← Tier 2
│   │   │   └── api/
│   │   │       └── helpers.test.ts       ← Tier 1
│   │   └── mocks/
│   │       ├── factura-com.ts        ← mocks de respuestas de factura.com
│   │       └── supabase.ts           ← mock del cliente Supabase
│   └── ...
├── vitest.config.ts                  ← configuración de Vitest
└── package.json                      ← scripts: test, test:watch, test:coverage
```

---

## Convenciones de testing

1. **Ubicación**: tests en `src/__tests__/` reflejando la estructura de `src/lib/`
2. **Nomenclatura**: `<nombre-del-módulo>.test.ts`
3. **Idioma**: describes y test names en español
4. **Estructura de cada test**:
   ```typescript
   describe('NombreDelMódulo', () => {
     describe('nombreDeLaFunción', () => {
       it('debería hacer X cuando Y', () => { ... })
       it('debería rechazar cuando Z', () => { ... })
     })
   })
   ```
5. **No testear**:
   - Componentes shadcn/ui (son de terceros)
   - Tipos TypeScript (el compilador los valida)
   - Código trivial (utils.ts con solo `cn()`)
6. **Mocking**:
   - factura.com → MSW para interceptar HTTP
   - Supabase → mock manual del cliente
   - Nunca mockear Zod — siempre validar con los schemas reales

---

## Métricas objetivo

| Métrica | Objetivo Fase 5a | Objetivo Fase 5b |
|---------|-------------------|-------------------|
| Tests escritos | ~30-40 | ~60-80 |
| Cobertura `validators.ts` | >90% | >90% |
| Cobertura `helpers.ts` | >90% | >90% |
| Cobertura `timbrado.ts` | >70% | >80% |
| Cobertura general `lib/` | >50% | >70% |
| Tests pasando | 100% | 100% |

---

## Dependencias a instalar

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom msw @vitejs/plugin-react
```

---

## Scripts npm

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

---

## Actividades — Fase 5a (actual)

| # | Actividad | Estado | Descripción |
|---|-----------|--------|-------------|
| 1 | Instalar dependencias | ⬜ | vitest, testing-library, msw, plugin-react |
| 2 | Configurar Vitest | ⬜ | vitest.config.ts, setup.ts, path aliases, scripts npm |
| 3 | Tests validators.ts | ⬜ | CfdiFacturaSchema, CfdiRepSchema, Concepto, Receptor |
| 4 | Tests helpers.ts | ⬜ | apiSuccess, apiError, parseJsonBody, formatValidationErrors |
| 5 | Ejecutar y verificar | ⬜ | Todos los tests pasando en verde |
| 6 | Actualizar CLAUDE.md | ⬜ | Agregar sección de testing a las instrucciones del proyecto |

## Actividades — Fase 5b (siguiente iteración)

| # | Actividad | Estado | Descripción |
|---|-----------|--------|-------------|
| 7 | Tests client.ts | ⬜ | Mock de factura.com con MSW, headers, errores HTTP |
| 8 | Tests timbrado.ts | ⬜ | Flujos PUE, PPD, REP, Global con mocks completos |
| 9 | Tests cancelacion.ts | ⬜ | Cancelación ante SAT, motivos, errores |
| 10 | Tests storage.ts | ⬜ | Descarga y subida de XML/PDF |
| 11 | Tests sync-*.ts | ⬜ | Sincronización de clientes, series, productos |
| 12 | Coverage report | ⬜ | Configurar reporte de cobertura y validar métricas |

---

## Notas

- Los tests NO consumen folios reales — toda interacción con factura.com se mockea
- Los tests NO requieren conexión a Supabase — el cliente se mockea
- Los tests SÍ usan los schemas Zod reales — nunca mockear validaciones
- El CI/CD en GitHub Actions se configurará después de validar la suite localmente
