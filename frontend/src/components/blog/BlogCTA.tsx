import Link from 'next/link';
import styles from './BlogCTA.module.css';

import { BLOG_STATIC_DATA } from '@/data/blog-data';

interface BlogCTAProps {
    title?: string;
    description?: string;
    link?: string;
    buttonText?: string;
}

export default function BlogCTA({
    title = BLOG_STATIC_DATA.cta.title,
    description = BLOG_STATIC_DATA.cta.description,
    link = BLOG_STATIC_DATA.cta.link,
    buttonText = BLOG_STATIC_DATA.cta.button
}: BlogCTAProps) {
    return (
        <section className={styles.cta}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>
                {description}
            </p>
            <Link href={link} className={styles.button}>
                {buttonText}
            </Link>
        </section>
    );
}
