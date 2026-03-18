# HANDOFF: Setup inicial del proyecto de facturación
# Ejecutar en Claude Code desde la carpeta raíz del monorepo

## Contexto
Sistema de automatización de facturación CFDI para ASC Auditores.
8 empresas emisoras. Stack: Next.js 14 + Supabase + N8N + Claude API + factura.com.

## Lo que se va a construir en este setup

1. Estructura de carpetas del monorepo
2. Scaffolding del dashboard Next.js 14 con App Router
3. Configuración de TypeScript strict
4. Instalación de shadcn/ui y componentes base
5. Configuración del cliente Supabase (browser + server)
6. Archivo .env.example con todas las variables requeridas
7. Estructura de carpetas src/ completa

## Decisiones ya tomadas

- Framework: Next.js 14 App Router (no Pages Router)
- Estilos: Tailwind CSS + shadcn/ui
- DB: Supabase con prefijo billing_ en todas las tablas
- TypeScript: strict mode activado
- Carpeta del módulo: transformacion-digital-despacho/facturacion/dashboard/

## Restricciones

- No instalar react-router — Next.js maneja el routing
- No usar `any` en TypeScript
- No modificar archivos en src/components/ui/ (son de shadcn/ui)
- No crear lógica de negocio en componentes — va en /lib o API Routes

## Primer comando para Claude Code

"Lee el CLAUDE.md y las skills en .claude/skills/ y luego:
1. Inicializa el proyecto Next.js 14 en la carpeta dashboard/ con: npx create-next-app@latest dashboard --typescript --tailwind --eslint --app --src-dir --import-alias '@/*'
2. Crea la estructura de carpetas src/ definida en architecture.md
3. Instala shadcn/ui y configura el theme
4. Crea los clientes de Supabase en src/lib/supabase/
5. Crea el .env.example con las variables del CLAUDE.md
6. Crea el .env.local vacío con las mismas keys para que yo llene los valores
7. Haz el primer commit con el mensaje: 'feat: scaffold inicial del dashboard de facturación'"
