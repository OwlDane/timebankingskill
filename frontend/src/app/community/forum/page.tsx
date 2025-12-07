'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ForumCategoryCard } from '@/components/community';
import { communityService } from '@/lib/services/community.service';
import type { ForumCategory } from '@/types';
import { toast } from 'sonner';

export default function ForumPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await communityService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to load forum categories');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            {/* Main Container - Centered */}
            <div className="w-full max-w-6xl mx-auto">
                {/* Header Section - Centered */}
                <div className="flex flex-col items-center justify-center mb-12 gap-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center">
                        Community Forum
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl">
                        Join discussions, share knowledge, and connect with other learners and teachers
                    </p>
                    <Button className="mt-4" onClick={() => router.push('/community/forum/new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Start New Discussion
                    </Button>
                </div>

                {/* Categories Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No forum categories available yet</p>
                        <Button variant="outline" onClick={fetchCategories}>
                            Refresh
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <ForumCategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
