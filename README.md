# Datify Landing Page

Sitio web corporativo de Datify construido con Next.js 15, TypeScript y Tailwind CSS v4.

## 🚀 Deploy en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/godatify-landing)

### Pasos para Deploy

1. **Conectar con Vercel**:
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Deploy a Producción**:
   ```bash
   vercel --prod
   ```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start
```

## 📁 Estructura del Proyecto

```
godatify-landing/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── layout.tsx          # Layout principal con metadata
│   │   ├── page.tsx            # Página de inicio
│   │   └── globals.css         # Estilos globales
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Navegación
│   │   │   └── Footer.tsx      # Pie de página
│   │   ├── sections/
│   │   │   ├── Hero.tsx        # Sección hero
│   │   │   ├── Nosotros.tsx    # Stats y video
│   │   │   ├── Services.tsx    # Grid de servicios
│   │   │   ├── Cases.tsx       # Casos de éxito
│   │   │   └── Testimonials.tsx # Carousel
│   │   └── ui/
│   │       └── ScrollReveal.tsx # Animaciones scroll
│   └── lib/
│       └── data/               # Datos JSON
├── public/
│   └── images/                 # Imágenes estáticas
└── old-html-version/           # Backup proyecto original
```

## 🎨 Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Fuentes**: Barlow (Google Fonts)
- **Iconos**: Font Awesome 6.4.0
- **Optimización**: Next.js Image

## 🎯 Características

- ✅ SEO optimizado con metadata
- ✅ Responsive design (mobile-first)
- ✅ Animaciones scroll reveal
- ✅ Carousel de testimonios
- ✅ Optimización de imágenes
- ✅ TypeScript para type safety
- ✅ Preparado para CMS (Sanity.io)

## 📝 Variables de Entorno

No se requieren variables de entorno para el despliegue básico.

Para integración futura con CMS:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
```

## 🔧 Configuración de Vercel

El proyecto está configurado para auto-deploy en Vercel:

1. **Framework Preset**: Next.js
2. **Build Command**: `npm run build`
3. **Output Directory**: `.next`
4. **Install Command**: `npm install`
5. **Development Command**: `npm run dev`

## 📊 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🚀 Próximos Pasos

1. Configurar dominio personalizado en Vercel
2. Integrar Sanity.io para CMS
3. Agregar Google Analytics 4
4. Implementar formulario de contacto
5. Crear páginas dinámicas para blog

## 📄 Licencia

© 2024 Datify. Todos los derechos reservados.

## 👥 Soporte

Para soporte o preguntas: contacto@godatify.com
