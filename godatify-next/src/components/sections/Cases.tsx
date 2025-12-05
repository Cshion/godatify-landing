import Image from 'next/image';
import casesData from '@/lib/data/cases.json';

export default function Cases() {
    return (
        <section id="casos" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
                    Casos de Éxito
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {casesData.map((caseItem) => (
                        <div
                            key={caseItem.id}
                            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={caseItem.image}
                                    alt={caseItem.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <a
                                        href="#"
                                        className="px-6 py-3 bg-white text-[#1C7C54] rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                        Ver Proyecto
                                    </a>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 bg-white">
                                <span className="inline-block px-3 py-1 bg-[#1C7C54]/10 text-[#1C7C54] text-sm font-medium rounded-full mb-3">
                                    {caseItem.category}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{caseItem.title}</h3>
                                <p className="text-gray-600 text-sm">{caseItem.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
