import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/formatDate';
import Icon from '@/components/ui/Icon';
import styles from './FeaturedPost.module.css';

import { BLOG_STATIC_DATA } from '@/data/blog-data';

interface FeaturedPostProps {
    post: BlogPost;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
    return (
        <article className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className={styles.image}
                        priority
                    />
                </div>
                <div className={styles.content}>
                    <span className={styles.label}>{BLOG_STATIC_DATA.featured.label}</span>
                    <h2 className={styles.title}>
                        <Link href={`/blog/${post.slug}`} className="hover:text-brand-green transition-colors">
                            {post.title}
                        </Link>
                    </h2>
                    <p className={styles.excerpt}>{post.excerpt}</p>

                    <div className={styles.footer}>
                        <div className={styles.meta}>
                            {formatDate(post.date)} &nbsp;&nbsp;·&nbsp;&nbsp; {post.readingTime}
                        </div>
                        <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                            {BLOG_STATIC_DATA.featured.readMore} <Icon name="arrow-right" />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
