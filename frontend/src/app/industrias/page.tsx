import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
    'Industrias - Soluciones por Sector',
    'Soluciones de Data Analytics especializadas para industrias: cervecera, logística, agrícola y más. Descubre cómo transformamos cada sector.',
    '/industrias'
);

// Redirect /industrias to the first industry page
// Individual industry pages: /industrias/cervecera, /industrias/logistica, etc.
export default function IndustriasPage() {
    redirect('/industrias/cervecera');
}
