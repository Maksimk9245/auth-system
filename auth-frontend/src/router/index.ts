import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/Login.vue'),
        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('../views/Register.vue'),
        },
        {
            path: '/',
            name: 'Profile',
            component: () => import('../views/Profile.vue'),
            meta: { requiresAuth: true },
        },
    ],
});

router.beforeEach(async (to, _from, next) => {
    const hasToken = !!localStorage.getItem('access_token');

    if (to.meta.requiresAuth && !hasToken) {
        next('/login');
    } else if ((to.path === '/login' || to.path === '/register') && hasToken) {
        next('/');
    } else {
        next();
    }
});

export default router;