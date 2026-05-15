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
        ? (post.excerpt.length > 80 ? `${post.excerpt.slice(0, 80)}...` : post.excerpt)
        : '';
    const postImage = post?.image || '';

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    backgroundColor: 'white',
                }}
            >
                {/* Left side: Post image */}
                <div
                    style={{
                        width: '40%',
                        height: '100%',
                        display: 'flex',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {postImage ? (
                        <img
                            src={postImage}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#135c51',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <span style={{ fontSize: '80px', color: 'white', fontWeight: 700 }}>
                                D
                            </span>
                        </div>
                    )}
                </div>

                {/* Right side: Content */}
                <div
                    style={{
                        width: '60%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '50px',
                        backgroundColor: 'white',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '30px',
                        }}
                    >
                        {/* Logo */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <div
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    backgroundColor: '#135c51',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    color: 'white',
                                }}
                            >
                                D
                            </div>
                            <span style={{ fontSize: '20px', fontWeight: 600, color: '#135c51' }}>
                                Datify
                            </span>
                        </div>
                        <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                            BLOG
                        </span>
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
                        <h1
                            style={{
                                fontSize: '36px',
                                fontWeight: 700,
                                color: '#111827',
                                margin: 0,
                                marginBottom: '16px',
                                lineHeight: 1.2,
                                letterSpacing: '-0.5px',
                            }}
                        >
                            {title}
                        </h1>
                        {excerpt && (
                            <p
                                style={{
                                    fontSize: '16px',
                                    color: '#6b7280',
                                    margin: 0,
                                    lineHeight: 1.5,
                                }}
                            >
                                {excerpt}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingTop: '20px',
                            borderTop: '1px solid #e5e7eb',
                        }}
                    >
                        <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                            godatify.com
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
