'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, SERVICES_NAV, SOCIAL_LINKS } from '@/lib/constants';
import styles from './Header.module.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Check if we are on a case detail page (starts with /casos/ but is not just /casos)
  const isCaseDetail = pathname.startsWith('/casos/') && pathname !== '/casos';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Force scrolled style on case detail pages or when actually scrolled
  const headerClass = `${styles.header} ${isScrolled || isCaseDetail ? styles.scrolled : ''}`;

  return (
    <>
      <header className={headerClass}>
        <div className="container mx-auto px-6">
          <div className={styles.headerContent}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <Image
                src="/images/logo.png"
                alt="Datify Logo"
                width={120}
                height={40}
                className={styles.logoImg}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.navMenu}>
              {NAV_LINKS.slice(0, 3).map((link) => (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}

              {/* Services Dropdown */}
              <div className={styles.dropdown}>
                <button className={`${styles.navLink} ${styles.dropdownToggle}`}>
                  Servicios
                  <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className={styles.dropdownMenu}>
                  {SERVICES_NAV.map((service) => (
                    <Link key={service.id} href={`#${service.id}`} className={styles.dropdownItem}>
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>

              {
                NAV_LINKS.slice(3).map((link) => (
                  <Link key={link.href} href={link.href} className={styles.navLink}>
                    {link.label}
                  </Link>
                ))
              }
            </nav >

            {/* Social Links */}
            < div className={styles.socialLinks} >
              {
                SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={social.label}
                  >
                    <i className={`fab fa-${social.icon}`}></i>
                  </a>
                ))
              }
            </div >

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
              {NAV_LINKS.map((link) => (
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
