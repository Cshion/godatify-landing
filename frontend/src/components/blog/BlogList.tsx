'use client';

import { useState, useEffect, useRef } from 'react';
import { BlogPost } from '@/types';
import FeaturedPost from './FeaturedPost';
import BlogCard from './BlogCard';
import styles from './BlogList.module.css';
import { getMorePosts } from '@/app/actions/blog';

import { BLOG_STATIC_DATA } from '@/data/blog-data';

interface BlogListProps {
    initialPosts: BlogPost[];
    totalPosts: number;
}

const BATCH_SIZE = 6;

export default function BlogList({ initialPosts, totalPosts }: BlogListProps) {
    const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
    const [hasMore, setHasMore] = useState(initialPosts.length < totalPosts);
    const [isLoading, setIsLoading] = useState(false);
    const loader = useRef<HTMLDivElement>(null);

    const handleObserver = (entities: IntersectionObserverEntry[]) => {
        const target = entities[0];
        if (target.isIntersecting && hasMore && !isLoading) {
            loadMore();
        }
    };

    const loadMore = async () => {
        setIsLoading(true);
        try {
            const offset = posts.length;
            const { posts: newPosts, total } = await getMorePosts(offset, BATCH_SIZE);

            if (newPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev) => [...prev, ...newPosts]);
                if (posts.length + newPosts.length >= total) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Failed to load more posts:', error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
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
    }, [posts, hasMore, isLoading]);

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
