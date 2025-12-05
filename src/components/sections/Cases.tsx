'use client';

import Image from 'next/image';
import casesData from '@/lib/data/cases.json';

export default function Cases() {
    return (
        <>
            <section className="section py-20 bg-white" id="casos">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 reveal">
                        Casos de Éxito
                    </h2>

                    <div className="cases-container">
                        <div className="cases-grid">
                            {casesData.map((caseItem) => (
                                <div key={caseItem.id} className="case-card group reveal">
                                    {/* Image */}
                                    <div className="case-image-wrapper">
                                        <Image
                                            src={caseItem.image}
                                            alt={caseItem.title}
                                            width={400}
                                            height={300}
                                            className="case-image"
                                        />

                                        {/* Overlay */}
                                        <div className="case-overlay">
                                            <a href="#" className="case-link">
                                                Ver Proyecto
                                            </a>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="case-content">
                                        <span className="case-category">
                                            {caseItem.category}
                                        </span>
                                        <h3 className="case-title">{caseItem.title}</h3>
                                        <p className="case-description">{caseItem.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <style jsx global>{`
        .cases-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .cases-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        @media (max-width: 1024px) {
          .cases-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .cases-grid {
            grid-template-columns: repeat(1, 1fr);
          }
        }

        .case-card {
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .case-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .case-image-wrapper {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
        }

        .case-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .case-card:hover .case-image {
          transform: scale(1.1);
        }

        .case-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .case-card:hover .case-overlay {
          opacity: 1;
        }

        .case-link {
          padding: 0.75rem 1.5rem;
          background: white;
          color: #1C7C54;
          border-radius: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transform: translateY(1rem);
          transition: transform 0.3s ease;
        }

        .case-card:hover .case-link {
          transform: translateY(0);
        }

        .case-content {
          padding: 1.5rem;
        }

        .case-category {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: rgba(28, 124, 84, 0.1);
          color: #1C7C54;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 9999px;
          margin-bottom: 0.75rem;
        }

        .case-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .case-description {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
        }
      `}</style>
        </>
    );
}
