import PageHero from '@/components/common/PageHero';

export default function IndustriesHero({ hero }: { hero: any }) {
    if (!hero) return null;
    return <PageHero title={hero.title} subtitle={hero.description} backgroundImage={hero.backgroundImage || "/images/hero-industries.webp"} phrases={hero.phrases} />;
}
