import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
      <Header />
      <main>
        <Hero />
        <Nosotros />
        <Clients />
        <Services />
        <Cases />
        <Testimonials />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
