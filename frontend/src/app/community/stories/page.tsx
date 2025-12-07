'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StoryCard } from '@/components/community';
import { communityService } from '@/lib/services/community.service';
import type { SuccessStory } from '@/types';
import { toast } from 'sonner';

export default function StoriesPage() {
    const router = useRouter();
    const [stories, setStories] = useState<SuccessStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const limit = 12;

    useEffect(() => {
        fetchStories();
    }, [offset]);

    const fetchStories = async () => {
        try {
            setLoading(true);
            const data = await communityService.getPublishedStories(limit, offset);
            setStories(data.stories);
            setTotal(data.total);
        } catch (error) {
            console.error('Failed to fetch stories:', error);
            toast.error('Failed to load success stories');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (storyId: number) => {
        try {
            await communityService.likeStory(storyId);
            // Update local state
            setStories(
                stories.map((s) =>
                    s.id === storyId ? { ...s, like_count: s.like_count + 1 } : s
                )
            );
            toast.success('Story liked!');
        } catch (error) {
            console.error('Failed to like story:', error);
            toast.error('Failed to like story');
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            {/* Main Container - Centered */}
            <div className="w-full max-w-6xl mx-auto">
                {/* Header Section - Centered */}
                <div className="flex flex-col items-center justify-center mb-12 gap-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center">
                        Success Stories
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl">
                        Discover inspiring stories from our community members
                    </p>
                    <Button className="mt-4" onClick={() => router.push('/community/stories/new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Share Your Story
                    </Button>
                </div>

                {/* Stories Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : stories.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No success stories yet</p>
                        <Button variant="outline" onClick={fetchStories}>
                            Refresh
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {stories.map((story) => (
                                <StoryCard
                                    key={story.id}
                                    story={story}
                                    onLike={handleLike}
                                    isLiked={false}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {total > limit && (
                            <div className="flex items-center justify-center gap-4">
                                <Button
                                    variant="outline"
                                    disabled={offset === 0}
                                    onClick={() => setOffset(Math.max(0, offset - limit))}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {offset + 1} - {Math.min(offset + limit, total)} of {total}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={offset + limit >= total}
                                    onClick={() => setOffset(offset + limit)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
