import PageHero from '@/components/common/PageHero';

interface BlogHeroProps {
    title: string;
    subtitle: string;
    description: string;
}

export default function BlogHero({ title, subtitle, description }: BlogHeroProps) {
    return (
        <PageHero
            title={title}
            subtitle={description}
            backgroundImage="/images/hero-blog.jpg"
            phrases={[subtitle, title]}
        />
    );
}
