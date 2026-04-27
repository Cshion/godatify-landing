'use client';

import { useState, useRef, useEffect } from 'react';
import { ContactFormLabels } from '@/types';
import { submitContactForm } from '@/app/actions/contact';
import styles from './ContactForm.module.css';

interface ContactFormProps {
    title: string;
    subtitle: string;
    labels: ContactFormLabels;
}

export default function ContactForm({ title, subtitle, labels }: ContactFormProps) {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [submittedName, setSubmittedName] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);
    const formStartTimeRef = useRef<number>(Date.now());

    // Reset form start time when form becomes idle
    useEffect(() => {
        if (status === 'idle') {
            formStartTimeRef.current = Date.now();
        }
    }, [status]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        const formData = new FormData(formRef.current!);
        const name = formData.get('name') as string;
        setSubmittedName(name.split(' ')[0]); // First name only
        
        const data = {
            name: name,
            email: formData.get('email') as string,
            company: formData.get('company') as string || undefined,
            role: formData.get('role') as string || undefined,
            message: formData.get('message') as string,
            website: formData.get('website') as string || undefined, // Honeypot
            formStartTime: formStartTimeRef.current.toString(), // Timing honeypot
        };

        const result = await submitContactForm(data);

        if (result.success) {
            setStatus('success');
            formRef.current?.reset();
        } else {
            setStatus('error');
            setErrorMessage(result.error || 'Error al enviar el mensaje.');
        }
    };

    const handleRetry = () => {
        setStatus('idle');
        setErrorMessage('');
    };

    const handleSendAnother = () => {
        setStatus('idle');
        setSubmittedName('');
    };

    // Success state - takes over the entire form
    if (status === 'success') {
        return (
            <div className={`${styles.formCard} ${styles.embedded}`}>
                <div className={styles.successState}>
                    <div className={styles.successIconWrapper}>
                        <svg 
                            className={styles.successIcon} 
                            viewBox="0 0 52 52" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle 
                                className={styles.successCircle} 
                                cx="26" 
                                cy="26" 
                                r="24" 
                                fill="none" 
                                strokeWidth="2"
                            />
                            <path 
                                className={styles.successCheck} 
                                fill="none" 
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 27l7 7 16-16"
                            />
                        </svg>
                    </div>
                    
                    <h2 className={styles.successTitle}>
                        ¡Gracias{submittedName ? `, ${submittedName}` : ''}!
                    </h2>
                    
                    <p className={styles.successMessage}>
                        Tu mensaje ha sido enviado correctamente.
                    </p>
                    
                    <div className={styles.successDetails}>
                        <div className={styles.successStep}>
                            <span className={styles.successStepIcon}>📧</span>
                            <span>Recibirás una confirmación en tu correo</span>
                        </div>
                        <div className={styles.successStep}>
                            <span className={styles.successStepIcon}>⏱️</span>
                            <span>Responderemos en menos de 24 horas</span>
                        </div>
                    </div>

                    <button 
                        type="button" 
                        onClick={handleSendAnother}
                        className={styles.sendAnotherButton}
                    >
                        Enviar otro mensaje
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.formCard} ${styles.embedded}`}>
            <div className="mb-12">
                <h2 className={styles.heading}>{title}</h2>
                <p className={styles.subtitle}>{subtitle}</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
                {/* Honeypot field - hidden from users, bots will fill it */}
                <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                    <label htmlFor="website">Website (leave empty)</label>
                    <input 
                        type="text" 
                        id="website" 
                        name="website" 
                        tabIndex={-1} 
                        autoComplete="off"
                    />
                </div>

                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label htmlFor="name" className={styles.label}>{labels.name}</label>
                        <input type="text" id="name" name="name" required placeholder=" " className={styles.input} />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>{labels.email}</label>
                        <input type="email" id="email" name="email" required placeholder=" " className={styles.input} />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="company" className={styles.label}>{labels.company}</label>
                        <input type="text" id="company" name="company" placeholder=" " className={styles.input} />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="role" className={styles.label}>{labels.role}</label>
                        <input type="text" id="role" name="role" placeholder=" " className={styles.input} />
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor="message" className={styles.label}>{labels.message}</label>
                    <textarea id="message" name="message" required rows={4} placeholder=" " className={styles.textarea}></textarea>
                </div>

                <div className={styles.submitWrapper}>
                    <button
                        type={status === 'error' ? 'button' : 'submit'}
                        onClick={status === 'error' ? handleRetry : undefined}
                        className={`${styles.submitButton} ${status === 'submitting' ? styles.loading : ''} ${status === 'error' ? styles.error : ''}`}
                        disabled={status === 'submitting'}
                    >
                        {status === 'idle' && labels.submit}
                        {status === 'submitting' && (
                            <>
                                <span className={styles.spinner}></span>
                                Enviando...
                            </>
                        )}
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

