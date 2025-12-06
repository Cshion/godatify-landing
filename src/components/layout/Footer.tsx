'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CompanyInfo, FooterLinks, SocialLink } from '@/types';
import styles from './Footer.module.css';

interface FooterLabels {
  quickLinks: string;
  services: string;
  contact: string;
  rights: string;
}

interface FooterProps {
  companyInfo: CompanyInfo;
  footerLinks: FooterLinks;
  socialLinks: SocialLink[];
  labels: FooterLabels;
}

export default function Footer({ companyInfo, footerLinks, socialLinks, labels }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="contacto">
      <div className="container mx-auto px-6 py-16">
        <div className={styles.footerGrid}>
          {/* Company Info */}
          <div className={styles.footerColumn}>
            <Link href="/" className="mb-6 inline-block">
              <Image
                src="/images/logo-brand-green.png"
                alt={companyInfo.logo.alt}
                width={140}
                height={46}
                className="opacity-90"
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
            <h4 className={styles.footerHeading}>{labels.quickLinks}</h4>
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
            <h4 className={styles.footerHeading}>{labels.services}</h4>
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
            <h4 className={styles.footerHeading}>{labels.contact}</h4>
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
