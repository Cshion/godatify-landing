import { ImageResponse } from 'next/og';
import { api } from '@/lib/api';

// Image metadata
export const alt = 'Datify - Caso de Éxito';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { caseStudy } = await api.cases.getDetailPageData(slug);

    const title = caseStudy?.title || 'Caso de Éxito';
    const clientName = caseStudy?.client?.anonymous ? '' : (caseStudy?.client?.name || '');
    const description = caseStudy?.description
        ? (caseStudy.description.length > 150 ? `${caseStudy.description.slice(0, 150)}...` : caseStudy.description)
        : '';
    const caseImage = caseStudy?.image || '';

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
                {/* Left side: Case image */}
                <div
                    style={{
                        width: '50%',
                        height: '100%',
                        display: 'flex',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {caseImage ? (
                        <img
                            src={caseImage}
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
                    {clientName && (
                        <span
                            style={{
                                fontSize: '16px',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                marginBottom: '16px',
                            }}
                        >
                            {clientName}
                        </span>
                    )}
                    <h1
                        style={{
                            fontSize: '40px',
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
                    {description && (
                        <p
                            style={{
                                fontSize: '20px',
                                color: '#4b5563',
                                margin: 0,
                                lineHeight: 1.6,
                            }}
                        >
                            {description}
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
