import styles from './ServiceJourney.module.css';
import Icon from '@/components/ui/Icon';

const steps = [
    {
        number: '01',
        title: 'Diagnóstico',
        description: 'Evaluamos tu madurez de datos y identificamos oportunidades de alto impacto.',
        icon: 'search'
    },
    {
        number: '02', 
        title: 'Estrategia',
        description: 'Diseñamos un roadmap alineado a tus objetivos de negocio y capacidades.',
        icon: 'lightbulb'
    },
    {
        number: '03',
        title: 'Implementación',
        description: 'Ejecutamos con metodología ágil, entregando valor incremental.',
        icon: 'cogs'
    },
    {
        number: '04',
        title: 'Resultados',
        description: 'Medimos impacto y optimizamos continuamente para maximizar ROI.',
        icon: 'chart-line'
    }
];

export default function ServiceJourney() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Cómo Trabajamos</h2>
                <p className={styles.subtitle}>
                    Un proceso probado para transformar datos en ventaja competitiva
                </p>
                
                <div className={styles.stepsGrid}>
                    {steps.map((step, index) => (
                        <div key={step.number} className={styles.step}>
                            <div className={styles.stepNumber}>{step.number}</div>
                            <div className={styles.stepContent}>
                                <div className={styles.stepIcon}>
                                    <Icon name={step.icon} />
                                </div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={styles.connector} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
