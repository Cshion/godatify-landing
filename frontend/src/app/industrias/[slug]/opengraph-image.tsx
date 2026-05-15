import { ImageResponse } from 'next/og';
import { api } from '@/lib/api';

// Image metadata
export const alt = 'Datify - Data Analytics para tu Industria';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { industry } = await api.industries.getIndustryBySlug(slug);

    const title = industry?.title || 'Industria';
    const description = industry?.description 
        ? `${industry.description.slice(0, 120)}...` 
        : 'Data Analytics para tu sector';

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#135c51',
                    padding: '60px',
                }}
            >
                {/* Top bar with logo and category */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '40px',
                    }}
                >
                    {/* Logo text */}
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
                                letterSpacing: '-0.5px',
                            }}
                        >
                            Datify
                        </span>
                    </div>

                    {/* Category badge */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            padding: '8px 16px',
                            borderRadius: '20px',
                        }}
                    >
                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                            INDUSTRIAS
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
                            fontSize: '56px',
                            fontWeight: 700,
                            color: 'white',
                            margin: 0,
                            marginBottom: '16px',
                            lineHeight: 1.1,
                            letterSpacing: '-1px',
                        }}
                    >
                        {title}
                    </h1>

                    {/* Description */}
                    <p
                        style={{
                            fontSize: '22px',
                            color: 'rgba(255,255,255,0.85)',
                            margin: 0,
                            lineHeight: 1.4,
                            maxWidth: '800px',
                        }}
                    >
                        {description}
                    </p>
                </div>

                {/* Bottom bar */}
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
                    <span
                        style={{
                            fontSize: '16px',
                            color: 'rgba(255,255,255,0.7)',
                        }}
                    >
                        godatify.com
                    </span>
                    <span
                        style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.6)',
                        }}
                    >
                        Data Analytics • Business Intelligence • AI
                    </span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
