import { ImageResponse } from 'next/og';
import { api } from '@/lib/api';

// Image metadata
export const alt = 'Datify - Servicios de Data Analytics';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { service } = await api.services.getDetailPageData(slug);

    const title = service?.title || 'Servicio';
    const description = service?.description 
        ? `${service.description.slice(0, 120)}...` 
        : 'Servicios de Data Analytics para tu empresa';

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#135c51',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background pattern */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-100px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-150px',
                        left: '-150px',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.08)',
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
                                padding: '8px 16px',
                                borderRadius: '20px',
                            }}
                        >
                            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                                SERVICIOS
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
                                fontSize: '54px',
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
                                maxWidth: '750px',
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
                        <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>
                            godatify.com/servicios
                        </span>
                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                            Data Analytics • Business Intelligence • AI
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
