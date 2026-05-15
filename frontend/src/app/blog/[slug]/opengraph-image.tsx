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
        ? (post.excerpt.length > 150 ? `${post.excerpt.slice(0, 150)}...` : post.excerpt)
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
                        width: '50%',
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
                        width: '50%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '60px 50px',
                        backgroundColor: 'white',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '42px',
                            fontWeight: 700,
                            color: '#111827',
                            margin: 0,
                            marginBottom: '24px',
                            lineHeight: 1.2,
                            letterSpacing: '-0.5px',
                        }}
                    >
                        {title}
                    </h1>
                    {excerpt && (
                        <p
                            style={{
                                fontSize: '20px',
                                color: '#4b5563',
                                margin: 0,
                                lineHeight: 1.6,
                            }}
                        >
                            {excerpt}
                        </p>
                    )}
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
