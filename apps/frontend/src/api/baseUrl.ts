const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
export const BASE_URL = rawBaseUrl.trim().replace(/\/+$/, '')
