'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to monitoring service (e.g., Sentry) in production
        console.error('Global error:', error);
    }, [error]);

    return (
        <html lang="es">
            <body>
                <main className="min-h-screen flex items-center justify-center bg-gray-50" style={{ fontFamily: 'system-ui, sans-serif' }}>
                    <div className="max-w-xl mx-auto px-6 py-16 text-center">
                        {/* Error Icon */}
                        <div 
                            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8"
                            style={{ backgroundColor: 'rgba(19, 92, 81, 0.1)' }}
                        >
                            <svg 
                                className="w-12 h-12" 
                                style={{ color: '#135c51' }}
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                                />
                            </svg>
                        </div>

                        {/* Heading */}
                        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#111827' }}>
                            Algo salió mal
                        </h1>

                        {/* Description */}
                        <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: '#4B5563' }}>
                            Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y estamos trabajando para solucionarlo.
                        </p>

                        {/* Error digest for debugging */}
                        {error.digest && (
                            <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
                                Código de error: {error.digest}
                            </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => reset()}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors"
                                style={{ backgroundColor: '#135c51' }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0f4a42'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#135c51'}
                            >
                                Intentar de nuevo
                            </button>
                            <a
                                href="/"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors"
                                style={{ 
                                    border: '1px solid #135c51',
                                    color: '#135c51',
                                    backgroundColor: 'transparent'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(19, 92, 81, 0.05)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                Volver al inicio
                            </a>
                        </div>

                        {/* Contact */}
                        <div className="mt-12 pt-8" style={{ borderTop: '1px solid #E5E7EB' }}>
                            <p className="text-sm" style={{ color: '#6B7280' }}>
                                Si el problema persiste, contáctanos en{' '}
                                <a 
                                    href="mailto:contacto@godatify.com" 
                                    style={{ color: '#135c51' }}
                                    className="hover:underline"
                                >
                                    contacto@godatify.com
                                </a>
                            </p>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    );
}
