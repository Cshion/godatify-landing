import { NosotrosContent } from '@/types';

// Nosotros Page Content
export const NOSOTROS_CONTENT: NosotrosContent = {
    hero: {
        title: 'Nosotros',
        subtitle: 'Nuestra razón de ser es generar impacto real, convirtiendo la complejidad en claridad, y el dato en una ventaja competitiva.',
        description: 'Desde 2022 hemos trabajado con empresas líderes como Heineken, Grupo Rocío y SPACE AG, adaptándonos a sus necesidades y desafíos. Nos eligen por nuestra capacidad de entender su negocio, anticipar soluciones y entregar resultados que generan confianza. Creemos en un modelo ágil, colaborativo y centrado en el valor: operamos de forma remota con oficinas híbridas en Lima y Madrid, listos para estar donde nuestros clientes lo necesiten.',
    },
    mission: {
        title: 'Nuestra Misión',
        text: 'Empoderar a las organizaciones para que tomen decisiones estratégicas basadas en datos, impulsando su crecimiento y eficiencia mediante soluciones tecnológicas innovadoras y un acompañamiento cercano.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
    },
    vision: {
        title: 'Nuestra Visión',
        text: 'Ser el referente líder en consultoría de datos y transformación digital en LATAM, reconocidos por nuestra capacidad de convertir información compleja en valor tangible y sostenible para nuestros clientes.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
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
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    tabs: [
        { id: 'quienes', label: 'Quiénes Somos' },
        { id: 'mision', label: 'Misión y Visión' },
        { id: 'valores', label: 'Valores' },
        { id: 'cultura', label: 'Cultura' },
    ],
};
