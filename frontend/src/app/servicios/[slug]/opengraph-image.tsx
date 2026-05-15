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
        ? (service.description.length > 150 ? `${service.description.slice(0, 150)}...` : service.description)
        : '';
    const serviceImage = service?.backgroundImage || '';

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
                {/* Left side: Service image */}
                <div
                    style={{
                        width: '50%',
                        height: '100%',
                        display: 'flex',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {serviceImage ? (
                        <img
                            src={serviceImage}
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
                            fontSize: '44px',
                            fontWeight: 700,
                            color: '#111827',
                            margin: 0,
                            marginBottom: '24px',
                            lineHeight: 1.15,
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
