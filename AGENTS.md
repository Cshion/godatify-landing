# AGENTS.md - Protocolo de Colaboración y Arquitectura

## 1. Visión General
Este repositorio aloja la solución digital corporativa de **Datify**, compuesta por usuarios frontales y administrativos.

## 2. Stack Tecnológico

### Frontend (`/frontend`)
- **Framework**: Next.js 16 (App Router).
- **Lenguaje**: TypeScript.
- **Estilos**: Tailwind CSS v4 + CSS Modules.

### Backend (`/backend`)
- **CMS**: Strapi v5 (Self-hosted).
- **Database**:
  - **Dev**: SQLite (default). Auto-seeds Master + Mock Data.
  - **Prod**: PostgreSQL (Supabase). Auto-seeds Master Data only.
- **Seeding Logic**: Implementada en `src/index.ts`. Lee de `/seed-data`.
- **Rol**: Gestión de contenidos y API REST.

## 3. Arquitectura del Proyecto

### Estructura de Directorios
El repositorio está organizado como un **Monorepo** (o estructura modular):

```
/
├── frontend/         # Aplicación Next.js (Landing Page)
│   ├── src/
│   │   ├── app/              # App Router (Páginas y Layouts)
│   │   ├── components/       # Componentes de UI
│   │   │   ├── layout/       # Footer, Header
│   │   │   ├── sections/     # Secciones completas de página
│   │   │   ├── common/       # UI Reutilizable
│   │   │   └── blog/         # Componentes del Blog
│   │   ├── data/             # Datos estáticos/Mock
│   │   ├── lib/              # Lógica de negocio (API Layer)
│   │   └── types/            # Definiciones de TypeScript
│   └── ...config files
├── backend/          # (Futuro) Servicios de Backend
└── AGENTS.md         # Protocolo de colaboración
```

### Patrones de Diseño
1.  **Capa de Abstracción de Datos (DAL)**:
    - **Regla**: Los componentes de UI NUNCA deben importar datos directamente de `src/data`.
    - **Patrón**: Usar `src/lib/api.ts`.
    - **Motivo**: Permite cambiar `src/data` por una llamada a una API real (CMS) en el futuro tocando solo un archivo.

2.  **Server vs Client Components**:
    - Por defecto, todo es Server Component (`page.tsx`).
    - Usar `'use client'` solo en las hojas de los componentes que requieren interactividad (Hooks, Event Listeners).
    - **Excepción**: `Header` y `PageHero` suelen requerir estado de scroll/animación.
    - **Manejo de Estilos**: Preferimos CSS Modules para estilos específicos de componentes para evitar colisiones, complementado con Tailwind para layout y espaciado.

3.  **Estilizado Híbrido (Robustez)**:
    - Cuando Tailwind (`v4`) presenta inconsistencias con clases dinámicas o arbitrarias (`pt-[2em]`), se prioriza el uso de estilos en línea (`style={{ paddingTop: '2em' }}`) o CSS Modules para garantizar la aplicación visual sin depender de la compilación JIT en casos borde.

## 4. Buenas Prácticas Implementadas

### SEO y Rendimiento
- **Imágenes**: Uso obligatorio de `next/image` con `width/height` o `fill`.
- **Fuentes**: Uso de `next/font/google` para evitar CLS (Cumulative Layout Shift).
- **Metadatos**: Definidos en `layout.tsx` y páginas individuales vía API.

### Seguridad de Hidratación (Hydration Safety)
- **Problema**: Extensiones del navegador o diferencias de hora servidor/cliente pueden causar errores de hidratación ("Text content does not match...").
- **Solución**:
    - `suppressHydrationWarning` en el tag `<html>` (para extensiones).
    - `suppressHydrationWarning` en elementos dinámicos puros (ej. año en Footer).
    - Evitar anidación HTML inválida (ej. `<div>` dentro de `<p>`).

### UX y Estandares Visuales
- **Espaciado (Whitespace)**: Priorizamos "aire" entre secciones para un look premium.
    - *Estándar*: Padding top de `14rem` en Heros para evitar colisión con el Navbar flotante.
    - *Estándar*: Márgenes amplios (`mt-40`) en listados para separar del Hero en vistas internas.
- **Navbar**: Transparente al inicio, fondo sólido/glassmorphism al hacer scroll (`Header.module.css`).
- **Botones**: "Contáctanos" mantiene jerarquía visual alta (font-weight 600, padding extra, fuente Barlow).

## 5. Flujo de Trabajo para Agentes (Ramp Up)

1.  **Lectura de Datos**:
    - Si necesitas agregar texto, revisa `src/data/*.ts`.
    - Si necesitas exponer ese texto, actualiza `src/lib/api.ts`.

2.  **Creación de Componentes**:
    - Crea el componente en `src/components/seccion/Nombre.tsx`.
    - Crea su CSS Module `src/components/seccion/Nombre.module.css`.
    - Importa y usa en `src/app/page.tsx` pasando los datos vía props.

3.  **Debug**:
    - Si ves errores de hidratación, revisa: 1) Extensiones, 2) Fechas/Randoms, 3) Nesting HTML.
    - Para ajustes finos de diseño que Tailwind ignora, usa CSS clásico en el módulo o inline styles si es un parche rápido y necesario.

---
**Generado por**: Antigravity Project Agent
**Fecha**: 07/12/2025
