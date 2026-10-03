import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../api/axios';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null);
    const isAuthenticated = ref(false);

    async function register(email: string, password: string) {
        await api.post('/auth/register', { email, password });
        await login(email, password);
    }

    async function login(email: string, password: string) {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        isAuthenticated.value = true;
        await fetchProfile();
    }

    async function fetchProfile() {
        try {
            const { data } = await api.get('/auth/profile');
            user.value = data;
            isAuthenticated.value = true;
        } catch {
            user.value = null;
            isAuthenticated.value = false;
        }
    }

    async function logout() {
        try {
            await api.post('/auth/logout');
        } catch (e) {
            console.error(e);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            user.value = null;
            isAuthenticated.value = false;
        }
    }

    return { user, isAuthenticated, register, login, fetchProfile, logout };
});