import Hero from '@/components/sections/Hero';
import Nosotros from '@/components/sections/Nosotros';
import Clients from '@/components/sections/Clients';
import Services from '@/components/sections/Services';
import Cases from '@/components/sections/Cases';
import Testimonials from '@/components/sections/Testimonials';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { api } from '@/lib/api';

export default async function Home() {
  // Fetch ALL Home Page data (Dynamic + Static) in a single "View-Model" request
  // This adheres to the GraphQL philosophy: Ask for exactly what you need for the view, once.
  const {
    hero,
    stats,
    videoConfig,
    carouselConfig,
    sectionLabels,
    clients,
    services,
    cases,
    testimonials
  } = await api.home.getData();

  return (
    <>
      <main>
        <Hero heroContent={hero} />
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
          subtitle={sectionLabels.testimonials.subtitle}
          description={sectionLabels.testimonials.description}
        />
      </main>
      <ScrollReveal />
    </>
  );
}
