/**
 * Central app config — all backend URLs come from Vite env vars.
 *
 * Local:     .env.development  (used by `npm run dev`)
 * Production:.env.production   (used by `npm run build`)
 * Override:  .env.local        (git-ignored, highest priority for local tweaks)
 *
 * Only variables prefixed with VITE_ are exposed to the browser.
 */
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/** SockJS / WebSocket endpoint (same host as API by default) */
export const WS_URL =
    import.meta.env.VITE_WS_URL || `${API_BASE_URL}/ws`;

/** Helper for static file URLs (images, resumes) */
export const fileUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${clean}`;
};
