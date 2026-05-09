import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Industrias - Soluciones por Sector | Datify',
    description: 'Soluciones de Data Analytics especializadas para industrias: cervecera, logística, agrícola y más. Descubre cómo transformamos cada sector.',
    alternates: {
        canonical: '/industrias',
    },
    openGraph: {
        title: 'Industrias - Soluciones por Sector | Datify',
        description: 'Soluciones de Data Analytics especializadas para industrias: cervecera, logística, agrícola y más.',
        url: 'https://godatify.com/industrias',
        type: 'website',
        images: [{ url: 'https://godatify.com/images/og-image.png', width: 1200, height: 630 }],
    },
};

// Redirect /industrias to the first industry page
// Individual industry pages: /industrias/cervecera, /industrias/logistica, etc.
export default function IndustriasPage() {
    redirect('/industrias/cervecera');
}
