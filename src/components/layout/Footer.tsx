'use client';

import Link from 'next/link';
import { COMPANY_INFO, FOOTER_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="contacto">
      <div className="container mx-auto px-6 py-16">
        <div className={styles.footerGrid}>
          {/* Company Info */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>{COMPANY_INFO.name}</h3>
            <p className={styles.footerDescription}>
              {COMPANY_INFO.description}
            </p>
            <div className={styles.socialLinks}>
              {SOCIAL_LINKS.map((social) => (
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
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Enlaces Rápidos</h4>
            <ul className={styles.footerLinks}>
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Servicios</h4>
            <ul className={styles.footerLinks}>
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Contacto</h4>
            <ul className={styles.footerLinks}>
              {FOOTER_LINKS.contact.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            &copy; {currentYear} {COMPANY_INFO.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
