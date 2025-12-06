import { Industry } from '@/types';

// Industries Page Content
import { IndustriesPageContent } from '@/types';

// Industries Page Content
export const INDUSTRIES_CONTENT: IndustriesPageContent = {
    hero: {
        title: 'Potencia tu Sector',
        subtitle: 'Soluciones especializadas para retos sectoriales únicos.',
        description: 'Entendemos que cada industria tiene su propio ADN. Nuestra experiencia nos permite adaptar la tecnología y el análisis de datos a las necesidades específicas de tu sector, generando valor tangible desde el primer día.',
        phrases: ['Dominio Sectorial', 'Valor Específico', 'Transformación Vertical']
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
};
