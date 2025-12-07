import { ContactPageContent } from '@/types';

export const CONTACT_CONTENT: ContactPageContent = {
    hero: {
        title: 'Hablemos de tus Datos',
        subtitle: '¿Listo para transformar tu organización? Cuéntanos tu desafío y encontremos juntos la solución.',
    },
    officesSection: {
        title: 'Presencia Global',
        subtitle: 'Operamos con una mentalidad remote-first, apoyados por hubs estratégicos para servir a clientes en toda la región.',
        offices: [
            {
                country: 'Perú',
                city: 'Lima',
                address: 'Lima, Perú',
                phone: '+51 999 999 999',
                email: 'contacto.pe@godatify.com',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
            },
            {
                country: 'España',
                city: 'Madrid',
                address: 'Madrid, España',
                phone: '+34 91 123 45 67',
                email: 'contacto.es@godatify.com',
                image: 'https://images.unsplash.com/photo-1577916960096-7c9b32e04eab?auto=format&fit=crop&q=80&w=800',
            },
        ],
    },
    form: {
        title: 'Agenda una Llamada',
        subtitle: 'Completa el formulario y nos pondremos en contacto contigo a la brevedad.',
        labels: {
            name: 'Nombre Completo',
            email: 'Correo Corporativo',
            company: 'Empresa',
            role: 'Cargo',
            message: '¿Cómo podemos ayudarte?',
            submit: 'Enviar Mensaje',
        },
    },
};
