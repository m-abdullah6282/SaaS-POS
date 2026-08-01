import axios from 'axios';

const BASE_URL = 'http://192.168.18.47:8000/api/';

export const api = axios.create({
    baseURL: BASE_URL,
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
                    const res = await axios.post(`${BASE_URL}auth/token/refresh/`, {
                        refresh: refreshToken
                    });
                    
                    accessToken = res.data.access;
                    if (res.data.refresh) {
                        refreshToken = res.data.refresh;
                    }

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    if (logoutCallback) logoutCallback();
                    return Promise.reject(refreshError);
                }
            } else {
                if (logoutCallback) logoutCallback();
            }
        }

        return Promise.reject(error);
    }
);

export default api;