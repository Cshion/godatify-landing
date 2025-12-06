import { HeroContent, Stat, VideoConfig, Client, CarouselConfig, SectionLabels } from '@/types';

// Hero Content
export const HERO_CONTENT: HeroContent = {
    title: 'Datificando las Organizaciones',
    subtitle: 'En Datify acompañamos a las organizaciones a descubrir el verdadero poder de sus datos, transformando la forma en que las organizaciones piensan, operan y deciden. Nos convertimos en sus aliados estratégicos para lograr mayor eficiencia, agilidad y crecimiento sostenido a partir del valor de sus datos.',
    ctaText: 'Contáctanos',
    ctaHref: '#contacto',
    scrollText: 'Descubre más',
    backgroundImage: '/images/hero-bg.jpg',
    gradient: 'linear-gradient(90deg, rgba(19, 92, 81, 0.85) 0%, rgba(19, 92, 81, 0.6) 50%, rgba(19, 92, 81, 0.4) 100%)',
};

// Section Labels
export const SECTION_LABELS: SectionLabels = {
    services: {
        title: 'Nuestros Servicios',
        button: 'Leer Más',
    },
    cases: {
        title: 'Casos de Éxito',
        button: 'Ver Proyecto',
    },
    testimonials: {
        title: 'Testimonios',
    },
    clients: {
        title: 'Confían en Nosotros',
    },
    about: {
        title: 'Nosotros',
        button: 'Conoce más sobre nosotros',
    },
};

// Stats
export const STATS: Stat[] = [
    { target: 150, label: 'Proyectos' },
    { target: 10, label: 'Años de Experiencia' },
    { target: 100, label: 'Clientes Satisfechos' },
];

// Video
export const VIDEO_CONFIG: VideoConfig = {
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Video Introductorio Datify',
    caption: 'Descubre cómo transformamos datos en decisiones',
};

// Clients
export const CLIENTS_CONTENT: Client[] = [
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
];

// Carousel Settings
export const CAROUSEL_CONFIG: CarouselConfig = {
    cardsPerView: 3,
    autoPlayInterval: 5000,
};
