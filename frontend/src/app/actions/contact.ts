'use server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface ContactFormData {
    name: string;
    email: string;
    company?: string;
    role?: string;
    message: string;
    website?: string; // Honeypot field
    formStartTime?: string; // Timing honeypot
}

export interface ContactSubmissionResult {
    success: boolean;
    error?: string;
}

export async function submitContactForm(data: ContactFormData): Promise<ContactSubmissionResult> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: errorData?.error?.message || 'Error al enviar el formulario. Intenta de nuevo.',
            };
        }

        return { success: true };
    } catch (error) {
        console.error('[Contact Form] Submission error:', error);
        return {
            success: false,
            error: 'Error de conexión. Por favor, verifica tu internet e intenta de nuevo.',
        };
    }
}
