/**
 * contact-submission router
 * Only expose create (POST) publicly, everything else requires auth
 */

export default {
    routes: [
        {
            method: 'POST',
            path: '/contact-submissions',
            handler: 'contact-submission.create',
            config: {
                auth: false, // Public endpoint
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/contact-submissions',
            handler: 'contact-submission.find',
            config: {
                // Requires authentication (admin only)
            },
        },
        {
            method: 'GET',
            path: '/contact-submissions/:id',
            handler: 'contact-submission.findOne',
            config: {
                // Requires authentication (admin only)
            },
        },
        {
            method: 'PUT',
            path: '/contact-submissions/:id',
            handler: 'contact-submission.update',
            config: {
                // Requires authentication (admin only)
            },
        },
        {
            method: 'DELETE',
            path: '/contact-submissions/:id',
            handler: 'contact-submission.delete',
            config: {
                // Requires authentication (admin only)
            },
        },
    ],
};
