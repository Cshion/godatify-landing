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
    const clientName = caseStudy?.client?.anonymous ? 'Confidencial' : (caseStudy?.client?.name || '');
    const industry = caseStudy?.industry || '';
    const description = caseStudy?.description 
        ? (caseStudy.description.length > 100 ? `${caseStudy.description.slice(0, 100)}...` : caseStudy.description)
        : '';

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#0e4a42',
                }}
            >
                {/* Decorative gradient overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '50%',
                        height: '100%',
                        background: 'linear-gradient(135deg, transparent 0%, rgba(19, 92, 81, 0.5) 100%)',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '60px',
                        flex: 1,
                        position: 'relative',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '50px',
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
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    color: '#135c51',
                                }}
                            >
                                D
                            </div>
                            <span
                                style={{
                                    fontSize: '28px',
                                    fontWeight: 600,
                                    color: 'white',
                                }}
                            >
                                Datify
                            </span>
                        </div>

                        {/* Badge */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                padding: '10px 20px',
                                borderRadius: '24px',
                            }}
                        >
                            <span style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>
                                CASO DE ÉXITO
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
                        {/* Client name if available */}
                        {clientName && (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '16px',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '18px',
                                        color: 'rgba(255,255,255,0.7)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                    }}
                                >
                                    {clientName}
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        <h1
                            style={{
                                fontSize: '52px',
                                fontWeight: 700,
                                color: 'white',
                                margin: 0,
                                marginBottom: '20px',
                                lineHeight: 1.1,
                                letterSpacing: '-1px',
                                maxWidth: '850px',
                            }}
                        >
                            {title}
                        </h1>

                        {/* Description */}
                        <p
                            style={{
                                fontSize: '20px',
                                color: 'rgba(255,255,255,0.8)',
                                margin: 0,
                                lineHeight: 1.5,
                                maxWidth: '700px',
                            }}
                        >
                            {description}
                        </p>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '40px',
                            paddingTop: '24px',
                            borderTop: '1px solid rgba(255,255,255,0.2)',
                        }}
                    >
                        {industry && (
                            <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)' }}>
                                {industry}
                            </span>
                        )}
                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                            godatify.com/casos
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
