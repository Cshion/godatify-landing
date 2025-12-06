import PageHero from '@/components/common/PageHero';

interface ServiceHeroProps {
    title: string;
    description: string;
    phrases?: string[];
}

export default function ServiceHero({ title, description, phrases }: ServiceHeroProps) {
    return <PageHero title={title} subtitle={description} backgroundImage="/images/hero-services.png" phrases={phrases} />;
}
