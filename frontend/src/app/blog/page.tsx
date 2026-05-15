import { Metadata } from 'next';
import BlogHero from '@/components/blog/BlogHero';
import BlogList from '@/components/blog/BlogList';
import { api } from '@/lib/api';
import { generateBreadcrumbSchema, generateCollectionPageSchema } from '@/lib/schemas';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
    'Blog de Data & AI para Empresas',
    'Explora artículos sobre Data Analytics, Machine Learning e Inteligencia Artificial. Estrategias prácticas para transformar tu negocio. →',
    '/blog'
);

export default async function BlogPage() {
    // Fetch page data and posts from CMS
    const [{ hero }, { posts, total }] = await Promise.all([
        api.blog.getPageData(),
        api.blog.getPosts({ start: 0, limit: 7 })
    ]);

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
                title={hero.title}
                subtitle={hero.subtitle}
                description={hero.description}
            />
            <BlogList initialPosts={posts} totalPosts={total} />
        </main>
    );
}
