'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const services = [
        { id: 'bd', name: 'Big Data Management (BD)' },
        { id: 'ba', name: 'Business Analytics (BA)' },
        { id: 'bi', name: 'Business Intelligence (BI)' },
        { id: 'de', name: 'Data Engineering (DE)' },
        { id: 'dp', name: 'Digital Platform (DP)' },
    ];

    return (
        <>
            <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container mx-auto px-6">
                    <div className="header-content">
                        {/* Logo */}
                        <Link href="/" className="logo">
                            <Image
                                src="/images/logo.png"
                                alt="Datify Logo"
                                width={120}
                                height={40}
                                className="logo-img"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="nav-menu">
                            <Link href="#inicio" className="nav-link">Inicio</Link>
                            <Link href="#nosotros" className="nav-link">Nosotros</Link>
                            <Link href="#industrias" className="nav-link">Industrias</Link>

                            {/* Services Dropdown */}
                            <div className="dropdown">
                                <button className="nav-link dropdown-toggle">
                                    Servicios
                                    <i className="fas fa-chevron-down ml-1 text-xs"></i>
                                </button>
                                <div className="dropdown-menu">
                                    {services.map((service) => (
                                        <Link key={service.id} href={`#${service.id}`} className="dropdown-item">
                                            {service.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Link href="#casos" className="nav-link">Casos de éxito</Link>
                            <Link href="#blog" className="nav-link">Blog</Link>
                            <Link href="#contacto" className="nav-link">Contacto</Link>
                        </nav>

                        {/* Social Links */}
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

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="menu-toggle"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu">
                        <Link href="#inicio" className="mobile-link">Inicio</Link>
                        <Link href="#nosotros" className="mobile-link">Nosotros</Link>
                        <Link href="#servicios" className="mobile-link">Servicios</Link>
                        <Link href="#casos" className="mobile-link">Casos de éxito</Link>
                        <Link href="#blog" className="mobile-link">Blog</Link>
                        <Link href="#contacto" className="mobile-link">Contacto</Link>
                    </div>
                )}
            </header>

            <style jsx global>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: transparent;
          backdrop-filter: none;
          box-shadow: none;
          transition: all 0.3s ease;
        }

        .header.scrolled {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .logo {
          display: flex;
          align-items: center;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo-img {
          height: 40px;
          width: auto;
        }

        .nav-menu {
          display: none;
          align-items: center;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .nav-menu {
            display: flex;
          }
        }

        .nav-link {
          font-size: 1rem;
          font-weight: 500;
          color: white;
          transition: color 0.3s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .header.scrolled .nav-link {
          color: #374151;
        }

        .nav-link:hover {
          color: #26a86f;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-toggle {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 0.5rem;
          min-width: 16rem;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          padding: 0.5rem 0;
        }

        .dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: block;
          padding: 0.75rem 1rem;
          color: #374151;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: #f9fafb;
          color: #1C7C54;
        }

        .social-links {
          display: none;
          align-items: center;
          gap: 0.75rem;
        }

        @media (min-width: 1024px) {
          .social-links {
            display: flex;
          }
        }

        .social-link {
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .header.scrolled .social-link {
          background: #f3f4f6;
          color: #6b7280;
        }

        .social-link:hover {
          background: #1C7C54;
          color: white;
          transform: translateY(-2px);
        }

        .menu-toggle {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        @media (min-width: 1024px) {
          .menu-toggle {
            display: none;
          }
        }

        .menu-toggle span {
          width: 2rem;
          height: 2px;
          background: white;
          transition: background 0.3s ease;
        }

        .header.scrolled .menu-toggle span {
          background: #374151;
        }

        .mobile-menu {
          display: block;
          background: white;
          border-top: 1px solid #e5e7eb;
          padding: 1rem 0;
        }

        @media (min-width: 1024px) {
          .mobile-menu {
            display: none;
          }
        }

        .mobile-link {
          display: block;
          padding: 0.75rem 1.5rem;
          color: #374151;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .mobile-link:hover {
          color: #1C7C54;
          background: #f9fafb;
        }
      `}</style>
        </>
    );
}
