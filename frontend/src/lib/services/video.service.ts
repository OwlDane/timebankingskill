import axios from 'axios';
import type { VideoSessionResponse, StartVideoSessionRequest, EndVideoSessionRequest } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Video Service - Handles all video call-related API calls
 * Includes starting/ending calls, getting history and statistics
 */
export const videoService = {
    // Start a video session
    async startVideoSession(sessionId: number, request: StartVideoSessionRequest): Promise<VideoSessionResponse> {
        const response = await axios.post(`${API_BASE}/sessions/${sessionId}/video/start`, request);
        return response.data.data;
    },

    // Get video session status
    async getVideoSessionStatus(sessionId: number): Promise<VideoSessionResponse> {
        const response = await axios.get(`${API_BASE}/sessions/${sessionId}/video/status`);
        return response.data.data;
    },

    // End a video session
    async endVideoSession(sessionId: number, request: EndVideoSessionRequest): Promise<VideoSessionResponse> {
        const response = await axios.post(`${API_BASE}/sessions/${sessionId}/video/end`, request);
        return response.data.data;
    },

    // Get user's video call history
    async getVideoHistory(limit: number = 10, offset: number = 0): Promise<any> {
        const response = await axios.get(`${API_BASE}/user/video-history?limit=${limit}&offset=${offset}`);
        return response.data.data;
    },

    // Get user's video statistics
    async getVideoStats(): Promise<any> {
        const response = await axios.get(`${API_BASE}/user/video-stats`);
        return response.data.data;
    },
};
