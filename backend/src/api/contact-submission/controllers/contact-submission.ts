/**
 * contact-submission controller
 * Custom controller with spam prevention
 */

import { factories } from '@strapi/strapi';

// Rate limiting store (in-memory, resets on restart)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // Max 5 submissions per hour per IP

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(ip);
    
    if (!record || now > record.resetAt) {
        rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        return false;
    }
    
    if (record.count >= RATE_LIMIT_MAX) {
        return true;
    }
    
    record.count++;
    return false;
}

// Helper to get clean IP string
function getClientIP(ctx: any): string {
    const forwarded = ctx.request.headers['x-forwarded-for'];
    if (forwarded) {
        return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
    }
    return ctx.request.ip || 'unknown';
}

export default factories.createCoreController('api::contact-submission.contact-submission', ({ strapi }) => ({
    async create(ctx) {
        const { data } = ctx.request.body;
        
        // Get IP address
        const ip = getClientIP(ctx);
        const userAgent = (ctx.request.headers['user-agent'] || 'unknown') as string;
        
        strapi.log.info(`[CONTACT] Received submission from ${data?.email || 'unknown'}, IP: ${ip}`);
        strapi.log.debug(`[CONTACT] Data received: ${JSON.stringify({ ...data, message: data?.message?.substring(0, 50) + '...' })}`);
        
        // Anti-spam check 1: Honeypot field
        if (data.website) {
            // Bots fill hidden fields - silently reject
            strapi.log.warn(`[SPAM] Honeypot triggered from IP: ${ip}`);
            // Return success to not tip off the bot
            return { data: { id: 0, attributes: {} } };
        }
        
        // Anti-spam check 2: Rate limiting
        if (isRateLimited(ip)) {
            strapi.log.warn(`[SPAM] Rate limit exceeded for IP: ${ip}`);
            return ctx.badRequest('Demasiados envíos. Por favor, intenta más tarde.');
        }
        
        // Anti-spam check 3: Minimum form completion time (honeypot timing)
        // Only check if formStartTime was provided, and use 1 second minimum
        // (no human fills a form in under 1 second, but bots do it in milliseconds)
        const formStartTime = data.formStartTime;
        if (formStartTime) {
            const timeTaken = Date.now() - parseInt(formStartTime, 10);
            strapi.log.debug(`[CONTACT] Form completion time: ${timeTaken}ms`);
            if (timeTaken < 1000) { // Less than 1 second = definitely a bot
                strapi.log.warn(`[SPAM] Form submitted too fast (${timeTaken}ms) from IP: ${ip}`);
                return { data: { id: 0, attributes: {} } };
            }
        }
        
        // Anti-spam check 4: Basic content validation
        const message = data.message || '';
        const spamPatterns = [
            /\[url=/i,
            /\[link=/i,
            /<a\s+href/i,
            /viagra|cialis|casino|bitcoin|crypto|lottery/i,
        ];
        
        if (spamPatterns.some(pattern => pattern.test(message))) {
            strapi.log.warn(`[SPAM] Spam content detected from IP: ${ip}`);
            return { data: { id: 0, attributes: {} } };
        }
        
        // Clean data - remove honeypot fields before saving
        const cleanData = {
            name: data.name,
            email: data.email,
            company: data.company || null,
            role: data.role || null,
            message: data.message,
            status: 'nuevo' as const,
            ipAddress: ip,
            userAgent: userAgent.substring(0, 500),
            submittedAt: new Date().toISOString(),
        };
        
        // Create the entry
        const entry = await strapi.entityService.create('api::contact-submission.contact-submission', {
            data: cleanData,
        });
        
        strapi.log.info(`[CONTACT] New submission from ${cleanData.email} (${cleanData.company || 'N/A'})`);
        
        // Return sanitized response
        return {
            data: {
                id: entry.id,
                attributes: {
                    name: entry.name,
                    email: entry.email,
                    submittedAt: entry.submittedAt,
                },
            },
        };
    },
}));
