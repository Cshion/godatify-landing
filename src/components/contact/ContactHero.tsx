import { ContactPageContent, ContactFormLabels, Office, SocialLink } from '@/types';
import ContactForm from './ContactForm';
import Offices from './Offices';
import PageHero from '@/components/common/PageHero';
import styles from './ContactHero.module.css';

interface ContactHeroProps {
    hero: ContactPageContent['hero'];
    offices: Office[];
    formLabels: ContactFormLabels;
    formTitle: string;
    formSubtitle: string;
    socialLinks: SocialLink[];
}

export default function ContactHero({ hero, offices, formLabels, formTitle, formSubtitle, socialLinks }: ContactHeroProps) {
    return (
        <>
            {/* Hero Banner Section using PageHero */}
            <PageHero title={hero.title} subtitle={hero.subtitle} />

            {/* Content Section */}
            <section className={styles.contentSection}>
                <div className="container mx-auto px-6">
                    <div className={styles.grid}>
                        {/* Left Column: Form */}
                        <div className={styles.formColumn}>
                            <ContactForm
                                title={formTitle}
                                subtitle={formSubtitle}
                                labels={formLabels}
                            />
                        </div>

                        {/* Right Column: Socials + Offices */}
                        <div className={styles.sidebar}>
                            {/* Social Links */}
                            <div className={styles.socialWrapper}>
                                <p className={styles.socialLabel}>Síguenos en:</p>
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

                            {/* Global Hubs */}
                            <Offices
                                title="Presencia Global"
                                subtitle="Nuestros hubs estratégicos"
                                offices={offices}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
