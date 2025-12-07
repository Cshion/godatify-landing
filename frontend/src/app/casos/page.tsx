import { Metadata } from 'next';
import CasesHero from '@/components/casos/CasesHero';
import CasesGrid from '@/components/casos/CasesGrid';
import { api } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Casos de Éxito | Datify',
    description: 'Descubre cómo hemos ayudado a empresas líderes a transformar sus datos en resultados de negocio tangibles.',
};

export default async function CasosPage() {
    const cases = await api.cases.getAll();

    return (
        <main>
            <CasesHero />
            <CasesGrid cases={cases} />
        </main>
    );
}
