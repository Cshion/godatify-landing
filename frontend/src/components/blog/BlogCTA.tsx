import Link from 'next/link';
import styles from './BlogCTA.module.css';

import { BLOG_STATIC_DATA } from '@/data/blog-data';

export default function BlogCTA() {
    return (
        <section className={styles.cta}>
            <h2 className={styles.title}>{BLOG_STATIC_DATA.cta.title}</h2>
            <p className={styles.description}>
                {BLOG_STATIC_DATA.cta.description}
            </p>
            <Link href={BLOG_STATIC_DATA.cta.link} className={styles.button}>
                {BLOG_STATIC_DATA.cta.button}
            </Link>
        </section>
    );
}
