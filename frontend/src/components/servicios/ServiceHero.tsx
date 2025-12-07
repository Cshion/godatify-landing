import PageHero from '@/components/common/PageHero';

interface ServiceHeroProps {
    title: string;
    description: string;
    phrases?: string[];
    backgroundImage?: string;
}

export default function ServiceHero({ title, description, phrases, backgroundImage }: ServiceHeroProps) {
    return <PageHero title={title} subtitle={description} backgroundImage={backgroundImage || "/images/hero-services.png"} phrases={phrases} />;
}
