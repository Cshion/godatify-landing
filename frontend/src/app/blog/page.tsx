import { Metadata } from 'next';
import BlogHero from '@/components/blog/BlogHero';
import BlogList from '@/components/blog/BlogList';
import { api } from '@/lib/api';
import { generateBreadcrumbSchema, generateCollectionPageSchema } from '@/lib/schemas';

import { BLOG_STATIC_DATA } from "@/data/blog-data";

export const metadata: Metadata = {
    title: 'Blog de Data & AI para Empresas | Datify',
    description: 'Explora artículos sobre Data Analytics, Machine Learning e Inteligencia Artificial. Estrategias prácticas para transformar tu negocio. →',
    alternates: {
        canonical: '/blog',
    },
};

export default async function BlogPage() {
    // Sort logic handled in api
    const { posts, total } = await api.blog.getPosts({ start: 0, limit: 7 });

    return (
        <main id="main-content" className="min-h-screen bg-white">
            {/* CollectionPage Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateCollectionPageSchema(
                        '/blog',
                        'Blog de Data & AI | Datify',
                        'Artículos y recursos sobre Data Analytics, Machine Learning e Inteligencia Artificial para empresas.'
                    ))
                }}
            />
            
            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateBreadcrumbSchema([
                        { name: 'Inicio', url: 'https://godatify.com/' },
                        { name: 'Blog' }
                    ]))
                }}
            />
            
            <BlogHero
                title={BLOG_STATIC_DATA.hero.title}
                subtitle={BLOG_STATIC_DATA.hero.subtitle}
                description={BLOG_STATIC_DATA.hero.description}
            />
            <BlogList initialPosts={posts} totalPosts={total} />
        </main>
    );
}
