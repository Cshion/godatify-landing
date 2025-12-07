import { Metadata } from 'next';
import BlogHero from '@/components/blog/BlogHero';
import BlogList from '@/components/blog/BlogList';
import { api } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Blog | Datify',
    description: 'Explora nuestras últimas ideas, análisis y tendencias sobre Data & AI, Cloud Computing y transformación digital.',
};

export default async function BlogPage() {
    const posts = await api.blog.getAll();

    // Sort posts by date descending
    const sortedPosts = posts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <main className="bg-gray-50 min-h-screen">
            <BlogHero
                title="Nuestras Ideas"
                subtitle="BLOG"
                description="Insights estratégicos para líderes que buscan transformar sus organizaciones a través de los datos y la inteligencia artificial."
            />

            <BlogList initialPosts={sortedPosts} />
        </main>
    );
}
