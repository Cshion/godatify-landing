import { api } from '@/lib/api';
import PageHero from '@/components/common/PageHero';
export default async function CasesHero() {
    const { hero } = await api.cases.getPageContent();

    return (
        <PageHero
            title={hero.title}
            subtitle={hero.subtitle}
            backgroundImage={hero.backgroundImage}
            phrases={hero.phrases}
        />
    );
}
