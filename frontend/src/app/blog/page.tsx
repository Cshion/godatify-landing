import { Metadata } from 'next';
import BlogHero from '@/components/blog/BlogHero';
import BlogList from '@/components/blog/BlogList';
import { api } from '@/lib/api';

import { BLOG_STATIC_DATA } from "@/data/blog-data";

export const metadata: Metadata = {
    title: BLOG_STATIC_DATA.metadata.title,
    description: BLOG_STATIC_DATA.metadata.description,
};

export default async function BlogPage() {
    // Sort logic handled in api
    const { posts, total } = await api.blog.getPosts({ start: 0, limit: 7 });

    return (
        <main className="min-h-screen bg-white">
            <BlogHero
                title={BLOG_STATIC_DATA.hero.title}
                subtitle={BLOG_STATIC_DATA.hero.subtitle}
                description={BLOG_STATIC_DATA.hero.description}
            />
            <BlogList initialPosts={posts} totalPosts={total} />
        </main>
    );
}
