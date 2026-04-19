'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NavLink, SocialLink, ServiceNav, Sector } from '@/types';
import styles from './Header.module.css';

interface HeaderProps {
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  servicesNav: ServiceNav[];
  sectorsNav: Sector[];
  servicesLabel: string;
  logo: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
}

export default function Header({ navLinks, socialLinks, servicesNav, sectorsNav, servicesLabel, logo }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
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
              {navLinks.filter(l => l.href !== '/industrias').slice(0, 2).map((link) => (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}

              {/* Services Dropdown */}
              <div className={styles.dropdown}>
                <button className={`${styles.navLink} ${styles.dropdownToggle}`}>
                  {servicesLabel}
                </button>
                <div className={styles.dropdownMenu}>
                  {servicesNav.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/servicios/${service.slug}`}
                      className={styles.dropdownItem}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Industries: Mega Menu OR Standard Link */}
              {sectorsNav && sectorsNav.length > 0 ? (
                <div className={styles.dropdown}>
                  <button className={`${styles.navLink} ${styles.dropdownToggle}`}>
                    Industrias
                  </button>
                  <div className={`${styles.dropdownMenu} ${styles.megaMenu}`}>
                    {sectorsNav.map((sector) => (
                      <div key={sector.slug} className={styles.megaMenuColumn}>
                        <h4 className={styles.megaMenuTitle}>{sector.title}</h4>
                        <div className={styles.megaMenuList}>
                          {(sector.industries || []).map((ind) => (
                            <Link
                              key={ind.slug}
                              href={`/industrias/${ind.slug}`}
                              className={styles.dropdownItem}
                            >
                              {ind.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Link href="/industrias" className={styles.navLink}>
                  Industrias
                </Link>
              )}

              {navLinks.filter(l => l.href !== '/industrias').slice(2).map((link) => (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
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
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-navigation"
            className={styles.mobileMenu}
            aria-label="Navegación móvil"
          >
            {/* Regular links before dropdowns */}
            {navLinks.filter(l => l.href !== '/industrias').slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.mobileLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Services Accordion */}
            <div className={styles.mobileDropdown}>
              <button
                className={styles.mobileDropdownToggle}
                onClick={() => setOpenMobileDropdown(openMobileDropdown === 'services' ? null : 'services')}
                aria-expanded={openMobileDropdown === 'services'}
              >
                {servicesLabel}
                <i
                  className={`fas fa-chevron-down ${styles.mobileDropdownIcon} ${openMobileDropdown === 'services' ? styles.open : ''}`}
                  aria-hidden="true"
                />
              </button>
              {openMobileDropdown === 'services' && (
                <div className={styles.mobileSubmenu}>
                  {servicesNav.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/servicios/${service.slug}`}
                      className={styles.mobileSubmenuLink}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Industries Accordion */}
            {sectorsNav && sectorsNav.length > 0 && (
              <div className={styles.mobileDropdown}>
                <button
                  className={styles.mobileDropdownToggle}
                  onClick={() => setOpenMobileDropdown(openMobileDropdown === 'industries' ? null : 'industries')}
                  aria-expanded={openMobileDropdown === 'industries'}
                >
                  Industrias
                  <i
                    className={`fas fa-chevron-down ${styles.mobileDropdownIcon} ${openMobileDropdown === 'industries' ? styles.open : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {openMobileDropdown === 'industries' && (
                  <div className={styles.mobileSubmenu}>
                    {sectorsNav.map((sector) => (
                      <Fragment key={sector.slug}>
                        <span className={styles.mobileSubmenuHeader}>{sector.title}</span>
                        {(sector.industries || []).map((ind) => (
                          <Link
                            key={ind.slug}
                            href={`/industrias/${ind.slug}`}
                            className={styles.mobileSubmenuLink}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {ind.title}
                          </Link>
                        ))}
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Regular links after dropdowns */}
            {navLinks.filter(l => l.href !== '/industrias').slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.mobileLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile CTA */}
            <Link
              href="/contacto"
              className={styles.mobileCta}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contáctanos
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
