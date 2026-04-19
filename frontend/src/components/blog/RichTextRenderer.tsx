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
        return <div dangerouslySetInnerHTML={{ __html: content }} className="prose max-w-none text-gray-700" />;
    }

    // Ensure array for BlocksRenderer
    if (!Array.isArray(content)) {
        return null; // or log warning
    }

    return (
        <div className="prose max-w-none text-gray-700">
            <BlocksRenderer
                content={content}
                blocks={{
                    image: ({ image }) => {
                        if (!image) return null;

                        const imageUrl = image.url.startsWith('http')
                            ? image.url
                            : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${image.url}`;

                        return (
                            <div className="my-8 relative w-full h-[400px] rounded-lg overflow-hidden">
                                <Image
                                    src={imageUrl}
                                    alt={image.alternativeText || ''}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {image.caption && (
                                    <div className="absolute bottom-0 left-0 w-full bg-black/50 p-2 text-white text-sm text-center">
                                        {image.caption}
                                    </div>
                                )}
                            </div>
                        );
                    },
                    link: ({ children, url }) => (
                        <Link href={url} className="text-brand-green hover:underline font-medium">
                            {children}
                        </Link>
                    ),
                }}
            />
        </div>
    );
}
