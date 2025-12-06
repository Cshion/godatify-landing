'use client';

import { useState } from 'react';
import { ContactFormLabels } from '@/types';
import styles from './ContactForm.module.css';

interface ContactFormProps {
    title: string;
    subtitle: string;
    labels: ContactFormLabels;
}

export default function ContactForm({ title, subtitle, labels }: ContactFormProps) {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setStatus('success');
        // Reset form or redirect logic here
    };

    return (
        <section className={styles.section} id="form">
            <div className="container mx-auto px-6">
                <div className={styles.formContainer}>
                    <div className="text-center mb-10">
                        <h2 className={styles.heading}>{title}</h2>
                        <p className={styles.subheading}>{subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label htmlFor="name" className={styles.label}>{labels.name}</label>
                                <input type="text" id="name" required className={styles.input} />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="email" className={styles.label}>{labels.email}</label>
                                <input type="email" id="email" required className={styles.input} />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="company" className={styles.label}>{labels.company}</label>
                                <input type="text" id="company" className={styles.input} />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="role" className={styles.label}>{labels.role}</label>
                                <input type="text" id="role" className={styles.input} />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="message" className={styles.label}>{labels.message}</label>
                            <textarea id="message" required rows={4} className={styles.textarea}></textarea>
                        </div>

                        <div className="text-center mt-8">
                            <button
                                type="submit"
                                className={`${styles.submitButton} ${status === 'submitting' ? styles.loading : ''} ${status === 'success' ? styles.success : ''}`}
                                disabled={status !== 'idle'}
                            >
                                {status === 'idle' && labels.submit}
                                {status === 'submitting' && 'Enviando...'}
                                {status === 'success' && '¡Mensaje Enviado!'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
