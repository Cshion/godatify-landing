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
    { href: '/#casos', label: 'Casos de éxito' },
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
