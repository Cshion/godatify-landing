'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CompanyInfo, FooterLinks, SocialLink } from '@/types';
import styles from './Footer.module.css';

interface FooterProps {
  companyInfo: CompanyInfo;
  footerLinks: FooterLinks;
  socialLinks: SocialLink[];
}

export default function Footer({ companyInfo, footerLinks, socialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="contacto">
      <div className="container mx-auto px-6 py-16">
        <div className={styles.footerGrid}>
          {/* Company Info */}
          <div className={styles.footerColumn}>
            <Link href="/" className="mb-6 inline-block">
              <Image
                src="/images/logo.png"
                alt="Datify Logo"
                width={140}
                height={46}
                className="brightness-0 invert opacity-90"
              />
            </Link>
            <p className={styles.footerDescription}>
              {companyInfo.description}
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => (
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
              {footerLinks.quickLinks.map((link) => (
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
              {footerLinks.services.map((link) => (
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
              {footerLinks.contact.map((link) => (
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
            &copy; {currentYear} {companyInfo.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
