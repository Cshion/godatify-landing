import { Testimonial } from '@/types';

export interface TestimonialWithId extends Testimonial {
    id: number;
    id: number;
    quote: string;
}

// Adapting to match the JSON structure used in Testimonials.tsx
// The JSON has: id, text, author, role.
// My Testimonial type has: quote, author, role, linkedIn.
// I will create a specific type for this or adapt the component.
// Let's adapt the component to use the standard Testimonial type, but for now, let's replicate the data structure to minimize friction, 
// then we can refactor the component to use 'quote' instead of 'text'.

export const TESTIMONIALS_CONTENT: TestimonialWithId[] = [
    {
        id: 1,
        quote: "Es increíble, es realmente maravilloso. Datify ha superado completamente nuestras expectativas. La facilidad de lectura y el análisis de datos han transformado nuestra forma de trabajar.",
        author: "Cliente Satisfecho",
        role: "CEO, Empresa",
        image: "https://ui-avatars.com/api/?name=Cliente+Satisfecho&background=random"
    },
    {
        id: 2,
        quote: "Datify ha transformado completamente nuestra capacidad de tomar decisiones basadas en datos. El equipo es profesional y los resultados son excepcionales.",
        author: "Cliente Satisfecho",
        role: "Director, Organización",
        image: "https://ui-avatars.com/api/?name=Cliente+Satisfecho&background=random"
    },
    {
        id: 3,
        quote: "La implementación fue rápida y eficiente. Ahora tenemos visibilidad completa de nuestros procesos y podemos optimizar nuestras operaciones de manera efectiva.",
        author: "Cliente Satisfecho",
        role: "Gerente, Compañía",
        image: "https://ui-avatars.com/api/?name=Cliente+Satisfecho&background=random"
    },
    {
        id: 4,
        quote: "El soporte y la atención al cliente son excepcionales. Siempre están disponibles para ayudarnos y resolver cualquier duda. Una inversión que realmente vale la pena.",
        author: "María González",
        role: "CFO, Tech Solutions",
        image: "https://ui-avatars.com/api/?name=Maria+Gonzalez&background=random"
    },
    {
        id: 5,
        quote: "Los insights que hemos obtenido gracias a Datify han sido fundamentales para nuestro crecimiento. Recomiendo sus servicios sin dudarlo.",
        author: "Carlos Mendoza",
        role: "VP Operaciones, Retail Corp",
        image: "https://ui-avatars.com/api/?name=Carlos+Mendoza&background=random"
    },
    {
        id: 6,
        quote: "Datify nos ayudó a centralizar toda nuestra información y ahora podemos tomar decisiones estratégicas con confianza. Un cambio total en nuestra organización.",
        author: "Ana Rodríguez",
        role: "Directora General, Innovación SA",
        image: "https://ui-avatars.com/api/?name=Ana+Rodriguez&background=random"
    }
];
