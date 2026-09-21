<script setup lang="ts">
import { ref } from 'vue';

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const message = ref('');
const isLoading = ref(false);
const profile = ref<any>(null);

const submitForm = async () => {
  isLoading.value = true;
  message.value = '';

  const endpoint = isLogin.value ? 'login' : 'register';

  try {
    const response = await fetch(`http://localhost:3000/auth/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      if (isLogin.value) {
        localStorage.setItem('token', data.access_token);
        message.value = 'Success! Token saved.';
      } else {
        message.value = `Success! Account created.`;
      }
    } else {
      message.value = `Error: ${data.message || 'Something went wrong'}`;
    }
  } catch (error) {
    message.value = 'Network error';
  } finally {
    isLoading.value = false;
  }
};

const fetchProfile = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    message.value = 'Error: No token found. Please login first.';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      profile.value = await response.json();
      message.value = 'Profile loaded successfully.';
    } else {
      message.value = 'Error: Unauthorized access. Invalid or expired token.';
      localStorage.removeItem('token');
      profile.value = null;
    }
  } catch (error) {
    message.value = 'Network error';
  }
};

const logout = () => {
  localStorage.removeItem('token');
  profile.value = null;
  message.value = 'Logged out successfully.';
};
</script>

<template>
  <div class="container">
    <div class="card">
      <h2>{{ isLogin ? 'Sign In' : 'Sign Up' }}</h2>

      <form @submit.prevent="submitForm">
        <div class="input-group">
          <label>Email</label>
          <input
            type="email"
            v-model="email"
            required
            placeholder="test@example.com"
          />
        </div>

        <div class="input-group">
          <label>Password</label>
          <input
            type="password"
            v-model="password"
            required
            placeholder="******"
          />
        </div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : isLogin ? 'Login' : 'Create account' }}
        </button>
      </form>

      <p class="toggle-text" @click="isLogin = !isLogin">
        {{
          isLogin ? 'No account? Sign up' : 'Already have an account? Sign in'
        }}
      </p>

      <div class="profile-actions">
        <button class="secondary-btn" @click="fetchProfile">Get Profile</button>
        <button class="danger-btn" @click="logout" v-if="profile">
          Logout
        </button>
      </div>

      <div v-if="profile" class="profile-card">
        <h3>User Data:</h3>
        <p><strong>ID:</strong> {{ profile.sub }}</p>
        <p><strong>Email:</strong> {{ profile.email }}</p>
      </div>

      <div
        v-if="message"
        class="message"
        :class="{ error: message.includes('Error') }"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  background-color: #f3f4f6;
  color: #333;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px;
}

h2 {
  margin-top: 0;
  text-align: center;
  color: #111827;
}

.input-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #2563eb;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.profile-actions {
  display: flex;
  gap: 10px;
  margin-top: 1.5rem;
}

.secondary-btn {
  background-color: #10b981;
}

.secondary-btn:hover {
  background-color: #059669;
}

.danger-btn {
  background-color: #ef4444;
}

.danger-btn:hover {
  background-color: #dc2626;
}

.toggle-text {
  text-align: center;
  margin-top: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
}

.profile-card {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  word-break: break-all;
}

.message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: #d1fae5;
  color: #065f46;
  text-align: center;
  font-size: 0.875rem;
}

.message.error {
  background-color: #fee2e2;
  color: #991b1b;
}
</style>
