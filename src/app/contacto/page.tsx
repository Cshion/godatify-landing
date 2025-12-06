import { api } from '@/lib/api';
import ContactHero from '@/components/contact/ContactHero';
import Offices from '@/components/contact/Offices';
import ContactForm from '@/components/contact/ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contacto | Datify',
    description: 'Hablemos de tus datos. Agenda una llamada y descubre cómo podemos ayudarte a transformar tu organización.',
};

export default async function ContactPage() {
    const contactContent = await api.contact.getPageContent();

    return (
        <main>
            <ContactHero hero={contactContent.hero} />
            <Offices offices={contactContent.offices} />
            <ContactForm
                title={contactContent.form.title}
                subtitle={contactContent.form.subtitle}
                labels={contactContent.form.labels}
            />
        </main>
    );
}
