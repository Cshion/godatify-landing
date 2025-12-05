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
    { href: '/#industrias', label: 'Industrias' },
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
} as const;
