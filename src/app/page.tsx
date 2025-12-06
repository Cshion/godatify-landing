import Hero from '@/components/sections/Hero';
import Nosotros from '@/components/sections/Nosotros';
import Clients from '@/components/sections/Clients';
import Services from '@/components/sections/Services';
import Cases from '@/components/sections/Cases';
import Testimonials from '@/components/sections/Testimonials';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { api } from '@/lib/api';

export default async function Home() {
  const [
    heroContent,
    stats,
    videoConfig,
    clients,
    services,
    cases,
    testimonials,
    carouselConfig,
    sectionLabels
  ] = await Promise.all([
    api.home.getHeroContent(),
    api.home.getStats(),
    api.home.getVideoConfig(),
    api.home.getClients(),
    api.services.getAll(),
    api.cases.getAll(),
    api.testimonials.getAll(),
    api.home.getCarouselConfig(),
    api.home.getSectionLabels()
  ]);

  return (
    <>
      <main>
        <Hero heroContent={heroContent} />
        <Nosotros
          stats={stats}
          videoConfig={videoConfig}
          title={sectionLabels.about.title}
          buttonText={sectionLabels.about.button}
        />
        <Clients
          clients={clients}
          title={sectionLabels.clients.title}
        />
        <Services
          services={services}
          title={sectionLabels.services.title}
          buttonText={sectionLabels.services.button}
        />
        <Cases
          cases={cases}
          title={sectionLabels.cases.title}
          buttonText={sectionLabels.cases.button}
        />
        <Testimonials
          testimonials={testimonials}
          carouselConfig={carouselConfig}
          title={sectionLabels.testimonials.title}
        />
      </main>
      <ScrollReveal />
    </>
  );
}
