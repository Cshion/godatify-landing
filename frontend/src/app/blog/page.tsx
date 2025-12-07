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
    // Sorting happens on the server (or in api.ts)
    const posts = await api.blog.getAll();

    return (
        <main className="min-h-screen bg-white">
            <BlogHero
                title={BLOG_STATIC_DATA.hero.title}
                subtitle={BLOG_STATIC_DATA.hero.subtitle}
                description={BLOG_STATIC_DATA.hero.description}
            />
            <BlogList initialPosts={posts} />
        </main>
    );
}
