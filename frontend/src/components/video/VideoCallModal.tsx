'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VideoCall } from './VideoCall';
import { WhiteboardCanvas } from '@/components/whiteboard';
import { useVideoStore } from '@/stores/video.store';
import { videoService } from '@/lib/services/video.service';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { Phone, PhoneOff, Palette } from 'lucide-react';

interface VideoCallModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: number;
    partnerName: string;
}

export function VideoCallModal({ isOpen, onClose, sessionId, partnerName }: VideoCallModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [callStarted, setCallStarted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [activeTab, setActiveTab] = useState<'video' | 'whiteboard'>('video');
    const { user } = useAuthStore();
    const { currentSession, setCurrentSession, setError } = useVideoStore();

    // Timer for call duration
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (callStarted) {
            interval = setInterval(() => {
                setCallDuration((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callStarted]);

    const handleStartCall = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            const response = await videoService.startVideoSession(sessionId, {
                session_id: sessionId,
            });
            setCurrentSession(response);
            setCallStarted(true);
            toast.success('Video call started!');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to start video call';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndCall = async () => {
        try {
            setIsLoading(true);
            await videoService.endVideoSession(sessionId, {
                duration: callDuration,
            });
            setCallStarted(false);
            setCallDuration(0);
            setCurrentSession(null);
            toast.success('Video call ended');
            onClose();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to end video call';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl h-[700px] p-0 overflow-hidden">
                <DialogHeader className="absolute top-0 left-0 right-0 z-10 bg-linear-to-b from-black to-transparent p-4">
                    <DialogTitle className="text-white flex items-center justify-between">
                        <span>Video Call with {partnerName}</span>
                        {callStarted && <span className="text-sm font-normal">{formatDuration(callDuration)}</span>}
                    </DialogTitle>
                </DialogHeader>

                <div className="w-full h-full pt-16">
                    {!callStarted ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 gap-6">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-white mb-2">Ready to start?</h3>
                                <p className="text-gray-400">You're about to call {partnerName}</p>
                            </div>
                            <Button
                                onClick={handleStartCall}
                                disabled={isLoading}
                                size="lg"
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                <Phone className="mr-2 h-5 w-5" />
                                {isLoading ? 'Starting...' : 'Start Call'}
                            </Button>
                        </div>
                    ) : currentSession ? (
                        <div className="w-full h-full flex flex-col">
                            {/* Tabs */}
                            <div className="flex gap-2 p-4 bg-muted border-b border-border">
                                <Button
                                    variant={activeTab === 'video' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setActiveTab('video')}
                                >
                                    📹 Video
                                </Button>
                                <Button
                                    variant={activeTab === 'whiteboard' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setActiveTab('whiteboard')}
                                >
                                    <Palette className="mr-2 h-4 w-4" />
                                    Whiteboard
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-hidden relative">
                                {activeTab === 'video' ? (
                                    <>
                                        <VideoCall
                                            roomId={currentSession.room_id}
                                            userName={user?.full_name || 'User'}
                                            onCallEnd={handleEndCall}
                                        />
                                        <div className="absolute bottom-4 right-4 z-20">
                                            <Button
                                                onClick={handleEndCall}
                                                disabled={isLoading}
                                                size="lg"
                                                variant="destructive"
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                <PhoneOff className="mr-2 h-5 w-5" />
                                                {isLoading ? 'Ending...' : 'End Call'}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <WhiteboardCanvas sessionId={sessionId} />
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
