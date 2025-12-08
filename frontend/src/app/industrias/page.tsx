import { Metadata } from 'next';
import IndustriesHero from '@/components/industrias/IndustriesHero';
import IndustryShowcase from '@/components/industrias/IndustryShowcase';
import { api } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
    const { hero } = await api.industries.getPageData();
    return {
        title: 'Industrias | Datify',
        description: hero.description,
    };
}

export default async function IndustriasPage() {
    const { hero, sectors, cases } = await api.industries.getPageData();

    return (
        <main>
            <IndustriesHero hero={hero} />
            <IndustryShowcase sectors={sectors} cases={cases} />
        </main>
    );
}
