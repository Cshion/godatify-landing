'use client';

import { useState, useEffect, useRef } from 'react';
import { BlogPost } from '@/types';
import FeaturedPost from './FeaturedPost';
import BlogCard from './BlogCard';
import styles from './BlogList.module.css';

import { BLOG_STATIC_DATA } from '@/data/blog-data';

interface BlogListProps {
    initialPosts: BlogPost[];
}

const BATCH_SIZE = 4;

export default function BlogList({ initialPosts }: BlogListProps) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
        setTimeout(() => {
            const currentLength = posts.length;
            const nextBatch = initialPosts.slice(currentLength, currentLength + BATCH_SIZE);

            if (nextBatch.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev) => [...prev, ...nextBatch]);

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
    }, [posts, hasMore]);

    if (posts.length === 0) return null;

    const featuredPost = posts[0];
    const gridPosts = posts.slice(1);

    return (
        <section className="container mx-auto px-6 relative z-20 pb-20 mt-24" style={{ paddingTop: '2em' }}>
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
                    {BLOG_STATIC_DATA.list.endMessage}
                </div>
            )}
        </section>
    );
}
