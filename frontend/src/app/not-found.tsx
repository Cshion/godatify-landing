import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Página no encontrada',
    description: 'La página que buscas no existe o ha sido movida.',
};

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-xl mx-auto px-6 py-16 text-center">
                {/* 404 Badge */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#135c51]/10 mb-8">
                    <span className="text-4xl font-bold text-[#135c51]">404</span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Página no encontrada
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#135c51] text-white font-medium hover:bg-[#0f4a42] transition-colors"
                    >
                        Volver al inicio
                    </Link>
                    <Link
                        href="/contacto"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#135c51] text-[#135c51] font-medium hover:bg-[#135c51]/5 transition-colors"
                    >
                        Contáctanos
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">O explora nuestras secciones:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/servicios" className="text-sm text-[#135c51] hover:underline">
                            Servicios
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/casos" className="text-sm text-[#135c51] hover:underline">
                            Casos de Éxito
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/industrias" className="text-sm text-[#135c51] hover:underline">
                            Industrias
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/blog" className="text-sm text-[#135c51] hover:underline">
                            Blog
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
