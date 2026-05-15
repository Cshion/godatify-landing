import { ImageResponse } from 'next/og';
import { api } from '@/lib/api';

// Image metadata
export const alt = 'Datify Blog - Data Analytics & AI';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await api.blog.getBySlug(slug);

    const title = post?.title || 'Blog Post';
    const excerpt = post?.excerpt 
        ? (post.excerpt.length > 100 ? `${post.excerpt.slice(0, 100)}...` : post.excerpt)
        : '';
    const author = post?.author?.name || 'Datify';
    const date = post?.date ? new Date(post.date).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '';

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                }}
            >
                {/* Top accent bar */}
                <div
                    style={{
                        height: '8px',
                        width: '100%',
                        backgroundColor: '#135c51',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '50px 60px',
                        flex: 1,
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '40px',
                        }}
                    >
                        {/* Logo */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}
                        >
                            <div
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    backgroundColor: '#135c51',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '22px',
                                    fontWeight: 700,
                                    color: 'white',
                                }}
                            >
                                D
                            </div>
                            <span
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 600,
                                    color: '#135c51',
                                }}
                            >
                                Datify
                            </span>
                        </div>

                        {/* Category */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#f3f4f6',
                                padding: '8px 16px',
                                borderRadius: '20px',
                            }}
                        >
                            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
                                BLOG
                            </span>
                        </div>
                    </div>

                    {/* Main content */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        {/* Title */}
                        <h1
                            style={{
                                fontSize: '48px',
                                fontWeight: 700,
                                color: '#111827',
                                margin: 0,
                                marginBottom: '20px',
                                lineHeight: 1.15,
                                letterSpacing: '-1px',
                                maxWidth: '900px',
                            }}
                        >
                            {title}
                        </h1>

                        {/* Excerpt */}
                        <p
                            style={{
                                fontSize: '20px',
                                color: '#6b7280',
                                margin: 0,
                                lineHeight: 1.5,
                                maxWidth: '800px',
                            }}
                        >
                            {excerpt}
                        </p>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '30px',
                            paddingTop: '20px',
                            borderTop: '1px solid #e5e7eb',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                            }}
                        >
                            <span style={{ fontSize: '16px', color: '#374151', fontWeight: 500 }}>
                                {author}
                            </span>
                            {date && (
                                <>
                                    <span style={{ fontSize: '16px', color: '#9ca3af' }}>•</span>
                                    <span style={{ fontSize: '16px', color: '#6b7280' }}>
                                        {date}
                                    </span>
                                </>
                            )}
                        </div>
                        <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                            godatify.com/blog
                        </span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
