import axios from "axios";
import { startLoading, stopLoading } from "@/stores/loading";

const customFetch = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/'
});

customFetch.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
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
        return Promise.reject(error);
    },
);

export default customFetch;
