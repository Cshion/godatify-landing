import { Service } from '@/types';

// Services for Dropdown (derived from content for consistency, but kept separate if needed for simple nav)
export const SERVICES_NAV = [
    { id: 'big-data-management', name: 'Big Data Management' },
    { id: 'business-analytics', name: 'Business Analytics' },
    { id: 'business-intelligence', name: 'Business Intelligence' },
    { id: 'data-engineering', name: 'Data Engineering' },
    { id: 'digital-platform', name: 'Digital Platform' },
] as const;

// Services Content
export const SERVICES_CONTENT: Record<string, Service> = {
    'big-data-management': {
        id: 'big-data-management',
        title: 'Arquitectura de Datos',
        phrases: ['Escalabilidad Masiva', 'Seguridad 360', 'Fuente Única de Verdad'],
        backgroundImage: '/images/hero-services.png',
        subtitle: 'Gobierno y control de datos a gran escala',
        description: 'Transformamos el caos de datos en activos estratégicos. Implementamos arquitecturas escalables que garantizan la calidad, seguridad y disponibilidad de tu información, permitiéndote tomar decisiones basadas en una única fuente de verdad.',
        icon: 'server',
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
        title: 'Poder Predictivo',
        phrases: ['Anticipación', 'Precisión Científica', 'Optimización'],
        backgroundImage: '/images/hero-services.png',
        subtitle: 'Predicción y ciencia de datos aplicada',
        description: 'No solo analizamos el pasado, predecimos el futuro. Utilizamos modelos matemáticos avanzados y Machine Learning para descubrir patrones ocultos, anticipar tendencias y optimizar tus operaciones con precisión científica.',
        icon: 'brain',
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
        title: 'Inteligencia Visual',
        phrases: ['Claridad Estratégica', 'Decisiones Reales', 'Control Total'],
        backgroundImage: '/images/hero-services.png',
        subtitle: 'Visualización que impulsa decisiones',
        description: 'Convertimos datos complejos en historias visuales claras. Diseñamos dashboards intuitivos que permiten a cada nivel de la organización monitorear sus KPIs en tiempo real y reaccionar antes de que sea tarde.',
        icon: 'chart-line',
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
        title: 'Ingeniería Robusta',
        phrases: ['Flujos Automatizados', 'Integración Total', 'Calidad de Dato'],
        backgroundImage: '/images/hero-services.png',
        subtitle: 'La ingeniería detrás de tus datos',
        description: 'Construimos las autopistas por donde viajan tus datos. Diseñamos pipelines robustos, automatizados y monitoreados que aseguran que la información llegue desde el origen hasta el destino en el tiempo y formato correctos.',
        icon: 'database',
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
        title: 'Ecosistemas Digitales',
        phrases: ['Experiencia de Usuario', 'Procesos Ágiles', 'Conectividad'],
        backgroundImage: '/images/hero-services.png',
        subtitle: 'Ecosistemas digitales a medida',
        description: 'Desarrollamos plataformas web y móviles que digitalizan tus procesos core. Creamos herramientas operativas que capturan datos en el origen, eliminan el papel y conectan a tu fuerza laboral con la estrategia digital.',
        icon: 'laptop-code',
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
};
