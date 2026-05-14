import { NosotrosContent } from '@/types';
import PageHero from '@/components/common/PageHero';

interface NosotrosHeroProps {
    hero: NosotrosContent['hero'];
}

export default function NosotrosHero({ hero }: NosotrosHeroProps) {
    return <PageHero title={hero.title} subtitle={hero.subtitle} backgroundImage={hero.backgroundImage || "/images/hero-nosotros.webp"} phrases={hero.phrases} />;
}
