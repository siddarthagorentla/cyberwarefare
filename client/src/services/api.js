import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Optionally redirect to login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// Course API
export const courseAPI = {
    getAll: () => api.get('/courses'),
    getById: (id) => api.get(`/courses/${id}`),
};

// Subscription API
export const subscriptionAPI = {
    subscribe: (courseId, promoCode = null) =>
        api.post('/subscribe', { courseId, promoCode }),
    validatePromo: (promoCode, courseId) =>
        api.post('/subscribe/validate-promo', { promoCode, courseId }),
    getMyCourses: () => api.get('/subscribe/my-courses'),
    checkSubscription: (courseId) => api.get(`/subscribe/check/${courseId}`),
};

// Auth API
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    signup: (name, email, password) => api.post('/auth/signup', { name, email, password }),
    getMe: () => api.get('/auth/me'),
};
