// Social Media Links
export const SOCIAL_LINKS = [
    {
        id: 'linkedin',
        icon: 'linkedin-in',
        url: 'https://www.linkedin.com/company/godatify/',
        label: 'LinkedIn'
    },
    {
        id: 'facebook',
        icon: 'facebook-f',
        url: 'https://www.facebook.com/godatify',
        label: 'Facebook'
    },
    {
        id: 'instagram',
        icon: 'instagram',
        url: 'https://www.instagram.com/godatify/',
        label: 'Instagram'
    },
    {
        id: 'youtube',
        icon: 'youtube',
        url: 'https://godatify.com',
        label: 'YouTube'
    },
] as const;

// Navigation Links
export const NAV_LINKS = [
    { href: '/#inicio', label: 'Inicio' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/industrias', label: 'Industrias' },
    { href: '/casos', label: 'Casos de éxito' },
    { href: '/#blog', label: 'Blog' },
    { href: '/#contacto', label: 'Contacto' },
] as const;

// Services for Dropdown
export const SERVICES_NAV = [
    { id: 'bd', name: 'Big Data Management (BD)' },
    { id: 'ba', name: 'Business Analytics (BA)' },
    { id: 'bi', name: 'Business Intelligence (BI)' },
    { id: 'de', name: 'Data Engineering (DE)' },
    { id: 'dp', name: 'Digital Platform (DP)' },
] as const;

// Footer Links
export const FOOTER_LINKS = {
    quickLinks: [
        { href: '#inicio', label: 'Inicio' },
        { href: '#nosotros', label: 'Nosotros' },
        { href: '#servicios', label: 'Servicios' },
        { href: '#casos', label: 'Casos de éxito' },
    ],
    services: [
        { href: '#dp', label: 'Digital Platform' },
        { href: '#de', label: 'Data Engineering' },
        { href: '#bd', label: 'Big Data Management' },
        { href: '#bi', label: 'Business Intelligence' },
        { href: '#ba', label: 'Business Analytics' },
    ],
    contact: [
        { href: '#blog', label: 'Blog' },
        { href: '#contacto', label: 'Contacto' },
        { href: '#', label: 'Términos y Políticas' },
    ],
} as const;

// Company Info
export const COMPANY_INFO = {
    name: 'DATIFY',
    description: 'En Datify acompañamos a las organizaciones a descubrir el verdadero poder de sus datos, transformando la forma en que las organizaciones piensan, operan y deciden.',
    email: 'contacto@godatify.com',
    website: 'https://godatify.com',
} as const;

// Hero Content
export const HERO_CONTENT = {
    title: 'Datificando las Organizaciones',
    subtitle: 'En Datify acompañamos a las organizaciones a descubrir el verdadero poder de sus datos, transformando la forma en que las organizaciones piensan, operan y deciden. Nos convertimos en sus aliados estratégicos para lograr mayor eficiencia, agilidad y crecimiento sostenido a partir del valor de sus datos.',
    ctaText: 'Contáctanos',
    ctaHref: '#contacto',
    scrollText: 'Descubre más',
} as const;

// Stats
export const STATS = [
    { target: 150, label: 'Proyectos' },
    { target: 10, label: 'Años de Experiencia' },
    { target: 100, label: 'Clientes Satisfechos' },
] as const;

// Video
export const VIDEO_CONFIG = {
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Video Introductorio Datify',
    caption: 'Descubre cómo transformamos datos en decisiones',
} as const;

// Carousel Settings
export const CAROUSEL_CONFIG = {
    cardsPerView: 3,
    autoPlayInterval: 5000,
} as const;

// Nosotros Page Content
export const NOSOTROS_CONTENT = {
    hero: {
        title: 'Nosotros',
        subtitle: 'Nuestra razón de ser es generar impacto real, convirtiendo la complejidad en claridad, y el dato en una ventaja competitiva.',
        description: 'Desde 2022 hemos trabajado con empresas líderes como Heineken, Grupo Rocío y SPACE AG, adaptándonos a sus necesidades y desafíos. Nos eligen por nuestra capacidad de entender su negocio, anticipar soluciones y entregar resultados que generan confianza. Creemos en un modelo ágil, colaborativo y centrado en el valor: operamos de forma remota con oficinas híbridas en Lima y Madrid, listos para estar donde nuestros clientes lo necesiten.',
    },
    mission: {
        title: 'Nuestra Misión',
        text: 'Empoderar a las organizaciones para que tomen decisiones estratégicas basadas en datos, impulsando su crecimiento y eficiencia mediante soluciones tecnológicas innovadoras y un acompañamiento cercano.',
    },
    vision: {
        title: 'Nuestra Visión',
        text: 'Ser el referente líder en consultoría de datos y transformación digital en LATAM, reconocidos por nuestra capacidad de convertir información compleja en valor tangible y sostenible para nuestros clientes.',
    },
    values: [
        {
            id: 'compromiso',
            title: 'Compromiso con el resultado',
            description: 'Trabajamos para generar valor tangible y medible.',
            icon: 'chart-line',
        },
        {
            id: 'empatia',
            title: 'Empatía empresarial',
            description: 'Escuchamos, entendemos y nos alineamos a los objetivos de cada cliente.',
            icon: 'handshake',
        },
        {
            id: 'innovacion',
            title: 'Innovación constante',
            description: 'Nos mantenemos a la vanguardia tecnológica para proponer soluciones que marquen la diferencia.',
            icon: 'lightbulb',
        },
        {
            id: 'transparencia',
            title: 'Transparencia',
            description: 'Comunicamos con claridad, cumplimos lo que prometemos y construimos relaciones de confianza.',
            icon: 'check-circle',
        },
        {
            id: 'excelencia',
            title: 'Excelencia en equipo',
            description: 'Creemos en el poder de un equipo multidisciplinario, colaborativo y apasionado por los datos.',
            icon: 'users',
        },
    ],
    culture: {
        title: 'Innovación sin fronteras',
        description: 'En Datify, creemos que el talento no tiene código postal. Fomentamos una cultura de trabajo remoto y flexible que prioriza los resultados sobre la presencia física. Nuestros equipos multidisciplinarios colaboran desde diferentes partes del mundo, unidos por la pasión de transformar datos en valor.',
        stats: [
            { value: '100%', label: 'Remoto' },
            { value: '+10', label: 'Países' },
            { value: '24/7', label: 'Soporte' },
        ],
    },
} as const;

// Industries Page Content
export const INDUSTRIES_CONTENT = {
    hero: {
        title: 'Industrias',
        subtitle: 'Soluciones especializadas para retos sectoriales únicos.',
        description: 'Entendemos que cada industria tiene su propio ADN. Nuestra experiencia nos permite adaptar la tecnología y el análisis de datos a las necesidades específicas de tu sector, generando valor tangible desde el primer día.',
    },
    sectors: [
        {
            id: 'cervecera',
            title: 'Industria Cervecera',
            description: 'Precisión operativa y visibilidad comercial en toda la cadena de valor.',
            image: 'https://images.unsplash.com/photo-1600256698643-1d9345bfd9ee?auto=format&fit=crop&q=80&w=1000',
            stats: [
                { label: 'Eficiencia', value: '+25%' },
                { label: 'Visibilidad', value: '360°' },
            ],
            projects: [
                'Automatización de procesos ETL y alertas vía Telegram.',
                'Dashboards de Sell In y Sell Out para control de distribución.',
                'Mapas de precios y segmentación de clientes.',
                'Trazabilidad de Equipos de Frío y KPIs financieros.'
            ]
        },
        {
            id: 'logistica',
            title: 'Industria Logística',
            description: 'Optimización de rutas, gestión de flotas y monitoreo en tiempo real.',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000',
            stats: [
                { label: 'Entregas', value: 'On-Time' },
                { label: 'Control', value: 'Total' },
            ],
            projects: [
                'Tableros de monitoreo de entregas en tiempo real.',
                'Cálculo de KPIs logísticos (OTIF, Tiempos de Ciclo).',
                'Automatización de flujos entre operaciones y comercial.'
            ]
        },
        {
            id: 'agricola',
            title: 'Industria Agrícola',
            description: 'Transformación digital para un entorno estacional y de alta variabilidad.',
            image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1000',
            stats: [
                { label: 'Gestión', value: 'Campo' },
                { label: 'Datos', value: 'Integrados' },
            ],
            projects: [
                'App móvil para gestión de lotes y producción en campo.',
                'Arquitectura Big Data para escalabilidad de información.',
                'BI para fenología, costos de riego y control de calidad.'
            ]
        },
        {
            id: 'pesquera',
            title: 'Industria Pesquera',
            description: 'Digitalización y cumplimiento normativo en procesos complejos.',
            image: 'https://images.unsplash.com/photo-1534951009808-766178b47a8e?auto=format&fit=crop&q=80&w=1000',
            stats: [
                { label: 'Trazabilidad', value: '100%' },
                { label: 'Normativa', value: 'Cumplida' },
            ],
            projects: [
                'Análisis de producción por planta y veda.',
                'Reportes automatizados para áreas legales y RRHH.',
                'Cuadros de mando de producción detallada (harina, aceite).'
            ]
        }
    ]
} as const;

// Case Studies Content
export const CASES_CONTENT = [
    {
        slug: 'kpis-comerciales',
        title: 'KPIs Comerciales',
        industry: 'Business Intelligence',
        description: 'Dashboard de KPIs comerciales para seguimiento en tiempo real de ventas y rendimiento.',
        challenge: 'La falta de visibilidad en tiempo real sobre las métricas comerciales impedía la toma de decisiones ágiles. Los reportes mensuales llegaban demasiado tarde para corregir desviaciones en las ventas.',
        solution: 'Implementación de un Dashboard interactivo en Power BI conectado directamente al ERP. Visualización de ventas por zona, vendedor, categoría y producto en tiempo real.',
        results: [
            { label: 'Visibilidad', value: '100%', suffix: ' Tiempo Real' },
            { label: 'Decisiones', value: '2x', suffix: ' Más Rápidas' },
            { label: 'Ventas', value: '+15%', suffix: ' YoY' }
        ],
        techStack: ['Power BI', 'SQL Server', 'Azure'],
        image: '/images/cases/case_kpis_comerciales_1764948784061.png',
        content: `
            <h3>El Desafío</h3>
            <p>El equipo comercial dependía de reportes estáticos en Excel que tardaban días en generarse. Esto provocaba que las estrategias correctivas se aplicaran cuando ya era tarde.</p>
            <h3>Nuestra Solución</h3>
            <p>Desarrollamos un sistema de Business Intelligence que actualiza los datos cada 15 minutos. Los gerentes ahora pueden ver el avance de ventas diario y proyectar el cierre de mes con alta precisión.</p>
        `
    },
    {
        slug: 'sell-in-out',
        title: 'Sell In y Sell Out',
        industry: 'Business Analytics',
        description: 'Análisis integral de canales de distribución para optimizar el inventario y las ventas.',
        challenge: 'Desconexión entre lo que se vendía a los distribuidores (Sell In) y lo que estos vendían al consumidor final (Sell Out), generando quiebres de stock o sobrestock.',
        solution: 'Integración de datos de inventarios de distribuidores para calcular el Sell Out real. Algoritmos de reabastecimiento sugerido basados en la rotación real del producto.',
        results: [
            { label: 'Inventario', value: '-20%', suffix: ' Días Calle' },
            { label: 'Quiebres', value: '-30%', suffix: ' Stockouts' },
            { label: 'Margen', value: '+5%', suffix: ' Operativo' }
        ],
        techStack: ['Tableau', 'Python', 'Snowflake'],
        image: '/images/cases/case_sell_in_out_1764948806601.png',
        content: `
            <h3>El Desafío</h3>
            <p>La marca perdía ventas por no tener el producto correcto en el punto de venta, mientras que otros productos se acumulaban en los almacenes de los distribuidores.</p>
            <h3>Nuestra Solución</h3>
            <p>Creamos un modelo de visibilidad de cadena de suministro extendida. Ahora la empresa sabe exactamente cuánto inventario tiene cada socio comercial y puede planificar la producción de manera más eficiente.</p>
        `
    },
    {
        slug: 'inteligencia-operativa',
        title: 'Inteligencia Operativa Pesquera',
        industry: 'Data Engineering',
        description: 'Sistema de gestión de flota y operaciones marítimas para maximizar la captura y eficiencia.',
        challenge: 'La gestión de la flota pesquera se basaba en reportes manuales vía radio, con poca precisión sobre la ubicación exacta de los cardúmenes y el consumo de combustible.',
        solution: 'Plataforma de inteligencia operativa que integra datos satelitales, oceanográficos y de telemetría de las embarcaciones para dirigir la flota a las zonas más productivas.',
        results: [
            { label: 'Captura', value: '+18%', suffix: ' Toneladas' },
            { label: 'Combustible', value: '-12%', suffix: ' Ahorro' },
            { label: 'Eficiencia', value: '+25%', suffix: ' Operativa' }
        ],
        techStack: ['Azure IoT', 'Databricks', 'Power BI'],
        image: '/images/cases/case_inteligencia_operativa_1764948826943.png',
        content: `
            <h3>El Desafío</h3>
            <p>La pesca es una actividad de alto costo operativo. Mover la flota sin certeza de captura genera pérdidas millonarias en combustible y tiempo.</p>
            <h3>Nuestra Solución</h3>
            <p>Implementamos modelos predictivos que analizan la temperatura del mar y corrientes para sugerir zonas de pesca. Además, monitoreamos el rendimiento de los motores en tiempo real.</p>
        `
    },
    {
        slug: 'agricultura-precision',
        title: 'Agricultura de Precisión',
        industry: 'Big Data Management',
        description: 'Monitoreo satelital y análisis de cultivos para optimizar el rendimiento por hectárea.',
        challenge: 'La variabilidad en el rendimiento de los lotes de cultivo era una incógnita. No se sabía por qué ciertas zonas producían menos que otras bajo las mismas condiciones aparentes.',
        solution: 'Uso de imágenes espectrales para analizar la salud de la vegetación (NDVI) y correlacionarlo con análisis de suelo y riego. Detección temprana de plagas y estrés hídrico.',
        results: [
            { label: 'Rendimiento', value: '+10%', suffix: ' Ton/Ha' },
            { label: 'Insumos', value: '-15%', suffix: ' Ahorro' },
            { label: 'Calidad', value: 'Top', suffix: ' Exportación' }
        ],
        techStack: ['Python', 'Satellite API', 'QGIS'],
        image: '/images/cases/case_agricultura_precision_1764948848374.png',
        content: `
            <h3>El Desafío</h3>
            <p>La agricultura tradicional trata a todo el campo por igual. Sin embargo, las condiciones del suelo varían metro a metro, lo que lleva a un uso ineficiente de fertilizantes y agua.</p>
            <h3>Nuestra Solución</h3>
            <p>Digitalizamos el campo. Ahora cada lote tiene una "historia clínica" digital que permite aplicar insumos de manera variable (VRA), dándole a cada planta exactamente lo que necesita.</p>
        `
    },
    {
        slug: 'costos-irrigacion',
        title: 'Costos de Irrigación',
        industry: 'Business Intelligence',
        description: 'Optimización de recursos hídricos y energéticos para reducir el costo por metro cúbico de agua.',
        challenge: 'El costo energético del bombeo de agua representaba el 30% del costo de producción. Las bombas operaban en horarios de tarifa punta sin control automatizado.',
        solution: 'Sistema de gestión energética que programa el riego en horarios de tarifa baja y optimiza la presión de bombeo según la demanda real del cultivo.',
        results: [
            { label: 'Energía', value: '-25%', suffix: ' Costo' },
            { label: 'Agua', value: '-10%', suffix: ' Uso' },
            { label: 'Huella', value: '-20%', suffix: ' Carbono' }
        ],
        techStack: ['IoT', 'SCADA', 'Power BI'],
        image: '/images/cases/case_costos_irrigacion_1764948875476.png',
        content: `
            <h3>El Desafío</h3>
            <p>El agua es un recurso escaso y costoso de mover. La falta de sincronización entre la necesidad del cultivo y la operación de bombeo generaba desperdicios enormes.</p>
            <h3>Nuestra Solución</h3>
            <p>Automatizamos los pozos y bombas. El sistema decide cuándo bombear basándose en el costo de la energía y el nivel de los reservorios, asegurando disponibilidad al menor costo posible.</p>
        `
    },
    {
        slug: 'kpis-npo',
        title: 'KPIs para ONGs (NPO)',
        industry: 'Business Analytics',
        description: 'Métricas de impacto social y transparencia financiera para organizaciones sin fines de lucro.',
        challenge: 'La ONG tenía dificultades para demostrar el impacto real de sus programas a los donantes debido a la dispersión de datos en múltiples hojas de cálculo.',
        solution: 'Plataforma unificada de gestión de proyectos sociales. Dashboards de transparencia que muestran en qué se invierte cada dólar y a cuántas personas beneficia.',
        results: [
            { label: 'Fondos', value: '+40%', suffix: ' Recaudación' },
            { label: 'Reportes', value: '-80%', suffix: ' Tiempo' },
            { label: 'Confianza', value: '100%', suffix: ' Stakeholders' }
        ],
        techStack: ['Salesforce NPSP', 'Tableau', 'Power Automate'],
        image: '/images/cases/case_kpis_npo_1764948909347.png',
        content: `
            <h3>El Desafío</h3>
            <p>Para una ONG, la confianza es su activo más valioso. La falta de datos claros sobre el impacto ponía en riesgo la continuidad de las donaciones.</p>
            <h3>Nuestra Solución</h3>
            <p>Implementamos una cultura de datos en la organización. Ahora pueden mostrar en tiempo real cuántas familias han sido atendidas, cuántos kits de ayuda entregados y el ROI social de cada intervención.</p>
        `
    }
] as const;
