'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CommunityPage() {
    const router = useRouter();

    const sections = [
        {
            icon: MessageSquare,
            title: 'Forum',
            description: 'Join discussions and share knowledge with the community',
            href: '/community/forum',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: BookOpen,
            title: 'Success Stories',
            description: 'Read inspiring stories from our community members',
            href: '/community/stories',
            color: 'from-purple-500 to-purple-600',
        },
        {
            icon: Award,
            title: 'Endorsements',
            description: 'Get recognized for your skills by peers',
            href: '/community/endorsements',
            color: 'from-amber-500 to-amber-600',
        },
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            {/* Main Container - Centered */}
            <div className="w-full max-w-6xl mx-auto">
                {/* Header Section - Centered */}
                <div className="flex flex-col items-center justify-center mb-16 gap-4">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white text-center">
                        Community Hub
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 text-center max-w-2xl">
                        Connect, learn, and grow together with our vibrant community
                    </p>
                </div>

                {/* Community Sections Grid - Centered */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.title}
                                className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-xl hover:border-primary"
                            >
                                {/* Background linear */}
                                <div
                                    className={`absolute inset-0 bg-linear-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                                />

                                {/* Content */}
                                <div className="relative z-10 p-8 flex flex-col h-full">
                                    {/* Icon */}
                                    <div className="mb-6">
                                        <div className={`inline-flex p-3 rounded-lg bg-linear-to-br ${section.color} text-white`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                    </div>

                                    {/* Title and Description */}
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        {section.title}
                                    </h2>
                                    <p className="text-muted-foreground mb-6 grow">
                                        {section.description}
                                    </p>

                                    {/* Button */}
                                    <Button
                                        onClick={() => router.push(section.href)}
                                        className="w-full"
                                    >
                                        Explore
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Stats Section - Centered */}
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <p className="text-4xl font-bold text-primary mb-2">1000+</p>
                            <p className="text-muted-foreground">Active Members</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-primary mb-2">500+</p>
                            <p className="text-muted-foreground">Forum Discussions</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-primary mb-2">200+</p>
                            <p className="text-muted-foreground">Success Stories</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
