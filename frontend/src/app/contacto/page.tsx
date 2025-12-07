import { api } from '@/lib/api';
import ContactHero from '@/components/contact/ContactHero';
import Offices from '@/components/contact/Offices';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contacto | Datify',
    description: 'Hablemos de tus datos. Agenda una llamada y descubre cómo podemos ayudarte a transformar tu organización.',
};

export default async function ContactPage() {
    const contactContent = await api.contact.getPageContent();
    const socialLinks = await api.company.getSocialLinks();

    return (
        <main>
            <ContactHero
                hero={contactContent.hero}
                formLabels={contactContent.form.labels}
                formTitle={contactContent.form.title}
                formSubtitle={contactContent.form.subtitle}
                offices={contactContent.officesSection.offices}
                socialLinks={socialLinks}
            />
        </main>
    );
}
