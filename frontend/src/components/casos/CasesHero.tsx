export default function CasesHero({ hero }: { hero: any }) {
    if (!hero) return null;
    return (
        <PageHero
            title={hero.title}
            subtitle={hero.subtitle}
            backgroundImage={hero.backgroundImage}
            phrases={hero.phrases}
        />
    );
}
