import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import NosotrosHero from '@/components/nosotros/NosotrosHero';
import NosotrosTabs from '@/components/nosotros/NosotrosTabs';
import Clients from '@/components/sections/Clients';

export const metadata: Metadata = {
    title: 'Nosotros | Datify',
    description: 'Conoce a Datify, tu aliado estratégico en la transformación de datos. Descubre nuestra misión, visión y los valores que nos impulsan.',
};

export default function NosotrosPage() {
    return (
        <>
            <Header />
            <main>
                <NosotrosHero />
                <NosotrosTabs />
                <Clients />
            </main>
            <Footer />
            <ScrollReveal />

            {/* Font Awesome */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />
        </>
    );
}
