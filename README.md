# Datify Landing Page

Clon moderno y optimizado de la página web godatify.com, construido con HTML, CSS y JavaScript vanilla para facilitar actualizaciones rápidas sin depender de WordPress.

## 🚀 Características

- **Diseño Moderno**: Interfaz premium con gradientes, animaciones y efectos visuales
- **Totalmente Responsive**: Optimizado para todos los dispositivos (móvil, tablet, desktop)
- **Performance Optimizada**: Carga rápida con lazy loading y optimizaciones
- **Fácil de Actualizar**: Código limpio y bien organizado sin dependencias complejas
- **SEO Friendly**: Meta tags optimizados y estructura semántica HTML5
- **Animaciones Suaves**: Scroll reveal, contadores animados, y efectos parallax

## 📁 Estructura del Proyecto

```
godatify-landing/
├── index.html              # Página principal
├── css/
│   ├── reset.css          # Reset CSS moderno
│   ├── variables.css      # Variables del sistema de diseño
│   ├── global.css         # Estilos globales y utilidades
│   ├── header.css         # Estilos del header/navegación
│   ├── hero.css           # Estilos de la sección hero
│   ├── services.css       # Estilos de servicios
│   ├── cases.css          # Estilos de casos de éxito
│   ├── testimonials.css   # Estilos del carrusel de testimonios
│   └── footer.css         # Estilos del footer
├── js/
│   ├── main.js            # JavaScript principal
│   ├── navigation.js      # Funcionalidad de navegación
│   ├── animations.js      # Animaciones y scroll reveal
│   └── carousel.js        # Carrusel de testimonios
└── README.md              # Este archivo
```

## 🎨 Secciones Principales

1. **Header/Navegación**
   - Navegación sticky con efecto al hacer scroll
   - Menú desplegable para servicios
   - Menú hamburguesa responsive para móvil
   - Enlaces a redes sociales

2. **Hero Section**
   - Título principal con gradiente animado
   - Call-to-action destacado
   - Elementos decorativos flotantes
   - Indicador de scroll

3. **Nosotros**
   - Estadísticas con contadores animados
   - Tarjetas con efectos hover

4. **Servicios**
   - Grid responsive de 5 servicios
   - Iconos personalizados
   - Efectos hover premium
   - Enlaces a páginas de detalle

5. **Casos de Éxito**
   - Grid de proyectos con imágenes
   - Overlay con efecto hover
   - Categorización por tipo de servicio

6. **Testimonios**
   - Carrusel automático
   - Controles de navegación
   - Soporte para gestos táctiles
   - Indicadores de posición (dots)

7. **Footer**
   - Información corporativa
   - Enlaces rápidos organizados
   - Redes sociales
   - Diseño con gradiente oscuro

## 🛠️ Cómo Usar

### Visualización Local

1. **Opción Simple**: Abre `index.html` directamente en tu navegador

2. **Opción con Servidor Local** (recomendado):
   ```bash
   # Si tienes Python 3 instalado:
   python3 -m http.server 8000
   
   # O con Node.js (npx):
   npx serve
   ```
   Luego abre `http://localhost:8000` en tu navegador

### Actualizar Contenido

#### Cambiar Textos
- Abre `index.html` y busca el texto que deseas cambiar
- Los textos están claramente organizados por secciones

#### Cambiar Colores
- Abre `css/variables.css`
- Modifica las variables CSS en la sección `:root`
- Los cambios se aplicarán automáticamente en todo el sitio

#### Agregar/Modificar Servicios
- En `index.html`, busca la sección `<!-- Services Section -->`
- Copia una tarjeta de servicio existente y modifica el contenido
- Los iconos usan Font Awesome (busca iconos en https://fontawesome.com)

#### Agregar/Modificar Casos de Éxito
- En `index.html`, busca la sección `<!-- Cases Section -->`
- Copia una tarjeta de caso existente
- Reemplaza la URL de la imagen y el texto

#### Agregar/Modificar Testimonios
- En `index.html`, busca la sección `<!-- Testimonials Section -->`
- Copia una tarjeta de testimonio existente
- El carrusel se actualizará automáticamente

## 🎯 Personalización Avanzada

### Cambiar Fuentes
Edita el import en `css/global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=TuFuente:wght@300;400;700&display=swap');
```

### Ajustar Animaciones
- Velocidad: Modifica las variables `--transition-*` en `css/variables.css`
- Efectos: Edita `js/animations.js`

### Modificar Carrusel
- Velocidad de autoplay: Edita el valor en `js/carousel.js` (línea con `setInterval`)
- Desactivar autoplay: Comenta la función `startAutoplay()`

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Dependencias Externas

- **Font Awesome 6.4.0**: Para iconos
- **Google Fonts**: Inter y Outfit

Ambas se cargan desde CDN, no requieren instalación.

## 📊 Performance

- Lazy loading de imágenes
- CSS optimizado con variables
- JavaScript modular
- Animaciones con GPU acceleration
- Imágenes placeholder (reemplazar con imágenes reales)

## 🌐 Deployment

### GitHub Pages
1. Sube el proyecto a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona la rama main y carpeta root
4. Tu sitio estará disponible en `https://tuusuario.github.io/repositorio`

### Netlify/Vercel
1. Arrastra la carpeta del proyecto a Netlify o Vercel
2. El sitio se desplegará automáticamente

### Hosting Tradicional
1. Sube todos los archivos vía FTP
2. Asegúrate de mantener la estructura de carpetas

## 📝 Próximos Pasos Sugeridos

1. **Reemplazar Imágenes Placeholder**: Cambiar las imágenes de ejemplo por imágenes reales
2. **Agregar Logo**: Crear y agregar el logo de Datify
3. **Crear Páginas de Detalle**: Páginas individuales para cada servicio
4. **Formulario de Contacto**: Implementar formulario funcional
5. **Blog**: Agregar sección de blog si es necesario
6. **Analytics**: Integrar Google Analytics o similar

## 🐛 Solución de Problemas

### Las animaciones no funcionan
- Verifica que JavaScript esté habilitado en el navegador
- Revisa la consola del navegador (F12) para errores

### El menú móvil no se abre
- Asegúrate de que `js/navigation.js` esté cargado correctamente
- Verifica que no haya errores de JavaScript en la consola

### Los estilos no se aplican
- Verifica que todas las rutas de los archivos CSS sean correctas
- Asegúrate de que los archivos CSS estén en la carpeta `css/`

## 📞 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

## 📄 Licencia

© 2024 Datify. Todos los derechos reservados.
