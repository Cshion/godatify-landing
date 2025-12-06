import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseDetail from '@/components/casos/CaseDetail';
import { CASES_CONTENT } from '@/data/cases';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return CASES_CONTENT.map((caseStudy) => ({
        slug: caseStudy.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const caseStudy = CASES_CONTENT.find((c) => c.slug === slug);

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
    const caseStudy = CASES_CONTENT.find((c) => c.slug === slug);

    if (!caseStudy) {
        notFound();
    }

    return (
        <main>
            <CaseDetail caseStudy={caseStudy} />
        </main>
    );
}
