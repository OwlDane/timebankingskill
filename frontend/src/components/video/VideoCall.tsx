'use client';

import { useEffect, useRef } from 'react';
import { useVideoStore } from '@/stores/video.store';

interface VideoCallProps {
    roomId: string;
    userName: string;
    onCallEnd?: () => void;
}

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}

export function VideoCall({ roomId, userName, onCallEnd }: VideoCallProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const jitsiApi = useRef<any>(null);

    const initializeJitsi = () => {
        if (!containerRef.current) return;

        const options = {
            roomName: roomId,
            width: '100%',
            height: '100%',
            parentNode: containerRef.current,
            configOverwrite: {
                startAudioOnly: false,
                disableModeratorIndicator: true,
                startWithAudioMuted: false,
                startWithVideoMuted: false,
            },
            interfaceConfigOverwrite: {
                DEFAULT_BACKGROUND: '#000000',
                SHOW_JITSI_WATERMARK: false,
                MOBILE_APP_PROMO: false,
            },
            userInfo: {
                displayName: userName,
            },
        };

        try {
            jitsiApi.current = new window.JitsiMeetExternalAPI('meet.jit.si', options);

            // Handle call end
            jitsiApi.current.addEventListener('videoConferenceLeft', () => {
                if (onCallEnd) {
                    onCallEnd();
                }
            });

            // Handle errors
            jitsiApi.current.addEventListener('onError', (error: any) => {
                console.error('Jitsi error:', error);
            });
        } catch (error) {
            console.error('Failed to initialize Jitsi:', error);
        }
    };

    useEffect(() => {
        if (!containerRef.current || !roomId) return;

        // Load Jitsi Meet script
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => {
            if (typeof window !== 'undefined' && window.JitsiMeetExternalAPI) {
                initializeJitsi();
            }
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup
            if (jitsiApi.current) {
                jitsiApi.current.dispose();
                jitsiApi.current = null;
            }
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [roomId, userName, onCallEnd]);

    return (
        <div className="w-full h-full bg-black rounded-lg overflow-hidden">
            <div ref={containerRef} className="w-full h-full" />
        </div>
    );
}
