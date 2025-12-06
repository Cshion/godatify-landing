import { api } from '@/lib/api';
import PageHero from '@/components/common/PageHero';

export default async function IndustriesHero() {
    const hero = await api.industries.getHero();

    return <PageHero title={hero.title} subtitle={hero.description} backgroundImage="/images/hero-industries.png" phrases={hero.phrases} />;
}
