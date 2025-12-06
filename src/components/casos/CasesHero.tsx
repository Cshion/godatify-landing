import PageHero from '@/components/common/PageHero';

export default function CasesHero() {
    return (
        <PageHero
            title="Impacto Real"
            subtitle="No solo entregamos tecnología, entregamos resultados de negocio medibles. Descubre cómo transformamos datos en rentabilidad."
            backgroundImage="/images/hero-cases.png"
            phrases={['Evidencia Tangible', 'Retorno de Inversión', 'Historias de Éxito']}
        />
    );
}
