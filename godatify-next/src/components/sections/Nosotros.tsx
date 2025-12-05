'use client';

import { useEffect, useRef, useState } from 'react';

export default function Nosotros() {
    const [stats, setStats] = useState([
        { target: 150, current: 0, label: 'Proyectos' },
        { target: 10, current: 0, label: 'Años de Experiencia' },
        { target: 100, current: 0, label: 'Clientes Satisfechos' },
    ]);

    const sectionRef = useRef<HTMLElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    animateCounters();
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated]);

    const animateCounters = () => {
        stats.forEach((stat, index) => {
            const duration = 2000;
            const steps = 60;
            const increment = stat.target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) {
                    current = stat.target;
                    clearInterval(timer);
                }

                setStats((prev) => {
                    const newStats = [...prev];
                    newStats[index] = { ...newStats[index], current: Math.floor(current) };
                    return newStats;
                });
            }, duration / steps);
        });
    };

    return (
        <>
            <section className="section py-20 bg-white" id="nosotros" ref={sectionRef}>
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 reveal">
                        Nosotros
                    </h2>

                    {/* Stats Grid */}
                    <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card reveal">
                                <div className="stat-number">
                                    {stat.current}+
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Video Section */}
                    <div className="video-container">
                        <div className="video-wrapper">
                            <iframe
                                width="100%"
                                height="500"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="Video Introductorio Datify"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <p className="video-caption">Descubre cómo transformamos datos en decisiones</p>
                    </div>
                </div>
            </section>

            <style jsx global>{`
        .stats-grid {
          margin-top: 3rem;
        }

        .stat-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
          font-size: 4rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1C7C54 0%, #26a86f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .stat-label {
          font-size: 1.125rem;
          color: #6b7280;
          font-weight: 500;
        }

        .video-container {
          max-width: 56rem;
          margin: 0 auto;
          text-align: center;
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          margin-bottom: 1.5rem;
        }

        .video-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .video-caption {
          font-size: 1.125rem;
          color: #6b7280;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .stat-number {
            font-size: 3rem;
          }
        }
      `}</style>
        </>
    );
}
