'use client';

import { useState, useEffect, useRef } from 'react';
import { BlogPost } from '@/types';
import FeaturedPost from './FeaturedPost';
import BlogCard from './BlogCard';
import styles from './BlogList.module.css';

interface BlogListProps {
    initialPosts: BlogPost[];
}

const BATCH_SIZE = 4;

export default function BlogList({ initialPosts }: BlogListProps) {
    // initialPosts are already sorted by date desc from the server
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef<HTMLDivElement>(null);

    // Initial Load: Featured + First Batch
    useEffect(() => {
        // Featured is index 0
        // We load index 0 to BATCH_SIZE initially?
        // Let's say we show Featured (1) + Grid (BATCH_SIZE)
        // Total shown = 1 + BATCH_SIZE
        const initialCount = 1 + BATCH_SIZE;
        setPosts(initialPosts.slice(0, initialCount));
        if (initialPosts.length <= initialCount) {
            setHasMore(false);
        }
    }, [initialPosts]);

    const handleObserver = (entities: IntersectionObserverEntry[]) => {
        const target = entities[0];
        if (target.isIntersecting && hasMore) {
            loadMore();
        }
    };

    const loadMore = () => {
        // Simulate network delay for "infinite scroll" feel
        setTimeout(() => {
            const currentLength = posts.length;
            const nextBatch = initialPosts.slice(currentLength, currentLength + BATCH_SIZE);

            if (nextBatch.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev) => [...prev, ...nextBatch]);

                // If we've reached the end of local data, should we loop?
                // User requirement: "scroll infinio para cargar mas".
                // Since we only have ~10 posts, let's just stop or duplicate for demo.
                // Let's stop for correctness, duplication might confuse ID keys.
                if (currentLength + nextBatch.length >= initialPosts.length) {
                    setHasMore(false);
                }
            }
        }, 800);
    };

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
        };
        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) observer.observe(loader.current);

        return () => {
            if (loader.current) observer.unobserve(loader.current);
        };
    }, [posts, hasMore]); // Re-attach observer when posts change or hasMore

    if (posts.length === 0) return null;

    const featuredPost = posts[0];
    const gridPosts = posts.slice(1);

    return (
        <section className="container mx-auto px-6 relative z-20 pb-20 mt-24">
            {/* Featured Post */}
            <FeaturedPost post={featuredPost} />

            {/* Grid */}
            <div className={styles.grid}>
                {gridPosts.map((post) => (
                    <BlogCard key={`${post.id}-${posts.indexOf(post)}`} post={post} />
                ))}
            </div>

            {/* Loading Indicator */}
            {hasMore && (
                <div ref={loader} className={styles.loader}>
                    <div className={styles.spinner}></div>
                </div>
            )}

            {!hasMore && (
                <div className={styles.endMessage}>
                    Has llegado al final del contenido.
                </div>
            )}
        </section>
    );
}
