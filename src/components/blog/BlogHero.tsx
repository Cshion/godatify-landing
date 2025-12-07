import PageHero from '@/components/common/PageHero';

interface BlogHeroProps {
    title: string;
    subtitle: string;
    description: string;
}

export default function BlogHero({ title, subtitle, description }: BlogHeroProps) {
    // Map props to PageHero
    // title -> title (Large text)
    // description -> subtitle (Text below title, like Industries page)
    // subtitle ("NUESTRO BLOG") -> First phrase to cycle? Or just ignore?
    // Let's use "Blog" or the subtitle as a phrase to cycle with title

    return (
        <PageHero
            title={title}
            subtitle={description}
            backgroundImage="/images/hero-blog.jpg" // Need a hero image, defaulting or using one if available
            phrases={[subtitle, title]}
        />
    );
}
