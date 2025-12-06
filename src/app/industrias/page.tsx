import { Metadata } from 'next';
import IndustriesHero from '@/components/industrias/IndustriesHero';
import IndustryShowcase from '@/components/industrias/IndustryShowcase';
import { api } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
    const hero = await api.industries.getHero();
    return {
        title: 'Industrias | Datify',
        description: hero.description,
    };
}

export default function IndustriasPage() {
    return (
        <main>
            <IndustriesHero />
            <IndustryShowcase />
        </main>
    );
}
