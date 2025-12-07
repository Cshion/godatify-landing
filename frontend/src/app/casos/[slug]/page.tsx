import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseDetail from '@/components/casos/CaseDetail';
import { api } from '@/lib/api';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const cases = await api.cases.getAll();
    return cases.map((caseStudy) => ({
        slug: caseStudy.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const caseStudy = await api.cases.getBySlug(slug);

    if (!caseStudy) {
        return {
            title: 'Caso no encontrado | Datify',
        };
    }

    return {
        title: `${caseStudy.title} | Casos de Éxito Datify`,
        description: caseStudy.description,
    };
}

export default async function CaseDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const caseStudy = await api.cases.getBySlug(slug);

    if (!caseStudy) {
        notFound();
    }

    const allCases = await api.cases.getAll();
    const relatedCases = allCases
        .filter(c => c.slug !== caseStudy.slug)
        .slice(0, 3);

    return (
        <main>
            <CaseDetail caseStudy={caseStudy} relatedCases={relatedCases} />
        </main>
    );
}
