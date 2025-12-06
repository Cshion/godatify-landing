import { CaseStudy } from '@/types';

// Case Studies Content
export const CASES_CONTENT: CaseStudy[] = [
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
];
