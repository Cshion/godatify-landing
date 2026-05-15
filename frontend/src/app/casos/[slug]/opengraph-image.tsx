import { ImageResponse } from 'next/og';
import { api } from '@/lib/api';

export const alt = 'Datify - Caso de Éxito';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { caseStudy } = await api.cases.getDetailPageData(slug);
    const caseImage = caseStudy?.image || '';

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
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
                        <span style={{ fontSize: '120px', color: 'white', fontWeight: 700 }}>
                            D
                        </span>
                    </div>
                )}
            </div>
        ),
        { ...size }
    );
}
