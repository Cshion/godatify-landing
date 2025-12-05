# Datify Landing Page - Next.js 15

Sitio web corporativo de Datify construido con Next.js 15, TypeScript y Tailwind CSS v4.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Fuentes**: Barlow (Google Fonts)
- **Iconos**: Font Awesome 6.4.0
- **Imágenes**: Next.js Image Optimization

## 📁 Estructura del Proyecto

```
godatify-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principal con metadata
│   │   ├── page.tsx             # Página de inicio
│   │   └── globals.css          # Estilos globales y tema
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Navegación principal
│   │   │   └── Footer.tsx       # Pie de página
│   │   └── sections/
│   │       ├── Hero.tsx         # Sección hero
│   │       ├── Nosotros.tsx     # Stats y video
│   │       ├── Services.tsx     # Grid de servicios
│   │       ├── Cases.tsx        # Casos de éxito
│   │       └── Testimonials.tsx # Carousel de testimonios
│   └── lib/
│       └── data/
│           ├── services.json    # Datos de servicios
│           ├── cases.json       # Datos de casos
│           └── testimonials.json # Datos de testimonios
├── public/
│   └── images/                  # Imágenes estáticas
└── package.json
```

## 🎨 Características

### Componentes Implementados

✅ **Header**
- Navegación responsive
- Estado transparente sobre hero
- Cambio de estilo al hacer scroll
- Dropdown de servicios
- Menú móvil
- Links sociales

✅ **Hero**
- Imagen de fondo con overlay degradado
- Animaciones de entrada
- CTA button
- Scroll indicator

✅ **Nosotros**
- Contadores animados (Intersection Observer)
- Video embed de YouTube
- Grid responsive de estadísticas

✅ **Servicios**
- Grid responsive (3→2→1 columnas)
- Cards con hover effects
- Iconos Font Awesome
- Datos desde JSON

✅ **Casos de Éxito**
- Grid de imágenes optimizadas
- Overlay con CTA al hover
- Category tags
- Next.js Image component

✅ **Testimonios**
- Carousel con 3 testimonios por vista
- Auto-play (5 segundos)
- Controles de navegación
- Dots indicator
- Responsive (3→2→1)

✅ **Footer**
- Layout multi-columna
- Enlaces rápidos
- Links sociales
- Responsive

## 🚀 Comandos

### Desarrollo
```bash
npm run dev
```
Inicia el servidor de desarrollo en http://localhost:3000

### Build
```bash
npm run build
```
Crea el build de producción

### Producción
```bash
npm start
```
Inicia el servidor de producción

### Linting
```bash
npm run lint
```

## 🎨 Colores de Marca

```css
--color-brand-green: #1C7C54        /* Verde principal */
--color-brand-green-light: #26a86f  /* Verde claro */
--color-brand-green-dark: #135c51   /* Verde oscuro */
```

## 📝 Gestión de Contenido

Actualmente, el contenido se gestiona mediante archivos JSON en `src/lib/data/`:

### services.json
```json
{
  "id": "dp",
  "title": "Digital Platform",
  "description": "...",
  "icon": "laptop-code"
}
```

### cases.json
```json
{
  "id": "kpis-comerciales",
  "title": "KPIs Comerciales",
  "category": "Business Intelligence",
  "description": "...",
  "image": "/images/cases/..."
}
```

### testimonials.json
```json
{
  "id": 1,
  "text": "...",
  "author": "...",
  "role": "..."
}
```

## 🔄 Próximos Pasos

### Fase 1: CMS Integration (Recomendado)
1. Configurar Sanity.io
2. Crear schemas para Blog, Cases, Testimonials
3. Migrar datos JSON a Sanity
4. Actualizar componentes para usar Sanity Client

### Fase 2: Páginas Dinámicas
1. `/servicios/[slug]` - Páginas individuales de servicios
2. `/casos/[slug]` - Páginas individuales de casos
3. `/blog` - Listado de posts
4. `/blog/[slug]` - Posts individuales

### Fase 3: Features Adicionales
1. Formulario de contacto funcional
2. Newsletter signup
3. Google Analytics 4
4. Search functionality

## 🔧 Configuración de Sanity (Opcional)

```bash
# Instalar dependencias
npm install @sanity/client @sanity/image-url next-sanity

# Inicializar Sanity
npx sanity init
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌐 SEO

El proyecto incluye:
- Metadata optimizada en `layout.tsx`
- Open Graph tags
- Twitter Cards
- Semantic HTML
- Image optimization automática

## 📦 Dependencias Principales

```json
{
  "next": "16.0.7",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "tailwindcss": "^4.0.0",
  "typescript": "^5.0.0"
}
```

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Otras opciones
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker

## 📄 Licencia

© 2024 Datify. Todos los derechos reservados.

## 👥 Soporte

Para soporte o preguntas, contacta a: [contacto@godatify.com](mailto:contacto@godatify.com)
