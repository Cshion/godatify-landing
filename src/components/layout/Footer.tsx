'use client';

import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <footer className="footer" id="contacto">
                <div className="container mx-auto px-6 py-16">
                    <div className="footer-grid">
                        {/* Company Info */}
                        <div className="footer-column">
                            <h3 className="footer-title">DATIFY</h3>
                            <p className="footer-description">
                                En Datify acompañamos a las organizaciones a descubrir el verdadero poder de sus
                                datos, transformando la forma en que las organizaciones piensan, operan y deciden.
                            </p>
                            <div className="social-links">
                                {[
                                    { icon: 'linkedin-in', url: 'https://www.linkedin.com/company/godatify/' },
                                    { icon: 'facebook-f', url: 'https://www.facebook.com/godatify' },
                                    { icon: 'instagram', url: 'https://www.instagram.com/godatify/' },
                                    { icon: 'youtube', url: 'https://godatify.com' },
                                ].map((social) => (
                                    <a
                                        key={social.icon}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                    >
                                        <i className={`fab fa-${social.icon}`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-column">
                            <h4 className="footer-heading">Enlaces Rápidos</h4>
                            <ul className="footer-links">
                                <li><Link href="#inicio">Inicio</Link></li>
                                <li><Link href="#nosotros">Nosotros</Link></li>
                                <li><Link href="#servicios">Servicios</Link></li>
                                <li><Link href="#casos">Casos de éxito</Link></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="footer-column">
                            <h4 className="footer-heading">Servicios</h4>
                            <ul className="footer-links">
                                <li><Link href="#dp">Digital Platform</Link></li>
                                <li><Link href="#de">Data Engineering</Link></li>
                                <li><Link href="#bd">Big Data Management</Link></li>
                                <li><Link href="#bi">Business Intelligence</Link></li>
                                <li><Link href="#ba">Business Analytics</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="footer-column">
                            <h4 className="footer-heading">Contacto</h4>
                            <ul className="footer-links">
                                <li><Link href="#blog">Blog</Link></li>
                                <li><Link href="#contacto">Contacto</Link></li>
                                <li><Link href="#">Términos y Políticas</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="footer-bottom">
                        <p className="footer-copyright">
                            &copy; {currentYear} Datify. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
        .footer {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(28, 124, 84, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(28, 124, 84, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .footer-column {
          display: flex;
          flex-direction: column;
        }

        .footer-title {
          font-size: 1.875rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          letter-spacing: 0.05em;
        }

        .footer-description {
          color: #d1d5db;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .social-links {
          display: flex;
          gap: 0.75rem;
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.1);
          color: #d1d5db;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .social-link:hover {
          background: #1C7C54;
          color: white;
          transform: translateY(-3px);
        }

        .footer-heading {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-links li {
          margin: 0;
        }

        .footer-links a {
          color: #d1d5db;
          text-decoration: none;
          transition: color 0.3s ease;
          font-size: 0.95rem;
        }

        .footer-links a:hover {
          color: #26a86f;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .footer-copyright {
          color: #9ca3af;
          font-size: 0.875rem;
        }
      `}</style>
        </>
    );
}
