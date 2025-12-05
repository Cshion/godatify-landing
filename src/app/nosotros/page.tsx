import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import NosotrosHero from '@/components/nosotros/NosotrosHero';
import MissionVision from '@/components/nosotros/MissionVision';
import Values from '@/components/nosotros/Values';

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
                <MissionVision />
                <Values />
            </main>
            <Footer />
            <ScrollReveal />

            {/* Font Awesome (if not already loaded globally, but it is in layout, though page.tsx had it too. Keeping it safe or relying on layout) */}
            {/* Actually, page.tsx had it. RootLayout doesn't have it explicitly in the snippet I saw, but page.tsx did. 
          Ideally it should be in RootLayout. I'll check layout.tsx later. For now, I'll assume it's needed or handled. 
          Wait, looking at previous view of layout.tsx, it didn't have FontAwesome link. page.tsx did.
          So I should probably include it here or move it to layout.tsx. 
          Moving it to layout.tsx is better practice, but I'll stick to the pattern for now to avoid side effects, 
          or just add it here to be safe. 
      */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />
        </>
    );
}
