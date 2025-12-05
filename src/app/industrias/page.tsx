import { Metadata } from 'next';
import IndustriesHero from '@/components/industrias/IndustriesHero';
import IndustryShowcase from '@/components/industrias/IndustryShowcase';
import { INDUSTRIES_CONTENT } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'Industrias | Datify',
    description: INDUSTRIES_CONTENT.hero.description,
};

export default function IndustriasPage() {
    return (
        <main>
            <IndustriesHero />
            <IndustryShowcase />
        </main>
    );
}
