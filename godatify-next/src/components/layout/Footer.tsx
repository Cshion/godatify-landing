import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="contacto" className="relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
        }}>
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">DATIFY</h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            En Datify acompañamos a las organizaciones a descubrir el verdadero poder de sus
                            datos, transformando la forma en que las organizaciones piensan, operan y deciden.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: 'linkedin-in', url: 'https://www.linkedin.com/company/godatify/' },
                                { icon: 'facebook-f', url: 'https://www.facebook.com/godatify' },
                                { icon: 'instagram', url: 'https://www.instagram.com/godatify/' },
                                { icon: 'youtube', url: 'https://godatify.com' },
                            ].map((social) => (
                                <a
                                    key={social.icon}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-[#1C7C54] hover:text-white transition-all"
                                >
                                    <i className={`fab fa-${social.icon}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2">
                            {['Inicio', 'Nosotros', 'Servicios', 'Casos de éxito'].map((link) => (
                                <li key={link}>
                                    <Link
                                        href={`#${link.toLowerCase().replace(' ', '-')}`}
                                        className="text-gray-400 hover:text-[#26a86f] transition-colors"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Servicios</h4>
                        <ul className="space-y-2">
                            {[
                                'Big Data Management',
                                'Business Analytics',
                                'Business Intelligence',
                                'Data Engineering',
                                'Digital Platform',
                            ].map((service) => (
                                <li key={service}>
                                    <Link
                                        href="#servicios"
                                        className="text-gray-400 hover:text-[#26a86f] transition-colors"
                                    >
                                        {service}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Contacto</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#blog" className="text-gray-400 hover:text-[#26a86f] transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#contacto" className="text-gray-400 hover:text-[#26a86f] transition-colors">
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-[#26a86f] transition-colors">
                                    Términos y Políticas
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8">
                    <p className="text-center text-gray-400">
                        &copy; {currentYear} Datify. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
