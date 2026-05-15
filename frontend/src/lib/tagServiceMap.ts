/**
 * Maps blog post tags to relevant service slugs
 * Used for internal linking between blog and services
 */
export const TAG_SERVICE_MAP: Record<string, string[]> = {
  'Data': ['big-data-management', 'data-engineering'],
  'BI': ['business-intelligence'],
  'Analytics': ['business-analytics', 'business-intelligence'],
  'Machine Learning': ['business-analytics'],
  'AI': ['business-analytics'],
  'ETL': ['data-engineering'],
  'Dashboards': ['business-intelligence'],
  'Cloud': ['big-data-management', 'digital-platform'],
  'Automatización': ['digital-platform', 'data-engineering'],
  'Transformación Digital': ['digital-platform'],
};

export function getRelatedServiceSlugs(tags: string[]): string[] {
  const serviceSlugs = new Set<string>();
  tags.forEach((tag) => {
    const mappedServices = TAG_SERVICE_MAP[tag] || [];
    mappedServices.forEach((slug) => serviceSlugs.add(slug));
  });
  return Array.from(serviceSlugs).slice(0, 2); // Max 2 services
}
