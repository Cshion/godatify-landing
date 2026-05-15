import { api } from '@/lib/api';
import ContactHero from '@/components/contact/ContactHero';
import { Metadata } from 'next';
import { generateContactPageSchema, generateLocalBusinessSchema, generateBreadcrumbSchema } from '@/lib/schemas';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
    'Contacto - Consultoría de Datos',
    'Hablemos de tus datos. Agenda una consulta gratuita y descubre cómo transformar tu organización con Data Analytics y BI. →',
    '/contacto'
);

export default async function ContactPage() {
    const contactContent = await api.contact.getPageContent();
    const { socialLinks, companyInfo } = await api.company.getGlobalData();

    return (
        <main id="main-content">
            {/* ContactPage Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateContactPageSchema())
                }}
            />
            
            {/* LocalBusiness Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateLocalBusinessSchema(companyInfo, socialLinks))
                }}
            />
            
            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateBreadcrumbSchema([
                        { name: 'Inicio', url: 'https://godatify.com/' },
                        { name: 'Contacto' }
                    ]))
                }}
            />
            
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
