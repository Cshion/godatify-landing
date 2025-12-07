import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCTA from "@/components/blog/BlogCTA";
import BlogCard from "@/components/blog/BlogCard";
import styles from "./page.module.css";
import { Metadata } from "next";
import { formatDate } from "@/lib/formatDate";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await api.blog.getBySlug(slug);

    if (!post) {
        return {
            title: "Post no encontrado | Datify",
        };
    }

    return {
        title: `${post.title} | Blog Datify`,
        description: post.excerpt,
        openGraph: {
            images: [post.image],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await api.blog.getBySlug(slug);

    if (!post) {
        notFound();
    }

    const allPosts = await api.blog.getAll();
    const relatedPosts = allPosts
        .filter((p) => p.id !== post.id && p.tags.some((tag) => post.tags.includes(tag)))
        .slice(0, 3);

    return (
        <article className={styles.articleContainer}>
            <div className="container mx-auto px-6">
                <Link href="/blog" className={styles.backLink}>
                    <i className="fas fa-arrow-left" /> Volver al Blog
                </Link>

                <header className={styles.hero}>
                    <div className={styles.tags}>
                        {post.tags.map((tag, idx) => (
                            <span key={idx} className={styles.tag}>{tag}</span>
                        ))}
                    </div>

                    <h1 className={styles.title}>{post.title}</h1>

                    <div className={styles.meta}>
                        <div className={styles.author}>
                            {post.author.image ? (
                                <Image
                                    src={post.author.image}
                                    alt={post.author.name}
                                    width={48}
                                    height={48}
                                    className={styles.authorImage}
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200" />
                            )}
                            <div>
                                <span className={styles.authorName}>{post.author.name}</span>
                                <span className={styles.authorRole}>{post.author.role}</span>
                            </div>
                        </div>
                        <div className="hidden md:block w-px h-8 bg-gray-200"></div>
                        <div>
                            <span className="block font-semibold text-gray-900">Publicado</span>
                            <span>{formatDate(post.date)} &nbsp;&nbsp;·&nbsp;&nbsp; {post.readingTime} de lectura</span>
                        </div>
                    </div>
                </header>

                <div className={styles.featuredImageWrapper}>
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className={styles.featuredImage}
                        priority
                    />
                </div>

                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="max-w-4xl mx-auto mt-20 flex justify-center w-full">
                    <BlogCTA />
                </div>

                {relatedPosts.length > 0 && (
                    <div className="mt-20 pt-10 border-t border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Artículos Relacionados</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map((relatedPost) => (
                                <div key={relatedPost.id} className="h-full">
                                    <BlogCard post={relatedPost} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
