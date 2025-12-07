import Link from 'next/link';
import styles from './BlogCTA.module.css';

export default function BlogCTA() {
    return (
        <section className={styles.cta}>
            <h2 className={styles.title}>¿Listo para transformar tus datos?</h2>
            <p className={styles.description}>
                Nuestros expertos pueden ayudarte a implementar estas estrategias en tu empresa hoy mismo. Agenda una consultoría gratuita.
            </p>
            <Link href="/contacto" className={styles.button}>
                Hablemos
            </Link>
        </section>
    );
}
