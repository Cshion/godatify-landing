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
    { id: 'big-data-management', name: 'Big Data Management (BD)' },
    { id: 'business-analytics', name: 'Business Analytics (BA)' },
    { id: 'business-intelligence', name: 'Business Intelligence (BI)' },
    { id: 'data-engineering', name: 'Data Engineering (DE)' },
    { id: 'digital-platform', name: 'Digital Platform (DP)' },
] as const;

// ... (FOOTER_LINKS and others remain unchanged, but we should update FOOTER_LINKS too if they used IDs)

// Footer Links
export const FOOTER_LINKS = {
    quickLinks: [
        { href: '#inicio', label: 'Inicio' },
        { href: '#nosotros', label: 'Nosotros' },
        { href: '#servicios', label: 'Servicios' },
        { href: '#casos', label: 'Casos de éxito' },
    ],
    services: [
        { href: '/servicios/digital-platform', label: 'Digital Platform' },
        { href: '/servicios/data-engineering', label: 'Data Engineering' },
        { href: '/servicios/big-data-management', label: 'Big Data Management' },
        { href: '/servicios/business-intelligence', label: 'Business Intelligence' },
        { href: '/servicios/business-analytics', label: 'Business Analytics' },
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

// Clients
export const CLIENTS_CONTENT = [
    { name: 'Distribuidora Nacional', logo: 'https://placehold.co/200x80.png?text=Distribuidora&font=roboto' },
    { name: 'AgroExport Peru', logo: 'https://placehold.co/200x80.png?text=AgroExport&font=roboto' },
    { name: 'Pesquera del Mar', logo: 'https://placehold.co/200x80.png?text=Pesquera&font=roboto' },
    { name: 'Financiera Futuro', logo: 'https://placehold.co/200x80.png?text=Financiera&font=roboto' },
    { name: 'Retail Corp', logo: 'https://placehold.co/200x80.png?text=Retail&font=roboto' },
    { name: 'Salud Integral', logo: 'https://placehold.co/200x80.png?text=Salud&font=roboto' },
    { name: 'Constructora Global', logo: 'https://placehold.co/200x80.png?text=Constructora&font=roboto' },
    { name: 'Tech Solutions', logo: 'https://placehold.co/200x80.png?text=Tech&font=roboto' },
    { name: 'EducaMás', logo: 'https://placehold.co/200x80.png?text=EducaMás&font=roboto' },
    { name: 'Energía Verde', logo: 'https://placehold.co/200x80.png?text=Energía&font=roboto' },
] as const;

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

// Services Content
export const SERVICES_CONTENT = {
    'big-data-management': {
        id: 'big-data-management',
        title: 'Big Data Management',
        subtitle: 'Gobierno y control de datos a gran escala',
        description: 'Transformamos el caos de datos en activos estratégicos. Implementamos arquitecturas escalables que garantizan la calidad, seguridad y disponibilidad de tu información, permitiéndote tomar decisiones basadas en una única fuente de verdad.',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bbc7c?auto=format&fit=crop&q=80&w=1000',
        features: [
            {
                title: 'Arquitectura Escalable',
                description: 'Diseñamos Data Lakes y Warehouses capaces de procesar petabytes de información sin comprometer el rendimiento.'
            },
            {
                title: 'Gobierno de Datos',
                description: 'Establecemos el marco normativo, roles y responsabilidades para asegurar la integridad y calidad del dato.'
            },
            {
                title: 'Calidad y Limpieza',
                description: 'Procesos automatizados de validación y enriquecimiento para eliminar duplicados y errores.'
            },
            {
                title: 'Seguridad 360°',
                description: 'Implementamos cifrado, control de accesos y auditoría para cumplir con GDPR y normativas locales.'
            }
        ],
        methodology: [
            { title: 'Diagnóstico', description: 'Evaluamos la madurez de tus datos y arquitectura actual.' },
            { title: 'Estrategia', description: 'Diseñamos el roadmap de gobierno y arquitectura to-be.' },
            { title: 'Implementación', description: 'Desplegamos la infraestructura y políticas de gobierno.' },
            { title: 'Adopción', description: 'Capacitamos a tu equipo para mantener la calidad del dato.' }
        ],
        techStack: [
            { name: 'Snowflake', icon: 'snowflake' },
            { name: 'Databricks', icon: 'server' },
            { name: 'AWS', icon: 'aws' },
            { name: 'Azure', icon: 'microsoft' }
        ]
    },
    'business-analytics': {
        id: 'business-analytics',
        title: 'Business Analytics',
        subtitle: 'Predicción y ciencia de datos aplicada',
        description: 'No solo analizamos el pasado, predecimos el futuro. Utilizamos modelos matemáticos avanzados y Machine Learning para descubrir patrones ocultos, anticipar tendencias y optimizar tus operaciones con precisión científica.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
        features: [
            {
                title: 'Modelos Predictivos',
                description: 'Anticípate a la demanda, rotación de clientes y fallas de equipos con algoritmos de ML.'
            },
            {
                title: 'Optimización Matemática',
                description: 'Resuelve problemas complejos de logística, rutas y asignación de recursos.'
            },
            {
                title: 'Segmentación Inteligente',
                description: 'Clusters dinámicos de clientes para hiper-personalizar tu oferta comercial.'
            },
            {
                title: 'Análisis de Sentimiento',
                description: 'Entiende la voz de tu cliente a través del procesamiento de lenguaje natural (NLP).'
            }
        ],
        methodology: [
            { title: 'Exploración', description: 'Análisis exploratorio para entender las variables clave.' },
            { title: 'Modelado', description: 'Desarrollo y entrenamiento de algoritmos predictivos.' },
            { title: 'Validación', description: 'Pruebas A/B y backtesting para asegurar precisión.' },
            { title: 'Despliegue', description: 'Integración del modelo en tus procesos operativos.' }
        ],
        techStack: [
            { name: 'Python', icon: 'python' },
            { name: 'R', icon: 'r-project' },
            { name: 'TensorFlow', icon: 'brain' },
            { name: 'Tableau', icon: 'chart-bar' }
        ]
    },
    'business-intelligence': {
        id: 'business-intelligence',
        title: 'Business Intelligence',
        subtitle: 'Visualización que impulsa decisiones',
        description: 'Convertimos datos complejos en historias visuales claras. Diseñamos dashboards intuitivos que permiten a cada nivel de la organización monitorear sus KPIs en tiempo real y reaccionar antes de que sea tarde.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
        features: [
            {
                title: 'Dashboards Ejecutivos',
                description: 'Vistas de alto nivel para la toma de decisiones estratégicas inmediatas.'
            },
            {
                title: 'Self-Service BI',
                description: 'Empoderamos a tus usuarios para que creen sus propios reportes gobernados.'
            },
            {
                title: 'Storytelling con Datos',
                description: 'Diseño UX/UI aplicado a reportes para facilitar la interpretación.'
            },
            {
                title: 'Alertas Inteligentes',
                description: 'Notificaciones proactivas ante desviaciones de objetivos.'
            }
        ],
        methodology: [
            { title: 'Requerimientos', description: 'Definición de KPIs y preguntas de negocio clave.' },
            { title: 'Diseño UX', description: 'Prototipado de dashboards centrado en el usuario.' },
            { title: 'Desarrollo', description: 'Conexión de datos y construcción de visualizaciones.' },
            { title: 'Iteración', description: 'Ajustes basados en feedback real de usuarios.' }
        ],
        techStack: [
            { name: 'Power BI', icon: 'chart-pie' },
            { name: 'Tableau', icon: 'chart-line' },
            { name: 'Looker', icon: 'search' },
            { name: 'Qlik', icon: 'database' }
        ]
    },
    'data-engineering': {
        id: 'data-engineering',
        title: 'Data Engineering',
        subtitle: 'La ingeniería detrás de tus datos',
        description: 'Construimos las autopistas por donde viajan tus datos. Diseñamos pipelines robustos, automatizados y monitoreados que aseguran que la información llegue desde el origen hasta el destino en el tiempo y formato correctos.',
        image: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=1000',
        features: [
            {
                title: 'Pipelines ETL/ELT',
                description: 'Procesamiento batch y streaming de alta velocidad y tolerancia a fallos.'
            },
            {
                title: 'Integración de Datos',
                description: 'Conectores para cientos de fuentes: ERPs, CRMs, APIs, IoT y Redes Sociales.'
            },
            {
                title: 'Modern Data Stack',
                description: 'Implementación de herramientas cloud-native de última generación.'
            },
            {
                title: 'DataOps',
                description: 'Automatización de despliegues, pruebas y monitoreo de calidad (CI/CD).'
            }
        ],
        methodology: [
            { title: 'Arquitectura', description: 'Diseño de flujos de datos y selección de herramientas.' },
            { title: 'Ingesta', description: 'Desarrollo de conectores y procesos de extracción.' },
            { title: 'Transformación', description: 'Limpieza y modelado de datos para negocio.' },
            { title: 'Orquestación', description: 'Automatización y monitoreo de pipelines.' }
        ],
        techStack: [
            { name: 'Airflow', icon: 'wind' },
            { name: 'dbt', icon: 'cube' },
            { name: 'Spark', icon: 'bolt' },
            { name: 'Kafka', icon: 'stream' }
        ]
    },
    'digital-platform': {
        id: 'digital-platform',
        title: 'Digital Platform',
        subtitle: 'Ecosistemas digitales a medida',
        description: 'Desarrollamos plataformas web y móviles que digitalizan tus procesos core. Creamos herramientas operativas que capturan datos en el origen, eliminan el papel y conectan a tu fuerza laboral con la estrategia digital.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
        features: [
            {
                title: 'Apps Operativas',
                description: 'Aplicaciones móviles para fuerza de ventas, campo, almacén y logística.'
            },
            {
                title: 'Portales Web',
                description: 'Plataformas B2B/B2C para gestión de pedidos, clientes y proveedores.'
            },
            {
                title: 'Integración IoT',
                description: 'Conexión con sensores y hardware para captura automática de datos.'
            },
            {
                title: 'Cloud Native',
                description: 'Arquitecturas serverless y microservicios para máxima escalabilidad.'
            }
        ],
        methodology: [
            { title: 'Discovery', description: 'Entendimiento profundo del usuario y el proceso.' },
            { title: 'Diseño', description: 'Prototipado UI/UX y arquitectura técnica.' },
            { title: 'Desarrollo Ágil', description: 'Sprints iterativos con entregas de valor continuo.' },
            { title: 'Lanzamiento', description: 'Despliegue, monitoreo y soporte post-producción.' }
        ],
        techStack: [
            { name: 'React', icon: 'react' },
            { name: 'Node.js', icon: 'node-js' },
            { name: 'Flutter', icon: 'mobile-alt' },
            { name: 'AWS Lambda', icon: 'cloud' }
        ]
    }
} as const;

// Case Studies Content
export const CASES_CONTENT = [
    {
        slug: 'kpis-comerciales',
        title: 'KPIs Comerciales',
        industry: 'Business Intelligence',
        relatedIndustryId: 'logistica',
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
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video
        client: {
            name: 'Distribuidora Nacional',
            logo: 'https://placehold.co/200x80.png?text=Distribuidora&font=roboto',
            website: 'https://example.com',
            anonymous: false
        },
        testimonial: {
            quote: "Datify transformó nuestra cultura comercial. Ahora cada gerente tiene el pulso del negocio en su bolsillo, lo que nos ha permitido reaccionar ante oportunidades de mercado en horas, no en semanas.",
            author: "Roberto Méndez",
            role: "Director Comercial",
            linkedIn: "https://linkedin.com"
        },
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
        relatedIndustryId: 'cervecera',
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
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video
        client: {
            name: 'Confidencial',
            anonymous: true
        },
        testimonial: {
            quote: "Logramos sincronizar nuestra producción con la demanda real del mercado. La reducción de quiebres de stock ha tenido un impacto directo en nuestra rentabilidad y satisfacción del cliente.",
            author: "Ana Lucía Vega",
            role: "Gerente de Supply Chain",
            linkedIn: "https://linkedin.com"
        },
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
        relatedIndustryId: 'pesquera',
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
        client: {
            name: 'Pesquera del Mar',
            logo: 'https://placehold.co/200x80.png?text=Pesquera&font=roboto',
            anonymous: false
        },
        testimonial: {
            quote: "La capacidad de predecir zonas de pesca con alta probabilidad ha optimizado nuestras salidas. Ahorramos combustible y pescamos más en menos tiempo. Es una ventaja competitiva brutal.",
            author: "Cap. Jorge Arriola",
            role: "Gerente de Flota"
        },
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
        relatedIndustryId: 'agricola',
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
        client: {
            name: 'AgroExport Peru',
            logo: 'https://placehold.co/200x80.png?text=AgroExport&font=roboto',
            anonymous: false
        },
        testimonial: {
            quote: "Pasamos de gestionar el campo por intuición a gestionarlo por datos. Saber exactamente qué lote necesita atención antes de que sea visible al ojo humano ha salvado cosechas enteras.",
            author: "Ing. Miguel Campos",
            role: "Gerente Agrícola"
        },
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
        relatedIndustryId: 'agricola',
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
        client: {
            name: 'AgroExport Peru',
            logo: 'https://placehold.co/200x80.png?text=AgroExport&font=roboto',
            anonymous: false
        },
        testimonial: {
            quote: "El ROI de este proyecto fue de menos de 6 meses. Automatizar el bombeo no solo redujo la factura eléctrica, sino que aseguró que nunca nos falte agua en los momentos críticos.",
            author: "Fernando Ruiz",
            role: "Jefe de Mantenimiento e Infraestructura"
        },
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
        client: {
            name: 'EducaMás',
            logo: 'https://placehold.co/200x80.png?text=EducaMás&font=roboto',
            anonymous: false
        },
        testimonial: {
            quote: "La transparencia que hemos logrado con estos dashboards ha sido clave para ganar grandes subvenciones internacionales. Ahora podemos demostrar con datos que cada dólar cuenta.",
            author: "Sofia Alarcón",
            role: "Directora Ejecutiva"
        },
        content: `
            <h3>El Desafío</h3>
            <p>Para una ONG, la confianza es su activo más valioso. La falta de datos claros sobre el impacto ponía en riesgo la continuidad de las donaciones.</p>
            <h3>Nuestra Solución</h3>
            <p>Implementamos una cultura de datos en la organización. Ahora pueden mostrar en tiempo real cuántas familias han sido atendidas, cuántos kits de ayuda entregados y el ROI social de cada intervención.</p>
        `
    }
] as const;
