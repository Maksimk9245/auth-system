<template>
    <div class="profile-wrapper">
        <div v-if="authStore.user" class="profile-card">
            <h2>Профиль</h2>
            <p><strong>Email:</strong> {{ authStore.user.email }}</p>
            <p><strong>ID:</strong> {{ authStore.user.sub }}</p>
            <button @click="handleLogout">Выйти</button>
        </div>
        <div v-else>
            <p>Загрузка данных...</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
    await authStore.fetchProfile();
});

async function handleLogout() {
    await authStore.logout();
    router.push('/login');
}
</script>


<style scoped>
.profile-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
.profile-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    border: 1px solid #444;
    border-radius: 8px;
    min-width: 300px;
}
button {
    padding: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
}
</style>