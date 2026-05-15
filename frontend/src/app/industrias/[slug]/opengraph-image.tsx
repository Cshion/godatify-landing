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
        ? (industry.description.length > 80 ? `${industry.description.slice(0, 80)}...` : industry.description)
        : 'Soluciones de data analytics para tu sector';
    const industryImage = industry?.image || '';

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    backgroundColor: '#135c51',
                }}
            >
                {/* Left side: Industry image */}
                <div
                    style={{
                        width: '40%',
                        height: '100%',
                        display: 'flex',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {industryImage ? (
                        <img
                            src={industryImage}
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
                                backgroundColor: '#0e4a42',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <span style={{ fontSize: '100px', color: 'rgba(255,255,255,0.1)', fontWeight: 700 }}>
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
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#135c51',
                                }}
                            >
                                D
                            </div>
                            <span style={{ fontSize: '22px', fontWeight: 600, color: 'white' }}>
                                Datify
                            </span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>
                            INDUSTRIA
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
                                fontSize: '44px',
                                fontWeight: 700,
                                color: 'white',
                                margin: 0,
                                marginBottom: '16px',
                                lineHeight: 1.15,
                                letterSpacing: '-0.5px',
                            }}
                        >
                            {title}
                        </h1>
                        <p
                            style={{
                                fontSize: '18px',
                                color: 'rgba(255,255,255,0.85)',
                                margin: 0,
                                lineHeight: 1.5,
                            }}
                        >
                            {description}
                        </p>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingTop: '20px',
                            borderTop: '1px solid rgba(255,255,255,0.2)',
                        }}
                    >
                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
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
