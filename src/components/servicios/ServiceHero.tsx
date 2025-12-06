import PageHero from '@/components/common/PageHero';

interface ServiceHeroProps {
    title: string;
    subtitle: string;
    description: string;
    image?: string;
}

export default function ServiceHero({ title, description }: ServiceHeroProps) {
    return <PageHero title={title} subtitle={description} backgroundImage="/images/hero-services.png" phrases={['Excelencia Técnica', 'Vanguardia Digital', 'Soluciones a Medida']} />;
}
