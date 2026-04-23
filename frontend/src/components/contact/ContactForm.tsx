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
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            // Simulate API call
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate occasional error for demo (remove in production)
                    if (Math.random() < 0.1) {
                        reject(new Error('Network error'));
                    }
                    resolve(true);
                }, 1500);
            });

            setStatus('success');
        } catch {
            setStatus('error');
            setErrorMessage('Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo.');
        }
    };

    const handleRetry = () => {
        setStatus('idle');
        setErrorMessage('');
    };

    return (
        <div className={`${styles.formCard} ${styles.embedded}`}>
            <div className="mb-12">
                <h2 className={styles.heading}>{title}</h2>
                <p className={styles.subtitle}>{subtitle}</p>
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

                <div className={styles.submitWrapper}>
                    <button
                        type={status === 'error' ? 'button' : 'submit'}
                        onClick={status === 'error' ? handleRetry : undefined}
                        className={`${styles.submitButton} ${status === 'submitting' ? styles.loading : ''} ${status === 'success' ? styles.success : ''} ${status === 'error' ? styles.error : ''}`}
                        disabled={status === 'submitting'}
                    >
                        {status === 'idle' && labels.submit}
                        {status === 'submitting' && 'Enviando...'}
                        {status === 'success' && '¡Mensaje Enviado!'}
                        {status === 'error' && 'Reintentar'}
                    </button>
                    
                    {/* Error message */}
                    {status === 'error' && errorMessage && (
                        <p className={styles.errorMessage}>{errorMessage}</p>
                    )}
                    
                    {/* Reassurance copy */}
                    {status === 'idle' && (
                        <p className={styles.reassurance}>
                            Respondemos en menos de 24 horas. Sin spam, sin compromiso.
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

