/**
 * Bootstrap Configuration
 * 
 * Shared configuration maps used by lifecycle hooks and sync operations.
 */

/**
 * Media field mappings for automatic URL synchronization.
 * Maps content type UIDs to their media fields and corresponding URL fields.
 */
export const MEDIA_FIELDS_MAP = {
    'api::case-study.case-study': [{ media: 'mainImage', url: 'mainImageUrl' }],
    'api::industry.industry': [{ media: 'image', url: 'imageUrl' }],
    'api::testimonial.testimonial': [{ media: 'authorImage', url: 'authorImageUrl' }],
    'api::client.client': [{ media: 'logo', url: 'logoUrl' }],
    'api::service.service': [{ media: 'bgImage', url: 'bgImageUrl' }],
    'api::company-info.company-info': [{ media: 'logo', url: 'logoUrl' }],
    'api::blog-post.blog-post': [{ media: 'coverImage', url: 'coverImageUrl' }],
};

/**
 * Relation field mappings for forward denormalization.
 * When a related entity is linked, copy specific fields to the parent entity.
 */
export const RELATION_FIELDS_MAP = {
    'api::case-study.case-study': [
        { relation: 'client', sourceField: 'logoUrl', targetField: 'clientLogoUrl' },
        { relation: 'client', sourceField: 'name', targetField: 'clientName' },
        { relation: 'client', sourceField: 'website', targetField: 'clientWebsite' },
        { relation: 'industry', sourceField: 'title', targetField: 'industryName' },
        { relation: 'testimonial', sourceField: 'quote', targetField: 'testimonialQuote' },
        { relation: 'testimonial', sourceField: 'author', targetField: 'testimonialAuthor' },
        { relation: 'testimonial', sourceField: 'role', targetField: 'testimonialRole' },
        { relation: 'testimonial', sourceField: 'authorImageUrl', targetField: 'testimonialAuthorImageUrl' },
        { relation: 'testimonial', sourceField: 'linkedIn', targetField: 'testimonialLinkedIn' }
    ]
};

/**
 * Reverse sync mappings for propagating updates.
 * When a source entity (Client, Industry, Testimonial) is updated,
 * propagate changes to all related target entities (Case Studies).
 */
export const REVERSE_SYNC_MAP = {
    'api::client.client': {
        targetModel: 'api::case-study.case-study',
        relationField: 'client',
        fields: [
            { source: 'name', target: 'clientName' },
            { source: 'logoUrl', target: 'clientLogoUrl' },
            { source: 'website', target: 'clientWebsite' }
        ]
    },
    'api::industry.industry': {
        targetModel: 'api::case-study.case-study',
        relationField: 'industry',
        fields: [
            { source: 'title', target: 'industryName' }
        ]
    },
    'api::testimonial.testimonial': {
        targetModel: 'api::case-study.case-study',
        relationField: 'testimonial',
        fields: [
            { source: 'quote', target: 'testimonialQuote' },
            { source: 'author', target: 'testimonialAuthor' },
            { source: 'role', target: 'testimonialRole' },
            { source: 'authorImageUrl', target: 'testimonialAuthorImageUrl' },
            { source: 'linkedIn', target: 'testimonialLinkedIn' }
        ]
    }
};

export type MediaFieldConfig = typeof MEDIA_FIELDS_MAP;
export type RelationFieldConfig = typeof RELATION_FIELDS_MAP;
export type ReverseSyncConfig = typeof REVERSE_SYNC_MAP;
