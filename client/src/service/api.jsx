import axios from "axios";

// Determine backend origin URL for Socket.IO and server resources
export const getBackendUrl = () => {
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
    }
    return import.meta.env.PROD ? window.location.origin : "http://localhost:5001";
};

// Determine API Base URL:
// 1. VITE_API_URL if explicitly specified (e.g., https://your-backend.onrender.com/api)
// 2. VITE_BACKEND_URL with /api appended
// 3. Fallback to /api in production (for monolithic deployments) or localhost in dev
export const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/$/, "");
    }
    if (import.meta.env.VITE_BACKEND_URL) {
        return `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/api`;
    }
    return import.meta.env.PROD ? "/api" : "http://localhost:5001/api";
};

const api = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true, // Enable cookies for session
});

// Remove JWT request interceptor

// Add a response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Session expired or invalid
            // Ideally notify AuthContext, but for now we can just let the error propagate
            // allowing the component (e.g. AuthContext) to handle it.
            // window.location.href = '/login'; // Let the app handle navigation state
        }
        return Promise.reject(error);
    }
);

export default api;
