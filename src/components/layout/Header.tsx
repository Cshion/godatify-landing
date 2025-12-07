'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NavLink, SocialLink, ServiceNav } from '@/types';
import styles from './Header.module.css';

interface HeaderProps {
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  servicesNav: ServiceNav[];
  servicesLabel: string;
  logo: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
}

export default function Header({ navLinks, socialLinks, servicesNav, servicesLabel, logo }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Check if we are on a case detail page or blog detail page
  const isCaseDetail = pathname.startsWith('/casos/') && pathname !== '/casos';
  const isBlogDetail = pathname.startsWith('/blog/') && pathname !== '/blog';
  const shouldForceScrolled = isCaseDetail || isBlogDetail;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Force scrolled style on case/blog detail pages or when actually scrolled
  const headerClass = `${styles.header} ${isScrolled || shouldForceScrolled ? styles.scrolled : ''}`;

  return (
    <>
      <header className={headerClass}>
        <div className="container mx-auto px-6">
          <div className={styles.headerContent}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <div className="relative" style={{ width: logo.width, height: logo.height }}>
                {/* White Logo (Default) */}
                <Image
                  src={logo.url}
                  alt={logo.alt}
                  fill
                  className={`${styles.logoImg} transition-opacity duration-300`}
                  style={{
                    objectFit: 'contain',
                    opacity: (isScrolled || shouldForceScrolled) ? 0 : 1
                  }}
                  priority
                />
                {/* Green Logo (Scrolled) */}
                <Image
                  src="/images/logo-brand-harmonized.png"
                  alt={logo.alt}
                  fill
                  className={`${styles.logoImg} transition-opacity duration-300`}
                  style={{
                    objectFit: 'contain',
                    opacity: (isScrolled || shouldForceScrolled) ? 1 : 0
                  }}
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.navMenu}>
              {navLinks.slice(0, 3).map((link) => (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}

              {/* Services Dropdown */}
              <div className={styles.dropdown}>
                <button className={`${styles.navLink} ${styles.dropdownToggle}`}>
                  {servicesLabel}
                  <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className={styles.dropdownMenu}>
                  {servicesNav.map((service) => (
                    <Link key={service.id} href={`/servicios/${service.id}`} className={styles.dropdownItem}>
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>

              {
                navLinks.slice(3).map((link) => (
                  <Link key={link.href} href={link.href} className={styles.navLink}>
                    {link.label}
                  </Link>
                ))
              }
            </nav >

            {/* Contact CTA */}
            <div className={styles.ctaWrapper}>
              <Link href="/contacto" className={styles.contactCta}>
                Contáctanos
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={styles.menuToggle}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {
          isMobileMenuOpen && (
            <div className={styles.mobileMenu}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.mobileLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          )
        }
      </header >
    </>
  );
}
