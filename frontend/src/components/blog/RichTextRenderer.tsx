'use client';

import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import Image from "next/image";
import Link from "next/link";

interface RichTextRendererProps {
    content: BlocksContent | string | null | undefined;
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
    if (!content) return null;

    // Fallback for string content
    if (typeof content === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // Ensure array for BlocksRenderer
    if (!Array.isArray(content)) {
        return null; // or log warning
    }

    return (
        <div>
            <BlocksRenderer
                content={content}
                blocks={{
                    image: ({ image }) => {
                        if (!image) return null;

                        const imageUrl = image.url.startsWith('http')
                            ? image.url
                            : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${image.url}`;

                        return (
                            <figure style={{ margin: 'var(--space-10) 0' }}>
                                <div style={{ 
                                    position: 'relative', 
                                    width: '100%', 
                                    aspectRatio: '16/10',
                                    borderRadius: 'var(--space-3)',
                                    overflow: 'hidden'
                                }}>
                                    <Image
                                        src={imageUrl}
                                        alt={image.alternativeText || ''}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 100vw, 720px"
                                    />
                                </div>
                                {image.caption && (
                                    <figcaption style={{
                                        marginTop: 'var(--space-3)',
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--color-gray-500)',
                                        textAlign: 'center'
                                    }}>
                                        {image.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );
                    },
                    link: ({ children, url }) => (
                        <Link 
                            href={url} 
                            style={{
                                color: 'var(--color-brand-green)',
                                textDecoration: 'underline',
                                textUnderlineOffset: '2px',
                                fontWeight: 500
                            }}
                        >
                            {children}
                        </Link>
                    ),
                }}
            />
        </div>
    );
}
