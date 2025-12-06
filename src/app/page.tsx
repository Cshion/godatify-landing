
import Hero from '@/components/sections/Hero';
import Nosotros from '@/components/sections/Nosotros';
import Clients from '@/components/sections/Clients';
import Services from '@/components/sections/Services';
import Cases from '@/components/sections/Cases';
import Testimonials from '@/components/sections/Testimonials';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Nosotros />
        <Clients />
        <Services />
        <Cases />
        <Testimonials />
      </main>
      <ScrollReveal />
    </>
  );
}
