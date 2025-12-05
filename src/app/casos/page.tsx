import { Metadata } from 'next';
import CasesHero from '@/components/casos/CasesHero';
import CasesGrid from '@/components/casos/CasesGrid';

export const metadata: Metadata = {
    title: 'Casos de Éxito | Datify',
    description: 'Descubre cómo hemos ayudado a empresas líderes a transformar sus datos en resultados de negocio tangibles.',
};

export default function CasosPage() {
    return (
        <main>
            <CasesHero />
            <CasesGrid />
        </main>
    );
}
