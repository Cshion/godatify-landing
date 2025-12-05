'use client';

export default function Hero() {
  return (
    <>
      <section
        className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden"
        id="inicio"
        style={{
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(90deg, rgba(19, 92, 81, 0.85) 0%, rgba(19, 92, 81, 0.6) 50%, rgba(19, 92, 81, 0.4) 100%)',
          }}
        />

        <div className="container relative z-10">
          <div className="hero-container max-w-4xl text-left ml-0 pl-8">
            <h1 className="hero-title text-white mb-6 reveal font-extrabold leading-tight">
              Datificando las Organizaciones
            </h1>
            <p className="hero-subtitle text-white/90 mb-10 max-w-2xl reveal leading-relaxed">
              Te acompañamos en cada paso para transformar tus datos en decisiones que impulsen el crecimiento de tu
              organización.
            </p>
            <a
              href="#contacto"
              className="hero-cta inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white rounded-full transition-all duration-300 hover:-translate-y-1 reveal"
              style={{
                background: 'linear-gradient(135deg, #26a86f 0%, #1C7C54 100%)',
                boxShadow: '0 20px 40px rgba(28, 124, 84, 0.3)',
              }}
            >
              Contáctanos
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white text-center text-sm animate-bounce">
          Descubre más
        </div>
      </section>

      <style jsx global>{`
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
        }
        .hero-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.5rem);
        }
        @media (max-width: 768px) {
          .hero-container {
            padding-left: 1.5rem !important;
          }
        }
      `}</style>
    </>
  );
}
