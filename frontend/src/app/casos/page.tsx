import { Metadata } from 'next';
import CasesHero from '@/components/casos/CasesHero';
import CasesGrid from '@/components/casos/CasesGrid';
import { api } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Casos de Éxito | Datify',
    description: 'Descubre cómo hemos ayudado a empresas líderes a transformar sus datos en resultados de negocio tangibles.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function CasosPage() {
    const { hero } = await api.cases.getPageData();
    const { cases, total } = await api.cases.getCases({ start: 0, limit: 6 });

    return (
        <main>
            <CasesHero hero={hero} />
            <CasesGrid cases={cases} initialTotal={total} />
        </main>
    );
}
