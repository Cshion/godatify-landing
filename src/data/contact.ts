import { ContactPageContent } from '@/types';

export const CONTACT_CONTENT: ContactPageContent = {
    hero: {
        title: 'Hablemos de tus Datos',
        subtitle: '¿Listo para transformar tu organización? Cuéntanos tu desafío y encontremos juntos la solución.',
    },
    offices: [
        {
            country: 'Perú',
            city: 'Lima',
            address: 'Av. Jorge Basadre 607, San Isidro',
            phone: '+51 999 999 999',
            email: 'contacto.pe@godatify.com',
            image: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&q=80&w=800',
        },
        {
            country: 'España',
            city: 'Madrid',
            address: 'Paseo de la Castellana 259',
            phone: '+34 91 123 45 67',
            email: 'contacto.es@godatify.com',
            image: 'https://images.unsplash.com/photo-1517816001150-5d66d5b03730?auto=format&fit=crop&q=80&w=800',
        },
    ],
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
