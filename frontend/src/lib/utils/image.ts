/**
 * Image utility functions for optimization and CDN support
 * Provides helpers for responsive images, format conversion, and CDN URLs
 */

/**
 * CDN Configuration
 * Update these values based on your CDN provider
 */
const CDN_CONFIG = {
    // Set to your CDN URL (e.g., https://cdn.example.com)
    // Leave empty to use relative paths
    baseUrl: process.env.NEXT_PUBLIC_CDN_URL || '',
    // Enable WebP format for modern browsers
    enableWebP: true,
    // Enable AVIF format for best compression
    enableAVIF: true,
}

/**
 * Get optimized image URL with CDN support
 * Automatically adds CDN base URL if configured
 *
 * @param path - Image path (relative or absolute)
 * @returns Full image URL
 *
 * @example
 * getImageUrl('/images/profile.jpg')
 * // Returns: 'https://cdn.example.com/images/profile.jpg' (if CDN configured)
 * // Returns: '/images/profile.jpg' (if CDN not configured)
 */
export const getImageUrl = (path: string): string => {
    if (!path) return ''

    // If already a full URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
    }

    // Add CDN base URL if configured
    if (CDN_CONFIG.baseUrl) {
        return `${CDN_CONFIG.baseUrl}${path}`
    }

    return path
}

/**
 * Get responsive image sizes for different breakpoints
 * Used in Next.js Image component sizes prop
 *
 * @param defaultSize - Default size for desktop
 * @returns Sizes string for responsive images
 *
 * @example
 * getResponsiveSizes('33vw')
 * // Returns: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
 */
export const getResponsiveSizes = (defaultSize: string = '33vw'): string => {
    return `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${defaultSize}`
}

/**
 * Get image quality based on device type
 * Higher quality for desktop, lower for mobile to save bandwidth
 *
 * @param isHighResolution - Whether device has high DPI
 * @returns Quality value (0-100)
 *
 * @example
 * getImageQuality(true) // Returns: 85 (high quality for high-res devices)
 * getImageQuality(false) // Returns: 75 (standard quality)
 */
export const getImageQuality = (isHighResolution: boolean = false): number => {
    return isHighResolution ? 85 : 75
}

/**
 * Get image srcset for responsive images
 * Generates multiple image sizes for different screen densities
 *
 * @param basePath - Base image path
 * @param sizes - Array of sizes (widths in pixels)
 * @returns Srcset string
 *
 * @example
 * getImageSrcset('/images/profile.jpg', [200, 400, 600])
 * // Returns: '/images/profile-200w.jpg 200w, /images/profile-400w.jpg 400w, ...'
 */
export const getImageSrcset = (basePath: string, sizes: number[] = [200, 400, 600]): string => {
    return sizes
        .map(size => {
            const url = getImageUrl(basePath)
            const ext = url.substring(url.lastIndexOf('.'))
            const nameWithoutExt = url.substring(0, url.lastIndexOf('.'))
            return `${nameWithoutExt}-${size}w${ext} ${size}w`
        })
        .join(', ')
}

/**
 * Check if browser supports modern image formats
 * Used for progressive enhancement
 *
 * @returns Object with format support flags
 *
 * @example
 * const support = getImageFormatSupport()
 * if (support.webp) {
 *   // Use WebP images
 * }
 */
export const getImageFormatSupport = (): {
    webp: boolean
    avif: boolean
} => {
    // Server-side rendering check
    if (typeof window === 'undefined') {
        return { webp: true, avif: true }
    }

    // Client-side format detection
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    return {
        webp: canvas.toDataURL('image/webp').indexOf('image/webp') === 5,
        avif: canvas.toDataURL('image/avif').indexOf('image/avif') === 5,
    }
}

/**
 * Get optimized image path based on format support
 * Automatically selects best format for browser
 *
 * @param basePath - Base image path (without extension)
 * @returns Optimized image path
 *
 * @example
 * getOptimizedImagePath('/images/profile')
 * // Returns: '/images/profile.avif' (if supported)
 * // Returns: '/images/profile.webp' (if AVIF not supported)
 * // Returns: '/images/profile.jpg' (fallback)
 */
export const getOptimizedImagePath = (basePath: string): string => {
    const support = getImageFormatSupport()

    if (support.avif && CDN_CONFIG.enableAVIF) {
        return `${basePath}.avif`
    }

    if (support.webp && CDN_CONFIG.enableWebP) {
        return `${basePath}.webp`
    }

    // Fallback to original format
    return `${basePath}.jpg`
}

/**
 * Image optimization presets for common use cases
 */
export const imagePresets = {
    // Profile avatars
    avatar: {
        width: 200,
        height: 200,
        quality: 80,
        sizes: '(max-width: 640px) 100px, 200px',
    },
    // Skill thumbnails
    skillThumbnail: {
        width: 300,
        height: 200,
        quality: 75,
        sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    },
    // Hero images
    hero: {
        width: 1200,
        height: 600,
        quality: 80,
        sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px',
    },
    // Card images
    card: {
        width: 400,
        height: 300,
        quality: 75,
        sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    },
    // Thumbnail images
    thumbnail: {
        width: 150,
        height: 150,
        quality: 70,
        sizes: '(max-width: 640px) 100px, 150px',
    },
}
