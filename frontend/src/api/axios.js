import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

let accessToken = null;
let refreshToken = null;
let logoutCallback = null;

export const setTokens = (access, refresh) => {
    accessToken = access;
    refreshToken = refresh;
};

export const getRefreshToken = () => refreshToken;

export const setLogoutCallback = (callback) => {
    logoutCallback = callback;
};

// Request interceptor
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (refreshToken) {
                try {
                    // Try to refresh token
                    const res = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
                        refresh: refreshToken
                    });
                    
                    accessToken = res.data.access;
                    // Optional: If backend returns new refresh token, update it too
                    if (res.data.refresh) {
                        refreshToken = res.data.refresh;
                    }

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, log out
                    if (logoutCallback) logoutCallback();
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token available
                if (logoutCallback) logoutCallback();
            }
        }

        return Promise.reject(error);
    }
);

export default api;
