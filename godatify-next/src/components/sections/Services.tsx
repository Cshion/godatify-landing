'use client';

import servicesData from '@/lib/data/services.json';

export default function Services() {
    return (
        <>
            <section className="section py-20 bg-gradient-to-b from-white to-gray-50" id="servicios">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 reveal">
                        Nuestros Servicios
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicesData.map((service) => (
                            <div key={service.id} className="service-card group" id={service.id}>
                                <div className="service-icon-wrapper">
                                    <div className="service-icon">
                                        <i className={`fas fa-${service.icon}`}></i>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                                    {service.description}
                                </p>
                                <a href="#" className="btn-outline">Leer Más</a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx global>{`
        .service-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #1C7C54 0%, #26a86f 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .service-card:hover::before {
          transform: scaleX(1);
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .service-icon-wrapper {
          margin-bottom: 1.5rem;
        }

        .service-icon {
          width: 80px;
          height: 80px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #26a86f 0%, #1C7C54 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.875rem;
          color: white;
          box-shadow: 0 10px 30px rgba(28, 124, 84, 0.3);
          transition: all 0.3s ease;
        }

        .service-card:hover .service-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 15px 40px rgba(28, 124, 84, 0.4);
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 0.75rem;
          background: transparent;
          color: #1C7C54;
          border: 2px solid #1C7C54;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .btn-outline:hover {
          background: #1C7C54;
          color: white;
        }
      `}</style>
        </>
    );
}
