
<template>
    <div class="login-wrapper">
        <form @submit.prevent="handleRegister" class="login-form">
            <h2>Регистрация</h2>
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Пароль" required />
            <button type="submit">Создать аккаунт</button>
            <router-link to="/login" class="link">Уже есть аккаунт? Войти</router-link>
        </form>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

async function handleRegister() {
    try {
        await authStore.register(email.value, password.value);
        router.push('/');
    } catch (error) {
        alert('Ошибка при регистрации. Возможно, пользователь уже существует.');
    }
}
</script>

<style scoped>
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
.login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 300px;
    padding: 2rem;
    border: 1px solid #444;
    border-radius: 8px;
    text-align: center;
}
input, button {
    padding: 0.5rem;
    font-size: 1rem;
}
.link {
    margin-top: 10px;
    color: #646cff;
    text-decoration: none;
    font-size: 0.9rem;
}
</style>