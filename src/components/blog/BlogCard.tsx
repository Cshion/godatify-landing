import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/formatDate';
import styles from './BlogCard.module.css';

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`} className="block h-full">
            <article className={styles.card}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={post.image}
                        alt={post.title}
                        width={600}
                        height={400}
                        className={styles.image}
                    />
                </div>

                <div className={styles.content}>
                    <div className={styles.tags}>
                        {post.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className={styles.tag}>{tag}</span>
                        ))}
                    </div>

                    <h3 className={styles.title}>{post.title}</h3>
                    <p className={styles.excerpt}>{post.excerpt}</p>

                    <div className={styles.footer}>
                        <div className={styles.meta}>
                            <span className={styles.date}>{formatDate(post.date)} &nbsp;&nbsp;·&nbsp;&nbsp; {post.readingTime}</span>
                        </div>

                        <div className={styles.arrow}>
                            <i className="fas fa-arrow-right" />
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
