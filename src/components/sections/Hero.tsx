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
            <h1 className="hero-title reveal">
              Datificando las Organizaciones
            </h1>
            <p className="hero-subtitle reveal">
              Te acompañamos en cada paso para transformar tus datos en decisiones que impulsen el crecimiento de tu
              organización.
            </p>
            <a href="#contacto" className="hero-cta reveal">
              Contáctanos
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          Descubre más
        </div>
      </section>

      <style jsx global>{`
        .hero-title {
          font-size: var(--font-size-6xl);
          font-weight: var(--font-weight-extrabold);
          color: var(--color-white);
          margin-bottom: var(--space-6);
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: var(--font-size-xl);
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: var(--space-10);
          line-height: var(--line-height-relaxed);
          max-width: 700px;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-5) var(--space-10);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          background: linear-gradient(135deg, #26a86f 0%, #1C7C54 100%);
          color: var(--color-white);
          border-radius: var(--radius-full);
          box-shadow: 0 20px 40px rgba(28, 124, 84, 0.3);
          transition: all var(--transition-base);
          text-decoration: none;
        }

        .hero-cta:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 50px rgba(28, 124, 84, 0.4);
        }

        .scroll-indicator {
          position: absolute;
          bottom: var(--space-8);
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          color: var(--color-white);
          text-align: center;
          font-size: var(--font-size-sm);
          animation: bounce 2s infinite;
        }

        .scroll-indicator::after {
          content: '';
          display: block;
          width: 24px;
          height: 24px;
          margin: 0.5rem auto 0;
          border-left: 2px solid white;
          border-bottom: 2px solid white;
          transform: rotate(-45deg);
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: var(--font-size-4xl);
          }
          .hero-subtitle {
            font-size: var(--font-size-base);
          }
          .hero-container {
            padding-left: 1.5rem !important;
          }
        }
      `}</style>
    </>
  );
}
