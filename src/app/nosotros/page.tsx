import type { Metadata } from 'next';

import ScrollReveal from '@/components/ui/ScrollReveal';
import NosotrosHero from '@/components/nosotros/NosotrosHero';
import NosotrosTabs from '@/components/nosotros/NosotrosTabs';
import Clients from '@/components/sections/Clients';

import { api } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
    const content = await api.about.getContent();
    return {
        title: 'Nosotros | Datify',
        description: 'Conoce a Datify, tu aliado estratégico en la transformación de datos. Descubre nuestra misión, visión y los valores que nos impulsan.',
    };
}

export default async function NosotrosPage() {
    const [content, videoConfig, clients, sectionLabels] = await Promise.all([
        api.about.getContent(),
        api.home.getVideoConfig(),
        api.home.getClients(),
        api.home.getSectionLabels()
    ]);

    return (
        <>
            <main>
                <NosotrosHero hero={content.hero} />
                <NosotrosTabs content={content} videoConfig={videoConfig} />
                <Clients clients={clients} title={sectionLabels.clients.title} />
            </main>
            <ScrollReveal />

            {/* Font Awesome */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />
        </>
    );
}
