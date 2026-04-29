import axios from "axios";
import { startLoading, stopLoading } from "@/stores/loading";
import { authToken, clearAuth } from "@/stores/auth";

const customFetch = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/'
});

customFetch.interceptors.request.use((config) => {
    const token = authToken.value;
    const shouldSkipLoading = config.headers?.['x-skip-loader'] === 'true';

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (!shouldSkipLoading) {
        startLoading('Syncing archive');
        (config as any).showLoader = true;
    }

    return config;
});

customFetch.interceptors.response.use(
    (response) => {
        if ((response.config as any).showLoader) stopLoading();
        return response;
    },
    (error) => {
        if ((error.config as any)?.showLoader) stopLoading();

        if (error.response?.status === 401) {
            clearAuth();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    },
);

export default customFetch;
